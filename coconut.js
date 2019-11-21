var assert = require('assert');
var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');

var USER_AGENT = 'Coconut/2.4.0 (NodeJS)';

module.exports = {

  submit: function(configContent, apiKey, callback) {
    coconutURL = url.parse(process.env.COCONUT_URL || 'https://api.coconut.co');

    if(!apiKey) {
      apiKey = process.env.COCONUT_API_KEY;
    }

    var reqOptions = {
      hostname: coconutURL.hostname,
      port: coconutURL.port || (coconutURL.protocol == 'https:' ? 443 : 80),
      path: '/v1/job',
      method: 'POST',
      auth: apiKey+':',
      headers: {
        'User-Agent': USER_AGENT,
        'Content-Type': 'text/plain',
        'Accept': 'application/json',
        'Content-Length': configContent.length
      }
    };

    var req = (coconutURL.protocol == 'https:' ? https : http).request(reqOptions, function(res) {
      res.setEncoding('utf8');
      var responseString = '';

      res.on('data', function(data) {
        responseString += data;
      });

      res.on('end', function () {
        var resultObject = null;
        try {
          resultObject = JSON.parse(responseString);
        } catch(e) {
          console.log('problem with request: ' + e.message);
        }
        if(callback) {
          callback(resultObject);
        }
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
      if(callback) {
        callback(null);
      }
    });

    req.write(configContent);
    req.end();
  },

  get: function(path, apiKey, callback) {
    coconutURL = url.parse(process.env.COCONUT_URL || 'https://api.coconut.co');

    if(!apiKey) {
      apiKey = process.env.COCONUT_API_KEY;
    }

    var reqOptions = {
      hostname: coconutURL.hostname,
      port: coconutURL.port || (coconutURL.protocol == 'https:' ? 443 : 80),
      path: path,
      method: 'GET',
      auth: apiKey+':',
      headers: {
        'User-Agent': USER_AGENT,
        'Content-Type': 'text/plain',
        'Accept': 'application/json'
      }
    };

    var req = (coconutURL.protocol == 'https:' ? https : http).request(reqOptions, function(res) {
      res.setEncoding('utf8');
      var responseString = '';

      res.on('data', function(data) {
        responseString += data;
      });

      res.on('end', function () {
        var resultObject = null;
        try {
          resultObject = JSON.parse(responseString);
        } catch(e) {
          console.log('problem with request: ' + e.message);
        }
        if(callback) {
          callback(resultObject);
        }
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
      if(callback) {
        callback(null);
      }
    });

    req.end();
  },

  config: function(options) {
    conf_file = options.conf;
    if(conf_file) {
      conf = fs.readFileSync(conf_file, 'utf8').split("\n");
    } else {
      conf = [];
    }

    vars = options.vars;
    if(vars) {
      for(v in vars) {
        conf.push('var ' + v + ' = ' + String(vars[v]));
      }
    }

    source = options.source;
    if(source) {
      conf.push('set source = ' + source);
    }

    webhook = options.webhook;
    if(webhook) {
      conf.push('set webhook = ' + webhook);
    }

    api_version = options.api_version;
    if(api_version) {
      conf.push('set api_version = ' + api_version);
    }

    outputs = options.outputs;
    if(outputs) {
      for(format in outputs) {
        conf.push('-> ' + format + ' = ' + String(outputs[format]));
      }
    }

    new_conf = [];
    new_conf = new_conf.concat(conf.filter(function(l) { return l.indexOf('var') === 0 } ).sort());
    new_conf.push('');
    new_conf = new_conf.concat(conf.filter(function(l) { return l.indexOf('set') === 0 } ).sort());
    new_conf.push('');
    new_conf = new_conf.concat(conf.filter(function(l) { return l.indexOf('->') === 0 } ).sort());

    return new_conf.join('\n');
  },
  createJob: function(options, callback) {
    if (typeof callback === 'undefined') {
      return new Promise(function(resolve) {
        module.exports.submit(module.exports.config(options), options.api_key, resolve);
      });
    }

    this.submit(this.config(options), options.api_key, callback);
  },
  getJob: function(jid, callback) {
    if (typeof callback === 'undefined') {
      return new Promise(function(resolve) {
        module.exports.get('/v1/jobs/' + jid, null, resolve);
      });
    }

    this.get('/v1/jobs/' + jid, null, callback);
  },
  getAllMetadata: function(jid, callback) {
    if (typeof callback === 'undefined') {
      return new Promise(function(resolve) {
        module.exports.get('/v1/metadata/jobs/' + jid, null, resolve);
      });
    }

    this.get('/v1/metadata/jobs/' + jid, null, callback);
  },
  getMetadataFor: function(jid, source_or_output, callback) {
    if (typeof callback === 'undefined') {
      return new Promise(function(resolve) {
        module.exports.get('/v1/metadata/jobs/' + jid + '/' + source_or_output, null, resolve);
      });
    }

    this.get('/v1/metadata/jobs/' + jid + '/' + source_or_output, null, callback);
  }
}
