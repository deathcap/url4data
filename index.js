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


var url4data = function(data, name, opts, cb) {
  return blobURL4data(data, name, opts, cb); // TODO: other types. filesystem:...
};

module.exports = url4data;

//console.log(url4data('foo','bar',{type:'text/javascript'}));

