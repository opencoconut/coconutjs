var coconut = require('./coconut');
var fs = require('fs');

exports.testSubmitConfig = function(test) {
  conf = coconut.config({
    'source': 'https://s3-eu-west-1.amazonaws.com/files.coconut.co/test.mp4',
    'webhook': 'http://mysite.com/webhook',
    'outputs': {'mp4': 's3://a:s@bucket/video.mp4'}
  });

  coconut.submit(conf, null, function(job) {
    test.notEqual(undefined, job);
    test.equal('processing', job.status);
    test.ok(job.id > 0);
    test.done();
  });
};

exports.testSubmitBadConfig = function(test) {
  conf = coconut.config({
    'source': 'https://s3-eu-west-1.amazonaws.com/files.coconut.co/test.mp4'
  });

  coconut.submit(conf, null, function(job) {
    test.notEqual(undefined, job);
    test.equal('error', job.status);
    test.equal('config_not_valid', job.error_code);
    test.done();
  });
};

exports.testSubmitConfigWithAPIKey = function(test) {
  conf = coconut.config({
    'source': 'https://s3-eu-west-1.amazonaws.com/files.coconut.co/test.mp4'
  });

  coconut.submit(conf, 'k-4d204a7fd1fc67fc00e87d3c326d9b75', function(job) {
    test.notEqual(undefined, job);
    test.equal('error', job.status);
    test.equal('authentication_failed', job.error_code);
    test.done();
  });
};

exports.testGenerateFullConfigWithNoFile = function(test) {
  conf = coconut.config({
    'vars': {
      'vid': 1234,
      'user': 5098,
      's3': 's3://a:s@bucket'
    },
    'source': 'https://s3-eu-west-1.amazonaws.com/files.coconut.co/test.mp4',
    'webhook': 'http://mysite.com/webhook?vid=$vid&user=$user',
    'outputs': {
      'mp4': '$s3/vid.mp4',
      'webm': '$s3/vid.webm',
      'jpg_200x': '$s3/thumb.jpg'
    }
  });

  generated = [
    'var s3 = s3://a:s@bucket',
    'var user = 5098',
    'var vid = 1234',
    '',
    'set source = https://s3-eu-west-1.amazonaws.com/files.coconut.co/test.mp4',
    'set webhook = http://mysite.com/webhook?vid=$vid&user=$user',
    '',
    '-> jpg_200x = $s3/thumb.jpg',
    '-> mp4 = $s3/vid.mp4',
    '-> webm = $s3/vid.webm'
  ].join("\n")

  test.equal(generated, conf);
  test.done();
}

exports.testGenerateConfigWithFile = function(test) {
  fs.writeFileSync('coconut.conf', "var s3 = s3://a:s@bucket/video\nset webhook = http://mysite.com/webhook?vid=$vid&user=$user\n-> mp4 = $s3/$vid.mp4");

  conf = coconut.config({
    'conf': 'coconut.conf',
    'source': 'https://s3-eu-west-1.amazonaws.com/files.coconut.co/test.mp4',
    'vars': {'vid': 1234, 'user': 5098}
  });

  generated = [
    'var s3 = s3://a:s@bucket/video',
    'var user = 5098',
    'var vid = 1234',
    '',
    'set source = https://s3-eu-west-1.amazonaws.com/files.coconut.co/test.mp4',
    'set webhook = http://mysite.com/webhook?vid=$vid&user=$user',
    '',
    '-> mp4 = $s3/$vid.mp4'
  ].join("\n")

  test.equal(generated, conf);
  fs.unlinkSync('coconut.conf');
  test.done();
}

exports.testSubmitFile = function(test) {
  fs.writeFileSync('coconut.conf', "set webhook = http://mysite.com/webhook?vid=$vid&user=$user\n-> mp4 = s3://a:s@bucket/video/$vid.mp4");

  coconut.createJob({
    'conf': 'coconut.conf',
    'source': 'https://s3-eu-west-1.amazonaws.com/files.coconut.co/test.mp4',
    'vars': {'vid': 1234, 'user': 5098}
  }, function(job) {
    test.equal('processing', job.status);
    test.ok(job.id > 0);
    fs.unlinkSync('coconut.conf');
    test.done();
  });

}

exports.testGetJobInfo = function(test) {
  conf = coconut.config({
    'source': 'https://s3-eu-west-1.amazonaws.com/files.coconut.co/test.mp4',
    'webhook': 'http://mysite.com/webhook',
    'outputs': {'mp4': 's3://a:s@bucket/video.mp4'}
  });

  coconut.submit(conf, null, function(job) {
    coconut.getJob(job.id, function(info) {
      test.equal(info.id, job.id);
      test.done();
    });

  });
}

exports.testGetAllMetadata = function(test) {
  conf = coconut.config({
    'source': 'https://s3-eu-west-1.amazonaws.com/files.coconut.co/test.mp4',
    'webhook': 'http://mysite.com/webhook',
    'outputs': {'mp4': 's3://a:s@bucket/video.mp4'}
  });

  coconut.submit(conf, null, function(job) {
    setTimeout(function() {
      coconut.getAllMetadata(job.id, function(metadata) {
        test.notEqual(undefined, metadata);
        test.done();
      });

    }, 4000);

  });
}

exports.testGetSourceMetadata = function(test) {
  conf = coconut.config({
    'source': 'https://s3-eu-west-1.amazonaws.com/files.coconut.co/test.mp4',
    'webhook': 'http://mysite.com/webhook',
    'outputs': {'mp4': 's3://a:s@bucket/video.mp4'}
  });

  coconut.submit(conf, null, function(job) {

      setTimeout(function() {
        coconut.getMetadataFor(job.id, 'source', function(metadata) {
          test.notEqual(undefined, metadata);
          test.done();
        });

      }, 4000);

  });
}

exports.testSetApiVersion = function(test) {
  conf = coconut.config({
    'api_version': 'beta',
    'source': 'https://s3-eu-west-1.amazonaws.com/files.coconut.co/test.mp4',
    'webhook': 'http://mysite.com/webhook?vid=$vid&user=$user',
    'outputs': {
      'mp4': '$s3/vid.mp4',
    }
  });

  generated = [
    '',
    'set api_version = beta',
    'set source = https://s3-eu-west-1.amazonaws.com/files.coconut.co/test.mp4',
    'set webhook = http://mysite.com/webhook?vid=$vid&user=$user',
    '',
    '-> mp4 = $s3/vid.mp4',
  ].join("\n")

  test.equal(generated, conf);
  test.done();
}