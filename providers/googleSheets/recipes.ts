import { Recipe, RecipeBook } from "../../model/recipe";
import { RecipeBookProvider } from "../../model/provider";

import { GoogleSheetsProvider } from "./base_provider";

class GoogleSheetsRecipeBookProvider
  extends GoogleSheetsProvider
  implements RecipeBookProvider {
  constructor(config: Record<string, unknown>) {
    super(config);
  }

  parseRow(row: (string | null | undefined)[]): Recipe {
    let recipe_name = row[0];

    if (!recipe_name) {
      throw Error(`found empty recipe name in row ${row}`);
    }

    recipe_name = recipe_name.trim().toLowerCase();

    const recipe = new Recipe(recipe_name);
    recipe.disallowIngredientsMultipleOccurrence();

    for (let i = 1; i < row.length - 2; i += 2) {
      const name = row[i];
      const qty = row[i + 1];

      if (!name && !qty) {
        continue;
      }

      if (!name || !qty) {
        throw Error(
          `found incorrect ingredient in ${recipe_name}, name: ${name}, quantity: ${qty}`
        );
      }
      recipe.addIngredient(name, qty);
    }

    return recipe;
  }

  async GetRecipeBook(): Promise<RecipeBook> {
    const recipesSheet = await super.getSheet(this.ranges);

    const rows = super.getRows(recipesSheet);
    const recipes = rows.map((row) => {
      return this.parseRow(row);
    });
    const recipeBook = new RecipeBook();
    recipes.forEach((recipe) => {
      if (recipe.getNumberOfIngredients() > 0) {
        recipeBook.add(recipe);
      }
    });
    return recipeBook;
  }
}

export { GoogleSheetsRecipeBookProvider };
