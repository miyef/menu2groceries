import { Ingredient } from "./ingredient";
import Qty from "js-quantities";

interface JoinedQuantities {
  quantityList: Ingredient["quantity"][];

  mul(times: number): JoinedQuantities;
  addQuantity(qty: Ingredient["quantity"]): JoinedQuantities;
  concatQuantity(quantities: JoinedQuantities): JoinedQuantities;
  toString(): string;
  unitToString(): string;
  valueToString(): string;
  isHomogenous(): boolean;
}

class JoinedQuantities implements JoinedQuantities {
  quantityList: Ingredient["quantity"][];

  constructor(quantities: Ingredient["quantity"][]) {
    if (quantities.length == 0) {
      throw Error("cannot initialize joined quantities with an empty array");
    }
    this.quantityList = quantities;
  }

  addQuantity(newQty: Ingredient["quantity"]): JoinedQuantities {
    const result = new JoinedQuantities(this.quantityList);
    let added = false;
    result.quantityList.forEach((quantity, i) => {
      try {
        result.quantityList[i] = quantity.add(newQty);
        added = true;
        return;
      } catch (err) {}
    });
    if (!added) {
      result.quantityList.push(newQty);
    }
    return result;
  }

  concatQuantity(quantities: JoinedQuantities): JoinedQuantities {
    let result = new JoinedQuantities(this.quantityList);
    quantities.quantityList.forEach((quantity) => {
      result = result.addQuantity(quantity);
    });
    return result;
  }

  mul(times: number): JoinedQuantities {
    const result = new JoinedQuantities(this.quantityList);
    result.quantityList = result.quantityList.map((qty) => qty.mul(times));
    return result;
  }

  isHomogenous(): boolean {
    return this.quantityList.length == 1;
  }

  unitToString(): string {
    if (!this.isHomogenous()) {
      throw Error("can't get unit of quantity, quantity is not homogenous");
    }
    return this.quantityList[0].units();
  }

  valueToString(): string {
    if (!this.isHomogenous()) {
      throw Error("can't get value of quantity, quantity is not homogenous");
    }
    return this.quantityList[0].scalar.toString();
  }

  toString(): string {
    return this.quantityList.reduce((quantityString: string, quantity, i) => {
      if (i == 0) {
        quantityString += quantity.toString();
        return quantityString;
      }
      quantityString += `+${quantity.toString()}`;
      return quantityString;
    }, "");
  }

  static fromStringToJoinedQuantity(quantityInput: string): JoinedQuantities {
    const quantities: Qty[] = [];
    quantityInput
      .split("+")
      .forEach((quantity: string) => quantities.push(Qty.parse(quantity)));
    return new JoinedQuantities(quantities);
  }
}

export { JoinedQuantities };
