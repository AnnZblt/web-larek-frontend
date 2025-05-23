import { Component } from "./base/Component";
import { Category, ICard } from "../types";

export class Card extends Component<ICard> {
    protected _category: HTMLElement; // категория известна всегда
    protected _title: HTMLElement; // название товара известно всегда
    protected _price: HTMLElement; // цена есть всегда
    protected _image?: HTMLImageElement; // изображения может не быть
    protected _description?: HTMLElement; // описания может не быть
    protected _button: HTMLButtonElement; // любой товар в теории можно добавить в корзину

    constructor(protected blockName: string, container: HTMLElement) {
        super(container);

        this._category = container.querySelector(`.${blockName}__category`);
        this._title = container.querySelector(`.${blockName}__title`);
        this._image = container.querySelector(`.${blockName}__image`) ?? undefined;
        this._price = container.querySelector(`.${blockName}__price`);
        this._description = container.querySelector(`.${blockName}__text`);
        this._button = container.querySelector(`.${blockName}__button`);
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set category(value: string) {
        this.setText(this._category, value);
    }

    set price(value: number | null) {
        if (this._price) {
            if (value !== null) {
                this.setText(this._price, `${value} синапсов`);
            } else {
                this.setText(this._price, 'Бесценно');
                if (this._button !== null) {
                    this._button.disabled = true;
                }
            }
        }
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    applyCategoryClass(category: Category): void {
        switch (category) {
            case 'софт-скил':
                this._category.classList.add('card__category_soft');
                break;
            case 'хард-скил':
                this._category.classList.add('card__category_hard');
                break;
            case 'другое':
                this._category.classList.add('card__category_other');
                break;
            case 'дополнительное':
                this._category.classList.add('card__category_additional');
                break;
            case 'кнопка':
                this._category.classList.add('card__category_button');
                break;
            default:
                break;
        }
    }

    get priceNumber(): number {
        if (this._price.textContent === 'Бесценно') return 0;
        return parseInt(this._price.textContent || '0');
    }

    get button(): HTMLButtonElement {
        return this._button;
    }

    disableButton(value: boolean): void {
        if (this._button !== null) {
            this.setDisabled(this._button, value);
        }
    }
}