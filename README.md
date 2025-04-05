# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данные, используемые в приложении

Карточка

```
interface ICardBase {
  _id: string;
  title: string;
  price: number;
  category: Category;
  description: string;
  image: string;
}
```

Модификаторы для отображения разных видов карточки

```
interface ICard extends ICardBase {
  isCompact?: boolean;
  isFull?: boolean;
}
```

Данные карточки для отображения в галерее

```
type TCardGallery = Pick<ICardBase, '_id' | 'category' | 'title' | 'price' | 'image'>;
```

Данные карочки для отображения в корзине
```
type TCardCompact = Pick<ICardBase, '_id' | 'title' | 'price'>;
```

Данные карточки для просмотра в большом окне
```
type TCardFull = ICardBase & { 'isFull': true };
```


Информация о пользователе

```
interface IUser {
  paymentMethod: PaymentMethod;
  address: string;
  phoneNumber: string;
  email: string;
}
```

Информация о корзине

```
interface IBasket {
  items: TCardCompact[];
  totalPrice: number;
}
```

Информация о заказе

```
interface IOrder {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}
```

Интерфейс для модели данных карточек

```
interface ICardsData {
  cards: ICard[];
  preview: string | null;
  addToBasket: string | null;
}
```

Интерфейс для работы с корзиной

```
interface IBasketData {
  getBasket(): IBasket;
  setBasket(card: ICard): void;
  deleteBasket(cardId: string, payload?: () => void): void;
  updateBasket(cards: TCardCompact[], payload?: () => void): void;
  getTotalBasket(): number;
  clearBasket(): void;
}
```

Интерфейс для работы с данными пользователя

```
interface IUserData {
  setUserInfo(userData: IUser): void;
  checkUserValidation(data: Record<keyof IUser, string>): boolean;
}
```


## Описание проекта

Проект "WEB-ларёк" реализует пример типового интернет-магазина, в данном случае товаров для разработчиков. Пользователь может просматривать галерею товаров, выбирать товары и покупать их. Проект реализован на TypeScript и представляет собой SPA (Single Page Application) с использованием API для получения данных о товарах.


## Описание интерфейса

Интерфейс можно условно разделить на 3 процесса:

  1. Просмотр галереи товаров (mainPage)
  2. Просмотр конкретного товара и добавление его в корзину (ModalFullview)
  3. Оформление заказа (BasketModal, UserInfoModal, ModalSuccess)

Так как модальные окна в проекте однотипные, то их общая логика и структура вынесена в класс Modal. Все модальные окна наследуются от него и переопределяют методы для своих нужд.


## Архитектура проекта (MVP)

Код приложения разделен на на слои, согласно парадигме MVP: 
  - Слой данных отвечает за работу с данными, бизнес-логику и взаимодействие с хранилищем.
  - Слой представления отображает информацию пользователю и передает события. Он не содержит логики и только вызывает методы презентера.
  - Презентер — посредник между бизнес-логикой и слоем данных (Model и View), получает данные из модели, подготавливает их и передает в View.



### Базовый код

#### Класс Api

Предоставляет базовый функционал для отправки HTTP-запросов. В конструктор передается базовый URL сервера и необязательный объект с заголовками.

Методы: 
  - `get` - выполняет GET-запрос по указанному адресу и возвращает промис с ответом сервера в виде объекта. По умолчанию используется метод GET.
  - `post` - отправляет переданный объект данных в формате JSON на указанный адрес, возвращая результат запроса.

#### Класс EventEmitter

Механизм событийного взаимодействия, который позволяет отправлять и обрабатывать события в системе. Используется в презентере для управления событиями и в других слоях для их генерации.

Основные методы, определенные интерфейсом `IEvents`:
  - `on` - подписывает обработчик на событие.
  - `emit` - инициирует событие.
  - `trigger` - возвращает функцию, вызывающую заданное событие.



### Слой данных

#### Класс CardsData

Класс управляет данными карточек. Отвечает за хранение, выбор и подготовку данных для отображения. В конструктор передаётся экземпляр EventEmitter.
Поля:
  - _cards: ICard[] - массив карточек. Не изменяется напрямую.
  - _preview: string | null - id карточки для отображения в модальном окне.
  - events: IEvents - брокер событий.

