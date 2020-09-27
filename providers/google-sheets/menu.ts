import { MenuProvider } from "../../model/provider";
import { Menu, Meal } from "../../model/menu";
import { RecipeBook } from "../../model/recipe";

import { GoogleSheetsProvider } from "./main";

class GoogleSheetsMenuProvider
  extends GoogleSheetsProvider
  implements MenuProvider {
  recipeBook: RecipeBook;

  constructor(recipeBook: RecipeBook, config: Record<string, unknown>) {
    super(config);
    this.recipeBook = recipeBook;
  }

  parseCell(cell: string | null | undefined): Meal[] {
    if (!cell) {
      throw Error(`found empty recipe name in cell`);
    }

    return cell
      .split("+")
      .map((mealString) => mealString.trim().toLowerCase())
      .filter((mealString) => !mealString.startsWith("restes"))
      .map((mealString) => {
        let quantity = parseFloat(mealString);
        if (isNaN(quantity)) {
          quantity = 1;
        }
        const name = mealString.replace(/^[0-9.]*/, "");
        return new Meal(name, quantity);
      });
  }

  async GetMenu(): Promise<Menu> {
    const recipesSheet = await super.getSheet(this.ranges);

    const cells = super.getCells(recipesSheet);

    const menu = new Menu(this.recipeBook);
    cells.forEach((cell) => {
      const meal = this.parseCell(cell);
      meal.forEach((meal) => menu.addMeal(meal));
    });

    return menu;
  }
}

export { GoogleSheetsMenuProvider };
