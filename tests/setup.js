require('app-module-path').addPath(__dirname + '/../js');
global.trigger = new(require('./trigger.js'));
new(require('index/index.js'))(__dirname + '/userdata');
