import fs from "fs/promises";
import { ProviderTypes } from "./model/provider";

const CONFIG_FILE = "./config.json";

async function loadProviderConfig(
  providerType: ProviderTypes,
  providerName: string
): Promise<Record<string, unknown>> {
  const configFile = await fs.readFile(CONFIG_FILE);
  const config = JSON.parse(configFile.toString());

  const subprovidersConfig = Object.assign(
    {},
    config.providers[providerName].subproviders
  );
  delete config.providers[providerName].subproviders;

  return Object.assign(
    {},
    config.providers[providerName],
    subprovidersConfig[providerType]
  );
}

export { loadProviderConfig };
