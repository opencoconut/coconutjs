const Coconut = require('./coconut');
const assert = require('assert').strict;

const INPUT_URL = "https://s3-eu-west-1.amazonaws.com/files.coconut.co/bbb_800k.mp4";

const STORAGE = {
  "service": "s3",
  "bucket": process.env.AWS_BUCKET,
  "region": process.env.AWS_REGION,
  "path": "/coconutjs/tests/",
  "credentials": {
    "access_key_id": process.env.AWS_ACCESS_KEY_ID,
    "secret_access_key": process.env.AWS_SECRET_ACCESS_KEY
  }
}

const NOTIFICATION = {
  "type": "http",
  "url": process.env.COCONUT_WEBHOOK_URL
}


describe("New Coconut Client", function() {
  it("should instantiate new client with API Key", function() {
    const coconut = new Coconut.Client(process.env.COCONUT_API_KEY);
    assert.strictEqual(coconut.api_key, process.env.COCONUT_API_KEY);
  });

  it("should set the default api endpoint if no region or endpoint provided", function() {
    const coconut = new Coconut.Client(process.env.COCONUT_API_KEY);
    assert.strictEqual(coconut.getEndpoint(), "https://api.coconut.co/v2");
  });

  it("should update the api endpoint if region is provided", function() {
    const coconut = new Coconut.Client(process.env.COCONUT_API_KEY, {region: "us-west-2"});
    assert.strictEqual(coconut.getEndpoint(), "https://api-us-west-2.coconut.co/v2");
  });

  it("should override the api endpoint if endpoint is provided", function() {
    const coconut = new Coconut.Client(process.env.COCONUT_API_KEY, {endpoint: "http://localhost:3001/v2"});
    assert.strictEqual(coconut.getEndpoint(), "http://localhost:3001/v2");
  });
});

describe("Job creation", function() {
  it("should create a job", function() {
    const coconut = new Coconut.Client(process.env.COCONUT_API_KEY);

    coconut.notification = NOTIFICATION
    coconut.storage = STORAGE

    coconut.Job.create({
      "input": {"url": INPUT_URL},
      "outputs": {
        "mp4": {
          "path": "/video.mp4",
          "duration": 1
        }
      }
    }, function(job, err) {
      if(job) {
        assert.strictEqual(null, err);
        assert.strictEqual(job.status, "job.starting");
      }
    });
  });

  it("should create a job with promise", function() {
    const coconut = new Coconut.Client(process.env.COCONUT_API_KEY);

    coconut.notification = NOTIFICATION
    coconut.storage = STORAGE

    const promise = coconut.Job.create({
      "input": {"url": INPUT_URL},
      "outputs": {
        "mp4": {
          "path": "/video.mp4",
          "duration": 1
        }
      }
    });

    promise.then(function(job) {
      if(job) {
        assert.strictEqual(null, err);
        assert.strictEqual(job.status, "job.starting");
      }
    });
  });

  it("should not create a job because of error", function() {
    const coconut = new Coconut.Client(process.env.COCONUT_API_KEY);

    coconut.notification = NOTIFICATION
    coconut.storage = STORAGE

    coconut.Job.create({
      "input": {"url": INPUT_URL},
      "outputs": {
        "mp4": {
          "path": "/video.mp4",
          "notvalidparam": "no",
        }
      }
    }, function(job, err) {
      assert.strictEqual(null, job);
      assert.strictEqual(err.error_code, "output_param_not_valid");
    });
  });

  it("should not blow up when job ID is empty", function() {
    const coconut = new Coconut.Client(process.env.COCONUT_API_KEY);

    coconut.Job.retrieve()
  });
});