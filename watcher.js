var TOMCAT_HOST = 'localhost:8084';
var CONTEXT     = '/sport';
var LOGIN       = 'ide';
var PASS        = 'Co8AAkc5';
var DIRECTORIES = [
    'app', 
    'test'
];
var EXTENSIONS  = [
    'js',
    'txt'
];

var url = require('url');
var http = require('http');
var chokidar = require('chokidar');

var changed = false;

function checkChanges(){
    if(changed){
        changed = false;
        reloadContext();
    }
}

setInterval(checkChanges, 2000);

function reloadContext(){
    console.log("RELOADING CONTEXT: " + CONTEXT);
    var URL = "http://" + LOGIN + ":" + PASS + "@" + TOMCAT_HOST + "/manager/text/reload?path=" + CONTEXT;
    var req = http.request(url.parse(URL), (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
    });
    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });
    req.end();
}

var watcher = chokidar.watch('file, dir, glob, or array', {
  ignored: /[\/\\]\./,
  persistent: true
});

var watchPaths = [];

DIRECTORIES.forEach(function (dir) {
    EXTENSIONS.forEach(function (ext) {
        watchPaths.push(dir + '/**/*.' + ext);
    });
});

watcher.add(watchPaths);

watcher.on('all', (event, path) => {
  console.log(event, path);
  changed = true;
});