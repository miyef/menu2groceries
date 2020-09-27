import { RecipeBook } from "./recipe";
import { Menu } from "./menu";
import { GroceriesList } from "./groceries_list";

const enum ProviderTypes {
  RecipeBookProvider = "recipe",
  MenuProvider = "menu",
  GroceriesListProvider = "groceriesList",
}

interface RecipeBookProvider {
  GetRecipeBook(): Promise<RecipeBook>;
}

interface MenuProvider {
  recipeBook: RecipeBook;

  GetMenu(): Promise<Menu>;
}

interface GroceriesListProvider {
  AddToGroceries(list: GroceriesList): void;
  RemoveFromGroceries(list: GroceriesList): void;
}

export {
  MenuProvider,
  RecipeBookProvider,
  GroceriesListProvider,
  ProviderTypes,
};
