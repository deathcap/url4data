'use strict';

var url4data = require('./');

console.log(url4data('hello world', 'name', {type: 'text/plain', scheme: ['filesystem', 'blob', 'data']}, function(url) { 
  console.log('url4data any = ',url);
}));


console.log(url4data('hello world', 'name', {type: 'text/plain', scheme: 'blob'}, function(url) { 
  console.log('url4data blob = ',url);
}));

console.log(url4data('hello world', 'name', {type: 'text/plain', scheme: 'filesystem'}, function(url) { 
  console.log('url4data filesystem = ',url);
}));

console.log(url4data('hello world', 'name', {type: 'text/plain', scheme: 'data'}, function(url) {
  console.log('url4data data = ',url);
}));
