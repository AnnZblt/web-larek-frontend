// Тип категории
export type Category = 'другое' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'софт-скил';

// Данные товара с апи, которые потом используются в карточке
// Сделали описание опциональным, чтобы не дублировать Pick 
export interface IGood {
  _id: string;
  title: string;
  price: number;
  category: Category;
  description?: string;
  image: string;
}

// Товар для корзины
export type TGoodCompact = Pick<IGood, '_id' | 'title' | 'price'>;

// Товар для фулвью
export type TGoodFull = IGood;

// Интерфейс для самой карточки
export interface ICard {
  category: string;
  title: string;
  image?: string;
  price: number | null;
  description?: string;
}

// Данные приложения
export interface IAppState {
  catalog: IGood[];
  basket: string[];
  order: IOrder | null;
}

// Форма со способом оплаты и адресом доставки
export interface IOrderForm {
  payment: string;
  address: string;
}

//Форма с данными пользователя
export interface IContactsForm {
  email: string;
  phone: string;
}

//Сформированный заказ
export interface IOrder extends IOrderForm, IContactsForm {
  items: string[];
  total: number;
}

// Валидация ошибок
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Статус форм
export interface IFormState {
  valid: boolean;
  errors: string[];
}

// Cодержимое страницы с возможностью блокирования прокрутки
export interface IPage {
  catalog: HTMLElement[];
  locked: boolean;
}

// Содержимое модального окна 
export interface IModalData {
  content: HTMLElement;
}

// Изменяемые элементы корзины
export interface IBasketView {
  items: HTMLElement[];
  total: number;
}

// Данные для отображения в окне успешной отправки заказа на сервер
export interface ISuccess {
  total: number;
}

// Отслеживание событие клика в окне Success 
export interface ISuccessActions {
  onClick: () => void;
}

// Интерфейс для отправки заказа на сервер
export interface IOrderResult {
  id: string;
}