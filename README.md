# url4data

Get a URL for the given data

Usage:

    var url4data = require('url4data');

    url4data('hello world', 'name', {type: 'text/plain', scheme: ['filesystem', 'blob', 'data']}, function(url) {
        console.log(url);
    });

The `scheme` option can be used to choose the URL scheme, either a single value
or an array of schemes to try in order (returning first supported by the browser, so you can 
fallback to alternative schemes if necessary).
See `demo.js` for more examples. 

## Supported schemes

`filesystem:` from the [HTML5 FileSystem API](http://www.w3.org/TR/file-system-api/), supported by Chrome. These URLs are predictable
and semi-persistent. url4data uses the "temporary" not "persistent" filesystem storage,
but the URL persists across page reloads (although it can be deleted by the browser at any time).

`blob:` from the [HTML5 File API](http://www.w3.org/TR/FileAPI/#blob), supported by most modern browsers. Not predictable (random GUID), but 
url4data stores the generated URLs in `localStorage` in an attempt at providing consistency
across multiple invocations. Blob URLs might expire on page load or otherwise fairly frequently.

`data:` URLs are widely supported, but cannot be used everywhere `filesystem:` and `blob:` URLs can be used.
They encode the data directly within the URL itself.

## Why?

Useful, for example, for [SharedWorker](http://www.w3.org/TR/workers)s
which require the same URL to access the same shared worker
across multiple browser tabs.

## License

MIT

