import { Model } from "./base/Model";
import { FormErrors, IAppState, TGoodFull, IOrder, IOrderForm, IContactsForm } from "../types";

export type CatalogChangeEvent = {
  catalog: GoodItem[]
};

export class GoodItem extends Model<TGoodFull> {
  id: string;
  description?: string;
  image?: string;
  title: string;
  price: number;
  category: string;
}

export class AppState extends Model<IAppState> {
  basket: GoodItem[];
  catalog: GoodItem[];
  order: IOrder = {
    payment: '',
    address: '',
    email: '',
    phone: '',
    total: 0,
    items: []
  };
  formErrors: FormErrors = {};

  initBasket(): void {
    this.basket = [];
    this.emitChanges('basket:change', { basket: this.basket });
  }

  basketCheck(items: GoodItem[], targetId: string): boolean {
    return items.some(item => item.id === targetId);
  }

  addToBasket(item: GoodItem): void {
    this.basket.push(item);
    this.emitChanges('basket:change', { basket: this.basket });
  }

  getItems(): string[] {
    return this.basket.map(item => item.id);
  }

  removeFromBasket(id: string): void {
    this.basket = this.basket.filter(item => item.id !== id);
  }

  getTotal(): number {
    return this.basket.reduce((sum, item) => sum + item.price, 0);
  }

  clearBasket(): void {
    this.basket = [];
    this.order = {
      payment: '',
      address: '',
      email: '',
      phone: '',
      total: 0,
      items: []
    };
  }

  setCatalog(items: TGoodFull[]): void {
    this.catalog = items.map(item => new GoodItem(item, this.events));
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  setOrderField(field: keyof IOrderForm, value: string): void {
    this.order[field] = value;
    if (this.validateOrderForm()) {
      // делает кнопку сабмита доступной
    }
  }

  setContactsField(field: keyof IContactsForm, value: string): void {
    this.order[field] = value;
    if (this.validateContactsForm()) {
      // делает кнопку сабмита доступной
    }
  }

  validateOrderForm(): boolean | number {
    const errors: Partial<IOrderForm> = {};

    if (!this.order.payment) {
      errors.payment = 'Выберите способ оплаты';
    }

    if (!this.order.address) {
      errors.address = 'Укажите адрес доставки';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  validateContactsForm(): boolean | number {
    const errors: Partial<IContactsForm> = {};
    if (!this.order.email) {
      errors.email = 'Укажите email';
    }

    if (!this.order.phone) {
      errors.phone = 'Укажите телефон';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }
}
