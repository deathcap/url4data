var url4data = require('./');

console.log(url4data('foo','bar',{type:'text/javascript'}, function(url) { 
  console.log('url4data = ',url);
}));

