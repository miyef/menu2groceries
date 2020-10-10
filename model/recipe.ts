import { Ingredient } from "./ingredient";
import { JoinedQuantities } from "./joined_quantities";

type RecipeIngredients = Record<Ingredient["name"], JoinedQuantities>;

interface Recipe {
  name: string;
  ingredients: RecipeIngredients;

  disallowIngredientsMultipleOccurrence(): void;
  addIngredient(name: string, quantity: string): void;
}

class Recipe implements Recipe {
  // whether to allow an ingredient to occur multiple different times in a recipe
  allowIngredientsMultipleOccurrence = true;

  constructor(name: string) {
    this.name = name;
    this.ingredients = {};
  }

  getNumberOfIngredients(): number {
    return Object.keys(this.ingredients).length;
  }

  disallowIngredientsMultipleOccurrence(): void {
    this.allowIngredientsMultipleOccurrence = false;
  }

  addIngredient(name: string, quantity: string): void {
    const ingredient = new Ingredient(name, quantity);

    if (this.ingredients[ingredient.name]) {
      if (!this.allowIngredientsMultipleOccurrence) {
        throw Error(
          `ingredient ${ingredient.name} exists multiple times in the same recipe ${this.name}`
        );
      }
      this.ingredients[ingredient.name] = this.ingredients[
        ingredient.name
      ].addQuantity(ingredient.quantity);
      return;
    }
    this.ingredients[ingredient.name] = new JoinedQuantities([
      ingredient.quantity,
    ]);
  }
}

interface RecipeBook {
  add(recipe: Recipe): void;
  get(name: string): Recipe;
}

class RecipeBook implements RecipeBook {
  recipeMap: Record<string, Recipe>;

  constructor() {
    this.recipeMap = {};
  }

  add(recipe: Recipe): void {
    // if (Object.keys(recipe.ingredients).length == 0) {
    //   throw Error(
    //     `failed to add recipe ${recipe.name} to recipe book, it has no ingredients`
    //   );
    // }

    if (this.recipeMap[recipe.name]) {
      throw Error(
        `failed to add recipe ${recipe.name} to recipe book, a recipe with the same name already exists`
      );
    }

    this.recipeMap[recipe.name] = recipe;
  }

  get(name: string): Recipe {
    if (!this.recipeMap[name]) {
      throw Error(`failed to find recipe ${name} in recipe book`);
    }
    return this.recipeMap[name];
  }
}

export { Recipe, RecipeBook };
