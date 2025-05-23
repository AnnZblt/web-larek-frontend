import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { IFormState } from "../../types/index"

export class Form<T> extends Component<IFormState> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this._errors = ensureElement<HTMLElement>('.form__errors', this.container);


    this.container.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLButtonElement;
      const field = target.name as keyof T;
      if (target.name && target.type === 'button') {
        this._handlePaymentButton(target);
        this.onButtonChange(field);
      }
    });

    this.container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    });

    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });
  }

  protected onInputChange(field: keyof T, value: string): void {
    const eventPrefix = this.container.name === 'contacts' ? 'contacts' : 'order';
    this.events.emit(`${eventPrefix}.${String(field)}:change`, {
      field,
      value
    });
  }

  protected onButtonChange(field: keyof T): void {
    this.events.emit(`order.payment:change`, {
      field: 'payment',
      value: field,
    });
  }

  private _handlePaymentButton(target: HTMLButtonElement): void {
    if (target.classList.contains('button_alt-active')) {
      return;
    }

    this.container
      .querySelectorAll('button[name][type="button"]')
      .forEach(btn => btn.classList.remove('button_alt-active'));

    target.classList.add('button_alt-active');
  }

  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  set errors(value: string) {
    this.setText(this._errors, value);
  }

  render(state: Partial<T> & IFormState): HTMLElement {
    const { valid, errors, ...inputs } = state;
    super.render({ valid, errors });
    Object.assign(this, inputs);
    return this.container;
  }
}