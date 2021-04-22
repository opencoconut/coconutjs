const API = require("./api");

class Job {
  static create(opts, callback) {
    if(this.cli.notification != undefined) {
      opts = Object.assign({}, opts, {"notification": this.cli.notification});
    }

    if(this.cli.storage != undefined) {
      opts = Object.assign({}, opts, {"storage": this.cli.storage});
    }

    if (typeof callback === 'undefined') {
      return new Promise(function(resolve) {
        module.exports.API.request(this.cli, "POST", "/jobs", opts, resolve);
      });
    }

    API.request(this.cli, "POST", "/jobs", opts, callback);
  }

  static retrieve(job_id, callback) {
    if (typeof callback === 'undefined') {
      return new Promise(function(resolve) {
        module.exports.API.request(this.cli, "GET", "/jobs/" + job_id, null, resolve);
      });
    }

    API.request(this.cli, "GET", "/jobs/" + job_id, null, callback);
  }
}

module.exports = Job;