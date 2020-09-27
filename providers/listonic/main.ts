import { GroceriesList } from "../../model/menu";
import { GroceriesListProvider } from "../../model/provider";
import { ListonicProviderConfig } from "./config";
import { JoinedQuantities } from "../../model/joined_quantities";
import axios, { AxiosResponse } from "axios";

type ListonicIngredient = {
  Name: string;
  ListId: string;
  Amount: string;
  Unit: string;
  Description: string;
  Id: string | null;
  Checked: 0 | 1;
};

class ListonicGroceriesListProvider implements GroceriesListProvider {
  config: ListonicProviderConfig;

  constructor(config: Record<string, unknown>) {
    const providerConfig = new ListonicProviderConfig(config);
    this.config = providerConfig;
  }

  listonicApiRequest(
    method: "POST" | "GET" | "PATCH" | "DELETE",
    url: string | null,
    data: ListonicIngredient | null
  ): Promise<AxiosResponse> {
    return axios.request({
      method: method,
      url: url || this.config.Url,
      headers: this.config.ListonicHeaders,
      data: data,
    });
  }

  async AddToGroceries(groceriesList: GroceriesList): Promise<boolean> {
    const ingredientsToAdd = this.convertToListonicPayload(groceriesList);
    const currentIngredients = await this.getListonicGroceryList();
    const currentIngredientsDict = Object.assign(
      {},
      ...currentIngredients.map((ingredient: ListonicIngredient) => ({
        [ingredient.Name]: ingredient,
      }))
    );

    const reqs = ingredientsToAdd.map((ingredient: ListonicIngredient) => {
      if (ingredient.Name in currentIngredientsDict) {
        const newIngredient = this.mergeIngredients(
          ingredient,
          currentIngredientsDict[ingredient.Name]
        );
        return this.listonicApiRequest(
          "PATCH",
          `${this.config.Url}/${currentIngredientsDict[ingredient.Name].Id}`,
          newIngredient
        );
      } else {
        return this.listonicApiRequest("POST", null, ingredient);
      }
    });

    await Promise.all(reqs);

    return true;
  }

  mergeIngredients(
    ingredient1: ListonicIngredient,
    ingredient2: ListonicIngredient
  ): ListonicIngredient {
    // TODO: convert ListonicIngredient into JoinedQuantity to properly merge
    // We don't merged purchased ingredients
    if (ingredient2.Checked == 1) {
      return ingredient1;
    }
    const ingredient = Object.assign({}, ingredient1, {
      Amount: "",
      Description: (
        ingredient1.Description || `${ingredient1.Amount} ${ingredient1.Unit}`
      ).concat(
        " + ",
        ingredient2.Description || `${ingredient2.Amount} ${ingredient2.Unit}`
      ),
    });
    return ingredient;
  }

  async getListonicGroceryList(): Promise<ListonicIngredient[]> {
    const res = await this.listonicApiRequest("GET", null, null);
    const list = res.data.filter((ingredient: any) => ingredient.Name);
    return list.map((ingredient: any) => ({
      Name: ingredient.Name,
      ListId: this.config.ListId,
      Amount: ingredient.Amount || "",
      Unit: ingredient.Unit || "",
      Id: ingredient.Id || null,
      Description: ingredient.Description || "",
    }));
  }

  RemoveFromGroceries(groceriesList: GroceriesList): void {
    throw Error("not implemented");
  }

  convertToListonicIngredient(
    ingredient_name: string,
    quantity: JoinedQuantities
  ): ListonicIngredient {
    return {
      Name: ingredient_name,
      ListId: this.config.ListId,
      Amount: quantity.isHomogenous() ? quantity.valueToString() : "",
      Unit: quantity.isHomogenous() ? quantity.unitToString() : "",
      Description: !quantity.isHomogenous() ? quantity.toString() : "",
      Id: null,
      Checked: 0,
    };
  }

  convertToListonicPayload(groceriesList: GroceriesList): ListonicIngredient[] {
    const res: ListonicIngredient[] = [];
    Object.keys(groceriesList).forEach((ingredient_name: string) => {
      res.push(
        this.convertToListonicIngredient(
          ingredient_name,
          groceriesList[ingredient_name]
        )
      );
    });
    return res;
  }
}

export { ListonicGroceriesListProvider };
