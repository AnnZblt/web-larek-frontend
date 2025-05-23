import './scss/styles.scss';

import { LarekAPI } from "./components/LarekAPI";
import { API_URL, CDN_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/events";
import { cloneTemplate, createElement, ensureElement } from "./utils/utils";
import { Page } from "./components/Page";
import { Modal } from "./components/common/Modal";
import { AppState, CatalogChangeEvent, GoodItem } from "./components/AppData";
import { Card } from "./components/Card";
import { IOrderForm, IContactsForm, Category } from "./types";
import { Basket } from "./components/common/Basket";
import { Order } from "./components/Order";
import { Success } from "./components/common/Success";

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Мониторинг событий для отладки
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
});

// Модель данных приложения
const appData = new AppState({}, events);
appData.initBasket();

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Встраиваемое в modal содержимое
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Order(cloneTemplate(contactsTemplate), events);

// Брокер в set catalog иницирует событие изменения
events.on<CatalogChangeEvent>('items:changed', () => {
  page.gallery = appData.catalog.map(item => {
    const card = new Card('card', cloneTemplate(cardCatalogTemplate));

    card.applyCategoryClass(item.category as Category);

    const renderedCard = card.render({
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });

    renderedCard.addEventListener('click', () => {
      events.emit('card:select', item)
    })

    return renderedCard;
  });
});

// Открыть корзину
events.on('basket:open', () => {
  modal.render({
    content: createElement<HTMLElement>('div', {}, [
      basket.render()
    ])
  });

  basket.items = appData.basket.map((item, index) => {
    const compactCard = new Card('card', cloneTemplate(cardBasketTemplate));
    const renderedBasketCard = compactCard.render({
      title: item.title,
      price: item.price,
    });

    const itemIndex = renderedBasketCard.querySelector('.basket__item-index');
    itemIndex.textContent = String(index + 1);

    const deleteButton = renderedBasketCard.querySelector('.basket__item-delete');
    deleteButton.addEventListener('click', () => {
      events.emit('basket:delete', { id: item.id });
    });

    return renderedBasketCard;
  })

  basket.total = appData.getTotal();

});

// Изменения в списке корзины
events.on('basket:change', () => {
  page.counter = appData.basket.length;
});

//Удаление элементов из корзины
events.on('basket:delete', (payload: { id: string }) => {
  const { id } = payload;

  appData.removeFromBasket(id);
  events.emit('basket:open');
  events.emit('basket:change');
});

// Открыть превью
events.on('card:select', (item: GoodItem) => {
  const showItem = (item: GoodItem) => {
    const card = new Card('card', cloneTemplate(cardPreviewTemplate));

    card.applyCategoryClass(item.category as Category);

    if (appData.basketCheck(appData.basket, item.id)) {
      card.disableButton(true);
    }

    modal.render({
      content: card.render({
        title: item.title,
        image: item.image,
        description: item.description,
        category: item.category,
        price: item.price,
      })
    });

    card.button.addEventListener('click', () => {
      appData.addToBasket(item);
      card.disableButton(true);
    });
  };
  showItem(item);
});

// Блокирует прокрутку страницы при открытом модальном окне
events.on('modal:open', () => {
  page.locked = true;
});

// Разблокирует прокрутку
events.on('modal:close', () => {
  page.locked = false;
});

// Изменения в первой форме 
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
  const { payment, address } = errors;

  order.valid = !payment && !address;
  order.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
});

// Изменения во второй форме
events.on('formErrors:change', (errors: Partial<IContactsForm>) => {
  const { email, phone } = errors;

  contacts.valid = !email && !phone;
  contacts.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
});

// Валидируем первую форму
events.on(/^order\.(address|payment):change/, (data: { field: keyof IOrderForm, value: string }) => {
  appData.setOrderField(data.field, data.value);
});


// Валидируем вторую форму
events.on(/^contacts\.(email|phone):change/, (data: { field: keyof IContactsForm, value: string }) => {
  appData.setContactsField(data.field, data.value);
});

// Открыть форму заказа с методом оплаты
events.on('order:first', () => {
  appData.order.total = appData.getTotal();
  appData.order.items = appData.getItems();

  modal.render({
    content: order.render({
      payment: appData.order.payment || '',
      address: appData.order.address || '',
      valid: false,
      errors: []
    })
  });
});

// Открыть форму заказа с контактами
events.on('order:second', () => {
  modal.render({
    content: contacts.render({
      email: '',
      phone: '',
      valid: false,
      errors: []
    })
  });
});

// Сабмит в первой форме вызывает событие открытия следующей формы
events.on('order:submit', () => {
  events.emit('order:second');
});

// Сабмит из второй формы вызывает окно об успешном оформлении заказа и отправку данных на сервер
events.on('contacts:submit', () => {
  api.orderGoods(appData.order)
    .then(() => {
      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
          modal.close();
          appData.clearBasket();
          events.emit('basket:change');
        }
      });
      success.setDescription(appData.order.total);
      modal.render({
        content: success.render({}),
      });
    })
    .catch(err => {
      console.error(err);
    });
});

// Получаем товары с апи
api.getGoodsList()
  .then(appData.setCatalog.bind(appData))
  .catch(err => {
    console.error(err);
  });