import { loadProviderConfig } from "./configProvider";
import { JoinedQuantities } from "./model/joined_quantities";
import { ProviderTypes } from "./model/provider";
import { GoogleSheetsMenuProvider } from "./providers/google-sheets/menu";
import { GoogleSheetsRecipesProvider } from "./providers/google-sheets/recipes";

async function main() {
  const GoogleRecipeProviderConfig = await loadProviderConfig(
    ProviderTypes.RecipeBookProvider,
    "google-sheets"
  );
  const recipeBook = await new GoogleSheetsRecipesProvider(
    GoogleRecipeProviderConfig
  ).GetRecipeBook();

  const GoogleMenuProviderConfig = await loadProviderConfig(
    ProviderTypes.MenuProvider,
    "google-sheets"
  );
  const menu = await new GoogleSheetsMenuProvider(
    recipeBook,
    GoogleMenuProviderConfig
  ).GetMenu();

  const groceriesList = menu.getGroceriesList();

  printGroceriesList(groceriesList);
}

function printGroceriesList(groceriesList: Record<string, JoinedQuantities>) {
  Object.keys(groceriesList).forEach((ingredient) => {
    console.log(`${ingredient}: ${groceriesList[ingredient].toString()}`);
  });
}

main().catch(console.error);
