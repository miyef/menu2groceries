interface ListonicProviderConfig {
  listID: string;
}

class ListonicProviderConfig {
  constructor(config: Record<string, unknown>) {
    throw Error("not implemented");
  }
}

export { ListonicProviderConfig };
