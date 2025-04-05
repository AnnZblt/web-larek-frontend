// Тип категории
type Category = 'другое' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'софт-скил';

// Тип оплаты
type PaymentMethod = 'online' | 'cash';

// Данные карточки с апи
interface ICardBase {
  _id: string;
  title: string;
  price: number;
  category: Category;
  description: string;
  image: string;
}

// Модификаторы для отображения разных видов карточки
interface ICard extends ICardBase {
  isCompact?: boolean;
  isFull?: boolean;
}

// Карточка для галереи
type TCardGallery = Pick<ICardBase, '_id' | 'category' | 'title' | 'price' | 'image'>;

// Карточка для корзины
type TCardCompact = Pick<ICardBase, '_id' | 'title' | 'price'>;

// Карточка для фулвью
type TCardFull = ICardBase & { 'isFull': true };

// Данные пользователя
interface IUser {
  paymentMethod: PaymentMethod;
  address: string;
  phoneNumber: string;
  email: string;
}

// Корзина
interface IBasket {
  items: TCardCompact[];
  totalPrice: number;
}

// Заказ
interface IOrder {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

// Работа с карточками
interface ICardsData {
  cards: ICard[];
  preview: string | null;
  getCard(cardId: string): ICard;
}

// Работа с корзиной
interface IBasketData {
  getBasket(): IBasket;
  setBasket(card: ICard): void;
  deleteBasket(cardId: string, payload?: () => void): void;
  updateBasket(cards: TCardCompact[], payload?: () => void): void;
  getTotalBasket(): number;
  clearBasket(): void;
}

//Работа с пользователем
interface IUserData {
  setUserInfo(userData: IUser): void;
  checkUserValidation(data: Record<keyof IUser, string>): boolean;
}