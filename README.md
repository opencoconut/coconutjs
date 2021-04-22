# Coconut NodeJS Library

The Coconut NodeJS library provides access to the Coconut API for encoding videos, packaging media files into HLS and MPEG-Dash, generating thumbnails and GIF animation.

This library is only compatible with the Coconut API v2.

## Documentation

See the [full documentation](https://docs.coconut.co).

## Installation

To install this package, run:

```console
npm install coconutjs
```

## Usage

The library needs you to set your API key which can be found in your [dashboard](https://app.coconut.co/api). Webhook URL and storage settings are optional but are very convenient because you set them only once.

```javascript
const Coconut = require('coconutjs');

coconut = new Coconut.Client('k-api-key');

coconut.notification = {
  'type': 'http',
  'url': 'https://yoursite/api/coconut/webhook'
}

coconut.storage = {
  'service': 's3',
  'bucket': 'my-bucket',
  'region': 'us-east-1',
  'credentials': {
    'access_key_id': 'access-key',
    'secret_access_key': 'secret-key'
  }
}
```

## Creating a job

```javascript
coconut.Job.create(
  {
    'input': { 'url': 'https://mysite/path/file.mp4' },
    'outputs': {
      'jpg:300x': { 'path': '/image.jpg' },
      'mp4:1080p': { 'path': '/1080p.mp4' },
      'httpstream': {
        'hls': { 'path': 'hls/' }
      }
    }
  }, function(job, err) {
    console.log(job);
  }
)
```

## Getting information about a job

```javascript
coconut.Job.retrieve('OolQXaiU86NFki', function(job, err) {
  console.log(job);
});
```

## Retrieving metadata

```javascript
coconut.Metadata.retrieve('OolQXaiU86NFki', function(metadata, err) {
  console.log(metadata);
})
```

*Released under the [MIT license](http://www.opensource.org/licenses/mit-license.php).*