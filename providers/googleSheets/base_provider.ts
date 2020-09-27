import { google, sheets_v4 } from "googleapis";
import { GoogleSheetsProviderConfig } from "./config";

type SheetWithData = Omit<sheets_v4.Schema$Sheet, "data"> &
  Required<Pick<sheets_v4.Schema$Sheet, "data">>;

type RowWithValues = Required<sheets_v4.Schema$RowData>;

class GoogleSheetsProvider {
  sheets: sheets_v4.Sheets;
  sheetID: string;
  sheetName?: string;
  ranges?: string[];

  constructor(config: Record<string, unknown>) {
    const providerConfig = new GoogleSheetsProviderConfig(config);
    const auth = new google.auth.GoogleAuth({
      keyFilename: providerConfig.keyFilename,
      scopes: "https://www.googleapis.com/auth/spreadsheets.readonly",
    });

    const sheets = google.sheets({ version: "v4", auth });
    this.sheets = sheets;
    this.sheetID = providerConfig.sheetID;
    this.sheetName = providerConfig.sheetName;
    this.ranges = providerConfig.ranges;
  }

  protected async getSheet(ranges?: string[]): Promise<SheetWithData> {
    const result = await this.sheets.spreadsheets.get({
      includeGridData: true,
      spreadsheetId: this.sheetID,
      ranges,
    });

    if (!result.data.sheets) {
      throw Error(`spreadsheet ${this.sheetID} doesn't have any subsheets`);
    }

    let resultSheet: sheets_v4.Schema$Sheet | undefined;

    if (this.sheetName) {
      result.data.sheets.forEach((sheet) => {
        if (sheet.properties?.title === this.sheetName) {
          if (resultSheet) {
            throw Error(`multiple spreadsheets are named ${this.sheetName}`);
          }
          resultSheet = sheet;
        }
      });
      if (!resultSheet) {
        throw Error(`no spreadsheet found matching ${this.sheetName}`);
      }
    } else {
      resultSheet = result.data.sheets[0];
    }

    if (!resultSheet.data) {
      throw Error(
        `result sheet ${this.sheetName} from spreadsheet ${this.sheetID} is empty`
      );
    }

    return resultSheet as SheetWithData;
  }

  protected getRows(sheet: SheetWithData): (string | null | undefined)[][] {
    return (
      sheet.data
        // flatten GridData from multiple ranges
        .map((gridData) => gridData.rowData)
        .flat()
        // filter out rows without any values
        .filter((rowData): rowData is RowWithValues => !!rowData?.values)
        // filter out rows where all formattedValues are undefined
        .filter(
          (rowData) => !rowData.values.every((value) => !value.formattedValue)
        )
        // get cells
        .map((row) => row.values.map((cell) => cell.formattedValue))
    );
  }

  protected getCells(sheet: SheetWithData): (string | null | undefined)[] {
    const rows = this.getRows(sheet);
    let cells: (string | null | undefined)[] = [];

    rows.forEach((row) => {
      cells = cells.concat(row);
    });
    return cells;
  }
}

export { GoogleSheetsProvider };
