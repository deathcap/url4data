var xhr = require('xhr');

// Blob URLs become invalid once the page is closed
var isValidBlobURL = function(url, cb) {
  if (!url) return cb(url, false);

  try {
    xhr({uri: url, sync: true},
        function(err, resp, body) {
          console.log('XHR',url,err,resp,body);

          var valid = !!body && body.length !== 0;
          cb(url, valid);
        });
  } catch (e) {
    // Firefox may throw NS_ERROR_DOM_BAD_URI: Access to restricted URI denied
    cb(url, false);
  }
};


var createNewBlobURL = function(data, name, opts) {
  var blob = new Blob([data], opts);
  var url = URL.createObjectURL(blob);
  // save Blob URL across instances since must match for shared workers
  window.localStorage[name] = url = URL.createObjectURL(blob);
  console.log('Created new Blob URL',url);

  return url;
};

var blobURL4data = function(data, name, opts, cb) {
  if (!window.Blob) return false; // unsupported

  var url = window.localStorage[name];

  isValidBlobURL(url, function(url, isValid) {
    if (!isValid) {
      url = createNewBlobURL(data, name, opts);
    } else {
      console.log('Using existing valid Blob URL',url);
    }

    cb(url, data, name, opts);
  });

  return true;
}

var createNewFilesystemURL = function(data, name, opts, cb) {
  if (!window.webkitRequestFileSystem) return false; // unsupported

  var size = data.length;

  window.webkitRequestFileSystem(window.TEMPORARY, size, function(fs) {
    fs.root.getFile(name, {create:true}, function(file) {
      console.log('created file',file);
      file.createWriter(function(writer) {
        writer.onwriteend = function() {
          console.log('File write completed');
        };

        writer.onerror = function(err) {
          console.log('createWriter error:',err);
        };

        var blob = new Blob([data], opts); // we can only write blobs?
        writer.write(blob);

        var url = file.toURL();
        cb(url, data, name, opts);
      });
    }, function(err) {
      console.log('getFile error:',err);
    });
  }, function(err) {
    console.log('webkitRequestFileSystem error:',err);
  });

  return true;
};

var filesystemURL4data = function(data, name, opts, cb) {
  return createNewFilesystemURL(data, name, opts, cb); // TODO: reuse existing
}

// TODO: replace with existing data: URL encoder
var dataURL4data = function(data, name, opts, cb) {
  var type = opts.type || 'text/javascript';
  var encodedData = encodeURIComponent(data);
  var url = 'data:' + type + ',' + encodedData; // TODO: binary data? base64

  cb(url, data, name, opts);
}

var byScheme = {
  blob: blobURL4data,
  filesystem: filesystemURL4data,
  data: dataURL4data
};

var url4data = function(data, name, opts, cb) {
  if (name === undefined) throw new Error('url4data name is required'); // TODO: hash data?
  opts = opts || {};

  var scheme = opts.scheme || ['filesystem', 'blob'/*TODO , 'data'*/];
  if (!Array.isArray(scheme)) scheme = [scheme];

  for (var i = 0; i < scheme.length; ++i) {
    var tryScheme = scheme[i];
    var f = byScheme[tryScheme];
    if (!f) throw new Error('url4data invalid scheme: ' + tryScheme);

    var success = f(data, name, opts, cb);
    if (success) return; // cb() will be called

    // otherwise, try next available supported scheme
  }
};

module.exports = url4data;

