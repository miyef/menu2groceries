import { Ingredient } from "./ingredient";
import { JoinedQuantities } from "./joined_quantities";

type GroceriesList = Record<Ingredient["name"], JoinedQuantities>;

export { GroceriesList };
