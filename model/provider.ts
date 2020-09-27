import { RecipeBook } from "./recipe";
import { Menu } from "./menu";

const enum ProviderTypes {
  RecipeBookProvider = "recipe",
  MenuProvider = "menu",
}

interface RecipeBookProvider {
  GetRecipeBook(): Promise<RecipeBook>;
}

interface MenuProvider {
  recipeBook: RecipeBook;

  GetMenu(): Promise<Menu>;
}

export { MenuProvider, RecipeBookProvider, ProviderTypes };
