import { Api, ApiListResponse } from './base/api';
import { IOrder, IOrderResult, IGood } from "../types";

export interface ILarekAPI {
  getGoodsList: () => Promise<IGood[]>;
  orderGoods: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekAPI extends Api implements ILarekAPI {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getGoodsList(): Promise<IGood[]> {
    return this.get('/product').then((data: ApiListResponse<IGood>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image
      }))
    );
  }

  orderGoods(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order).then(
      (data: IOrderResult) => data
    );
  }
}