Методы: 
  - getCard(cardId: string): ICard - возвращает карточку по id.
  - Сеттеры и геттеры — для доступа к полям класса.


#### Класс BasketData

Обрабатывает данные корзины. В конструктор передаётся экземпляр EventEmitter.

Поля:
  - basketCards: TCardCompact[] | null - массив карточек корзины.

Методы для работы с данными в корзине:
  - getBasket(): TCardCompact[] - возвращает текущие карточки корзины.
  - setBasket(card: ICard): void - добавляет карточку в корзину.
  - deleteBasket(cardId: string, payload: Function | null): void - удаляет карточку и, если передан callback, вызывает его.
  - getTotalBasket(): number - считает сумму корзины.
  - Сеттеры и геттеры — для работы с полями класса.


#### Класс UserData

Отвечает за пользовательские данные для оформления заказа. В конструктор передаётся экземпляр EventEmitter.

Поля:
  - paymentMethod: Payment - выбранный способ оплаты.
  - address: string - адрес доставки.
  - phoneNumber: string - телефон пользователя.
  - email: string - email пользователя.

Методы для работы с данными в корзине:
  - setUserInfo(userData: IUser): void - сохраняет введённые пользователем данные.
  - checkUserValidation(data: Record<keyof IUser, string>): boolean - валидирует данные по типу IUser.



### Слой представления

Классы отвечают за визуализацию данных.

#### Класс Modal

Компонент, отвечающий за отображение модального окна. Имеет контейнер с кнопкой закрытия и областью контента (`.modal__content`), куда вставляется внешний компонент: форма, карточка, корзина и т.п.

Поля:
  - modal: HTMLElement - элемент модального окна.
  - events: IEvents - брокер событий.

#### Встраиваемые компоненты (контент модального окна)

Следующие компоненты не наследуют `Modal`, но могут быть встроены внутрь модального окна через `Modal.open()`:

  - `UserInfoModal` — формы ввода пользовательских данных.
  - `ModalSuccess` — сообщение об успешной оплате.
  - `ModalFullview` — карточка товара в увеличенном формате.
  - `BasketModal` — содержимое корзины.

#### Basket Modal

BasketView — это компонент, который отвечает за отображение содержимого корзины пользователя. Он отображает список добавленных товаров по порядковым номерам, общую стоимость и предоставляет возможность удалять товары из корзины.

Поля:
  - containerElement: HTMLElement — DOM-элемент, в который вставляются карточки товаров корзины.
  - basketData: IBasketData — объект, содержащий данные о корзине (получение, обновление и удаление товаров из корзины).
  - totalElement: HTMLElement — DOM-элемент, отображающий общую стоимость корзины

Методы:
  - render(): void - метод отвечает за рендеринг всех товаров, которые находятся в корзине. Для каждого товара будет создан отдельный элемент, который будет вставлен в containerElement. Также обновляется общая стоимость корзины в totalElement.
  - addCard(cardElement: HTMLElement): void - Добавляет товар в контейнер корзины, создавая новый DOM-элемент для отображения карточки.
  - removeCard(cardId: string): void - Удаляет товар из корзины по его id. После удаления обновляется DOM и пересчитывается общая стоимость корзины.
  - updateTotalPrice(): void - Пересчитывает общую стоимость корзины, вызывая метод из класса BasketData, и обновляет отображение в totalElement.
  - clearBasket(): void - Очищает корзину, удаляя все элементы и сбрасывая общую стоимость. Также вызывает соответствующие методы из BasketData для очистки данных корзины.

#### Класс UserInfoModal

Компонент модального окна с формой. Используется для отображения форм, в которых пользователь вводит информацию (например, адрес, email и пр.). Компонент ищет форму по имени (formName) и собирает все поля ввода внутри неё.

Поля: 
  - submitButton: HTMLButtonElement - кнопка подтверждения отправки формы и переход к следующему шагу.
  - _form: HTMLFormElement - HTML-элемент формы, найденной по имени.
  - formName: string - значение атрибута name формы для поиска нужного DOM-элемента.
  - inputs: NodeListOf <HTMLInputElement> - список полей ввода внутри формы.

