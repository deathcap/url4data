var xhr = require('xhr');

// Blob URLs become invalid once the page is closed
var isValidBlobURL = function(url, cb) {
  if (!url) return cb(url, false);

  xhr({uri: url, sync: true},
      function(err, resp, body) {
        console.log('XHR',url,err,resp,body);

        var valid = !!body && body.length !== 0;
        cb(url, valid);
      });
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
  if (!window.Blob) return null; // unsupported

  var url = window.localStorage[name];

  isValidBlobURL(url, function(url, isValid) {
    if (!isValid) {
      url = createNewBlobURL(data, name, opts);
    } else {
      console.log('Using existing valid Blob URL',url);
    }

    cb(url, data, name, opts);
  });
}

var createNewFilesystemURL = function(data, name, opts, cb) {
  if (!window.webkitRequestFileSystem) return null; // unsupported

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
};

var filesystemURL4data = function(data, name, opts, cb) {
  return createNewFilesystemURL(data, name, opts, cb); // TODO: reuse existing
}

var url4data = function(data, name, opts, cb) {
  var scheme = opts.scheme || 'blob'; // TODO: multiple schemes, try available

  if (scheme === 'blob')
    return blobURL4data(data, name, opts, cb);
  else if (scheme === 'filesystem')
    return filesystemURL4data(data, name, opts, cb);
};

module.exports = url4data;

