import { Component } from "../base/Component";
import { ISuccess, ISuccessActions } from "../../types/index"

export class Success extends Component<ISuccess> {
  protected _close: HTMLElement;
  protected _desc: HTMLElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);

    this._close = this.container.querySelector('.order-success__close');
    this._desc = this.container.querySelector('.order-success__description');

    if (actions?.onClick) {
      this._close.addEventListener('click', actions.onClick);
    }
  }

  setDescription(total: number): void {
    this.setText(this._desc, `Списано ${total} синапсов`);
  }
}