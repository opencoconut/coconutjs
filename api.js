const url = require('url');
const http = require('http');
const https = require('https');
const error = require("./error");

const USER_AGENT = 'Coconut/v2 NodeJSBindings/' + require("./version").version;

class API {
  static request(cli, method, path, data, callback) {
    const coconutURL = url.parse(cli.getEndpoint());

    const reqOptions = {
      hostname: coconutURL.hostname,
      port: coconutURL.port || (coconutURL.protocol == 'https:' ? 443 : 80),
      path: require('path').join(coconutURL.path, path),
      method: method,
      auth: cli.api_key+':',
      headers: {
        'User-Agent': USER_AGENT,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = (coconutURL.protocol == 'https:' ? https : http).request(reqOptions, function(res) {
      res.setEncoding('utf8');
      var responseString = '';

      res.on('data', function(data) {
        responseString += data;
      });

      res.on('end', function () {
        var resultObject = null;
        resultObject = JSON.parse(responseString);

        if(res.statusCode > 399) {
          if(res.statusCode == 400 || res.statusCode == 401) {
            return callback(null, new error.CoconutError(resultObject));
          } else {
            return callback(null, new error.CoconutError({
              "error_code": "server_error",
              "message": "Server returned HTTP status " + res.statusCode
            }));
          }
        }

        if(callback) {
          callback(resultObject, null);
        }
      });
    });

    req.on('error', function(e) {
      if(callback) {
        callback(null, new error.CoconutError({
          "error_code": "request_error",
          "message": e.message
        }));
      }
    });

    if(data != null) {
      req.write(JSON.stringify(data));
    }

    req.end();
  }
}

module.exports = API;