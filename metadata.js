const API = require("./api");

class Metadata {
  static retrieve(job_id, callback) {
    var that = this

    if (typeof callback === 'undefined') {
      return new Promise(function(resolve) {
       API.request(that.cli, "GET", '/metadata/jobs/' + job_id, null, resolve);
      });
    }

    API.request(this.cli, "GET", '/metadata/jobs/' + job_id, null, callback);
  }
}

module.exports = Metadata;