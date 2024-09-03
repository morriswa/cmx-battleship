
export class GameBoard {
  ship_1?: string[];
  ship_2?: string[];
  ship_3?: string[];
  ship_4?: string[];
  ship_5?: string[];

  constructor(data: any) {
    this.ship_1 = data.ship_1;
    this.ship_2 = data.ship_2;
    this.ship_3 = data.ship_3;
    this.ship_4 = data.ship_4;
    this.ship_5 = data.ship_5;
  }

  keys() {
    return ['ship_1', 'ship_2', 'ship_3', 'ship_4', 'ship_5'];
  }

  values() {
    return [this.ship_1, this.ship_2, this.ship_3, this.ship_4, this.ship_5];
  }

  entries() {
    return [['ship_1', this.ship_1], ['ship_2', this.ship_2], ['ship_3', this.ship_3], ['ship_4', this.ship_4], ['ship_5', this.ship_5]]
  }
}
