import { GroceriesList } from "./groceries_list";
import { Ingredient } from "./ingredient";
import { JoinedQuantities } from "./joined_quantities";
import { Recipe, RecipeBook } from "./recipe";

interface Meal {
  recipeName: Recipe["name"];
  quantity: number;
}

class Meal implements Meal {
  recipeName: Recipe["name"];
  quantity: number;

  constructor(recipeName: string, quantity: number) {
    this.recipeName = this.sanitizeInput(recipeName);
    this.quantity = quantity;
  }

  sanitizeInput(input: string): string {
    return input.trim().toLowerCase();
  }
}

interface Menu {
  addMeal(meal: Meal): void;
  getGroceriesList(): GroceriesList;
}

class Menu {
  mealMap: Record<Meal["recipeName"], Meal["quantity"]>;
  recipeBook: RecipeBook;

  constructor(recipeBook: RecipeBook) {
    this.mealMap = {};
    this.recipeBook = recipeBook;
  }

  addMeal(meal: Meal): void {
    const recipeName = meal.recipeName;

    try {
      this.recipeBook.get(recipeName);
    } catch (e: unknown) {
      throw Error(`could not add meal: ${e}`);
    }
    if (!this.mealMap[recipeName]) {
      this.mealMap[recipeName] = meal.quantity;
      return;
    }
    this.mealMap[recipeName] += meal.quantity;
  }

  getGroceriesList(): Record<Ingredient["name"], JoinedQuantities> {
    const groceriesList: Record<Ingredient["name"], JoinedQuantities> = {};

    for (const [recipe_name, meal_quantity] of Object.entries(this.mealMap)) {
      const ingredients = this.recipeBook.get(recipe_name).ingredients;

      for (const [ingredient_name, ingredient_quantity] of Object.entries(
        ingredients
      )) {
        const quantityToAdd = ingredient_quantity.mul(meal_quantity);
        if (groceriesList[ingredient_name]) {
          groceriesList[ingredient_name] = groceriesList[
            ingredient_name
          ].concatQuantity(quantityToAdd);
          continue;
        }

        groceriesList[ingredient_name] = quantityToAdd;
      }
    }

    return groceriesList;
  }
}

export { Menu, Meal, GroceriesList };
