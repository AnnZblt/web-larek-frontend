import { Form } from "./common/Form";
import { IOrder } from "../types";
import { IEvents } from "./base/events";

export class Order extends Form<IOrder> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }

  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
  }

  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  }
}