Методы:
  - setValid(isValid: boolean): void - активирует/деактивирует кнопку подтверждения.
  - getInputValues(): Record<string, string> - возвращает данные из полей формы.
  - close(): void - акрывает модальное окно и сбрасывает состояние формы.
  - get form: HTMLElement - возвращает элемент формы.

#### Классы-наследники

  1.  Класс PaymentModal  
PaymentModal — это класс для модалки, где пользователь выбирает метод оплаты и вводит свой адрес.  
Особенности:
  - Обрабатывает выбор метода оплаты.
  - Валидирует введенный адрес.

  2. Класс ContactInfoModal  
ContactInfoModal — это класс для модалки, где пользователь вводит контактные данные, такие как номер телефона и email.  
Особенности:
  - Валидирует email и телефон по стандартным регулярным выражениям, т.к. в разметке типы значений для полей ввода не заданы.

#### Класс ModalFullview

Предназначен для показа карточки товара в модальном окне.

Поля:
  - cardButton - кнопка добавления товара в корзину.

Методы:
  - open(data: ICard): void - отображает карточку в модальном окне.
  - close(): void - очищает содержимое и закрывает модалку.

#### Класс ModalSuccess

Показывает сообщение об успешном заказе и очищает корзину.

Поля:
  - successDescription: HTMLTextElement - элемент разметки с уведомлением об успешном заказе. Показывает итоговую стоимость товаров из корзины.
  - successButton: HTMLButtonElement - кнопка для закрытия попапа и очищения корзины. 

Методы:
  - clearOrder(): void - очищает корзину при успешном заказе.

#### Класс Card

Отображает карточку товара с данными. Подключает EventEmitter и обрабатывает взаимодействия с пользователем.

Поля:
  - DOM-элементы карточки: название, изображение, описание, категория, цена и т.д.
  - events: IEvents — брокер событий.

Методы:
  - setData(cardData: ICard): void - заполняет карточку данными.
  - deleteCard(): void - метод для удаления карточки.
  - render(): HTMLElement - возвращает готовую карточку для вставки.
  - get id(): string - возвращает id карточки.

#### Класс CardsBasketContainer

Отвечает за отображение списка карточек в корзине.

Поля:
  - containerElement: HTMLElement — DOM-элемент для вставки карточек.

Методы:
  - addCard(cardElement: HTMLElement): void — добавляет карточку в контейнер.
  - set container(cards: HTMLElement[]): void — полностью обновляет содержимое корзины.


### Слой коммуникации

#### Класс AppApi

Обёртка над Api. В конструктор передаётся экземпляр класса Api, предоставляются методы для работы с сервером.

## Взаимодействие компонентов

Файл `index.ts` выполняет роль презентера, управляя связью между слоями через брокер событий `EventEmitter`.  
В `index.ts` сначала создаются экземпляры всех классов, затем настраиваются подписки на события и обработчики.

*Список событий:*  
*Генерируются слоями данных:*
  - `card:selected` - изменения карточки для модального окна.
  - `cards:changed` - изменения в массиве карточек.
  - `card:previewClear` - сброс выбранной карточки.
  - `user:changed` - обновление пользовательских данных.

*Генерируются представлением:*
  - `userPayment:open` - открытие модального окна формы оплаты и адреса.
  - `userContacts:open` - открытие модального окна контактов.
  - `success:open` - показ модального окна с подтверждением заказа.
  - `basket:open` - открытие модального окна корзины.
  - `card:select` - выбор карточки для показа.
  - `card:delete` - удаление карточки из корзины.
  - `edit-payment:input` - изменение данных формы оплаты и адреса.
  - `edit-contacts:input` - изменение контактных данных.
  - `edit-payment:submit` - подтверждение формы оплаты и адреса.
  - `edit-contacts:submit` - подтверждение контактной формы и отправка данных.
  - `edit-payment:validation` - необходимость проверки формы оплаты и адреса.
  - `edit-contacts:validation` - необходимость проверки контактных данных.