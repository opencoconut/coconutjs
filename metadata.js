const API = require("./api");

class Metadata {
  static retrieve(job_id, callback) {
    if (typeof callback === 'undefined') {
      return new Promise(function(resolve) {
        module.exports.API.request(this.cli, "GET", '/metadata/jobs/' + job_id, null, resolve);
      });
    }

    API.request(this.cli, "GET", '/metadata/jobs/' + job_id, null, callback);
  }
}

module.exports = Metadata;