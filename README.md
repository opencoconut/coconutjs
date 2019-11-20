# NodeJS client Library for encoding Videos with Coconut

## Install

```console
npm install coconutjs
```

## Submitting the job

Use the [API Request Builder](https://app.coconut.co/job/new) to generate a config file that match your specific workflow.

Example of `coconut.conf`:

```ini
var s3 = s3://accesskey:secretkey@mybucket

set webhook = http://mysite.com/webhook/coconut?videoId=$vid

-> mp4  = $s3/videos/video_$vid.mp4
-> webm = $s3/videos/video_$vid.webm
-> jpg:300x = $s3/previews/thumbs_#num#.jpg, number=3
```

Here is the javascript code to submit the config file:

```javascript
var coconut = require('coconutjs');

coconut.createJob({
  'api_key': 'k-api-key',
  'conf': 'coconut.conf',
  'source': 'https://s3-eu-west-1.amazonaws.com/files.coconut.co/test.mp4',
  'vars': {'vid': 1234}
}, function(job) {
  if(job && job.status == 'ok') {
    console.log(job.id);
  } else if (job) {
    console.log(job.error_code);
    console.log(job.error_message);
  } else {
    console.log('Error creating job')
  }
});
```

You can also create a job without a config file. To do that you will need to give every settings in the method parameters. Here is the exact same job but without a config file:

```javascript
var coconut = require('coconutjs');

vid = 1234
s3 = 's3://accesskey:secretkey@mybucket'

coconut.createJob({
  'api_key': 'k-api-key',
  'source': 'http://yoursite.com/media/video.mp4',
  'webhook': 'http://mysite.com/webhook/coconut?videoId=' + vid,
  'outputs': {
    'mp4': s3 + '/videos/video_' + vid + '.mp4',
    'webm': s3 + '/videos/video_' + vid + '.webm',
    'jpg:300x': s3 + '/previews/thumbs_#num#.jpg, number=3'
  }
}, function(job) {
  //...
});
```

Other example usage:

```javascript
// Getting info about a job
job = coconut.getJob(18370773, function(job) {
  //...
});

// Retrieving metadata
coconut.getAllMetadata(18370773, function(metadata) {
  // ...
});

// Retrieving the source file metadata only
coconut.getMetadataFor(18370773, 'source', function(metadata) {
  // ...
});
```

Note that you can use the environment variable `COCONUT_API_KEY` to set your API key.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request


*Released under the [MIT license](http://www.opensource.org/licenses/mit-license.php).*

---

* Coconut website: http://coconut.co
* API documentation: http://coconut.co/docs
* Contact: [support@coconut.co](mailto:support@coconut.co)
* Twitter: [@OpenCoconut](http://twitter.com/opencoconut)
