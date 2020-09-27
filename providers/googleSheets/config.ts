interface GoogleSheetsProviderConfig {
  keyFilename: string;
  sheetID: string;
  sheetName?: string;
  ranges?: string[];
}

class GoogleSheetsProviderConfig implements GoogleSheetsProviderConfig {
  keyFilename: string;
  sheetID: string;
  sheetName?: string;
  ranges?: string[];

  constructor(config: Record<string, unknown>) {
    try {
      // keyFilename typecheck
      if (!(typeof config.keyFilename === "string")) {
        throw Error(`keyFilename is missing or of incorrect type`);
      }
      // sheetID typecheck
      if (!(typeof config.sheetID === "string")) {
        throw Error(`sheetID is missing or of incorrect type`);
      }
      // sheetName typecheck
      if (
        !(typeof config.sheetName === "string") &&
        config.sheetName !== undefined
      ) {
        throw Error(`sheetName is of incorrect type`);
      }
      // ranges typecheck
      if (Array.isArray(config.ranges)) {
        let notStringObject = undefined;
        config.ranges.forEach(function (item) {
          if (typeof item !== "string") {
            notStringObject = item;
          }
        });
        if (notStringObject && config.ranges.length > 0) {
          throw Error(
            `ranges array contains object ${notStringObject} that are not strings`
          );
        }
      } else if (!Array.isArray(config.ranges) && config.ranges !== undefined) {
        throw Error(`ranges is of incorrect type`);
      }
    } catch (e) {
      throw Error(`failed to initialize google sheets provider config: ${e}`);
    }

    this.keyFilename = config.keyFilename;
    this.sheetID = config.sheetID;
    this.sheetName = config.sheetName;
    this.ranges = config.ranges;
  }
}

export { GoogleSheetsProviderConfig };
