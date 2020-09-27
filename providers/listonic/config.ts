interface ListonicProviderConfig {
  ListId: string;
  Url: string;
  ListonicHeaders: {
    Authorization: string;
  };
}

class ListonicProviderConfig {
  constructor(config: Record<string, unknown>) {
    this.ListId = "*****";
    this.Url = `https://hl2api.listonic.com/api/lists/${this.ListId}/items`;
    this.ListonicHeaders = {
      Authorization: "Bearer ********",
    };
  }
}

export { ListonicProviderConfig };
