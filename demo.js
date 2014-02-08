var url4data = require('./');

console.log(url4data('foo','bar',{type:'text/javascript', scheme:'blob'}, function(url) { 
  console.log('url4data blob = ',url);
}));

console.log(url4data('foo','bar',{type:'text/javascript', scheme:'filesystem'}, function(url) { 
  console.log('url4data filesystem = ',url);
}));

