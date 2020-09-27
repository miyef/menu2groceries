import { GroceriesList } from "../../model/menu";
import { GroceriesListProvider } from "../../model/provider";
import { ListonicProviderConfig } from "./config";

class ListonicGroceriesListProvider implements GroceriesListProvider {
  constructor(config: Record<string, unknown>) {
    const providerConfig = new ListonicProviderConfig(config);
    throw Error("not implemented");
  }
  AddToGroceries(groceriesList: GroceriesList): void {
    throw Error("not implemented");
  }
  RemoveFromGroceries(groceriesList: GroceriesList): void {
    throw Error("not implemented");
  }
}

export { ListonicGroceriesListProvider };
