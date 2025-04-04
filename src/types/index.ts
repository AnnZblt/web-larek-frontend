type Category = 'другое' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'софт-скил';

interface ICard {
  _id: string;
  title: string;
  price: number;
  category: Category;
  description: string;
  image: string;
  isCompact: boolean;
  isFull: boolean;
}

type Payment = 'Онлайн' | 'При получении';

interface IUser {
  paymentMethod: Payment;
  address: string;
  phoneNumber: string;
  email: string;
}

interface IBasket {
  basketCards: TCardCompact[] | null;
  totalBasket: number;
}

interface ICardsData {
  cards: ICard[];
  preview: string | null;
  getCard(cardId: string): ICard;
}

interface IBasketData {
  getBasket(): TCardCompact;
  setBasket(card: ICard): void;
  deleteBasket(cardId: string, payload: Function | null): void;
  updateBasket(basketCards: TCardCompact[], payload: Function | null): void;
  getTotalBasket(): number;
}

interface IUserData {
  setUserInfo(userData: IUser): void;
  checkUserValidation(data: Record<keyof IUser, string>): boolean;
}

type TCardGallery = Pick<ICard, '_id' | 'category' | 'title' | 'price' | 'image'>;

type TCardCompact = Pick<ICard, '_id' | 'title' | 'price' | 'isCompact'>;

type TCardFull = Pick<ICard, '_id' | 'title' | 'price' | 'category' | 'description' | 'image' | 'isFull'>;


