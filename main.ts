import { loadProviderConfig } from "./configProvider";
import { JoinedQuantities } from "./model/joined_quantities";
import { ProviderTypes } from "./model/provider";
import { GoogleSheetsMenuProvider } from "./providers/google-sheets/main";
import { GoogleSheetsRecipeBookProvider } from "./providers/google-sheets/main";

async function main() {
  const [
    GoogleSheetsRecipeProviderConfig,
    GoogleSheetsMenuProviderConfig,
  ] = await Promise.all([
    loadProviderConfig(ProviderTypes.RecipeBookProvider, "google-sheets"),
    loadProviderConfig(ProviderTypes.MenuProvider, "google-sheets"),
  ]);
  const recipeBook = await new GoogleSheetsRecipeBookProvider(
    GoogleSheetsRecipeProviderConfig
  ).GetRecipeBook();

  const menu = await new GoogleSheetsMenuProvider(
    recipeBook,
    GoogleSheetsMenuProviderConfig
  ).GetMenu();

  const groceriesList = menu.getGroceriesList();

  printGroceriesList(groceriesList);
}

function printGroceriesList(groceriesList: Record<string, JoinedQuantities>) {
  Object.keys(groceriesList).forEach((ingredient) => {
    console.log(`${ingredient}: ${groceriesList[ingredient]}`);
  });
}

main().catch(console.error);
