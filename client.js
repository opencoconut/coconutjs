const ENDPOINT = "https://api.coconut.co/v2";

class Client {

  constructor(api_key, config={}) {
    this.api_key = api_key;

    if(config.region) {
      this.region = config.region;
    }

    if(config.endpoint) {
      this.endpoint = config.endpoint;
    }

    if(config.storage) {
      this.storage = config.storage;
    }

    if(config.notification) {
      this.notification = config.notification;
    }

    this.Job = require("./job");
    this.Job.cli = this;

    this.Metadata = require("./metadata");
    this.Metadata.cli = this;
  }

  getEndpoint() {
    if (this.endpoint != undefined) {
      return this.endpoint;
    }

    if(this.region != undefined) {
      return "https://api-" + this.region + ".coconut.co/v2"
    }
    return ENDPOINT;
  }
}

module.exports = Client;