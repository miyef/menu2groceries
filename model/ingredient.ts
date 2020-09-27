import Qty from "js-quantities";

interface Ingredient {
  name: string;
  quantity: Qty;
}

class Ingredient implements Ingredient {
  name: string;
  quantity: Qty;

  constructor(name: string, quantity: string) {
    this.name = this.sanitizeInput(name);
    this.quantity = Qty(this.sanitizeInput(quantity));
  }

  sanitizeInput(input: string): string {
    return input.trim().toLowerCase();
  }
}

export { Ingredient };
