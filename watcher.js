#!/usr/bin/env node

var fs = require('fs');
var url = require('url');
var http = require('http');
var chokidar = require('chokidar');

var filename = process.argv[2] ? process.argv[2] : "watcher-config.json";

fs.readFile(filename, (err, data) => {
  if (err) throw err;
  
  var params = JSON.parse(data.toString());
  var changed = false;
  
  function checkChanges(){
        if(changed){
            changed = false;
            reloadContext();
        }
    }

    setInterval(checkChanges, 2000);

    function reloadContext(){
        console.log("RELOADING CONTEXT: " + params.CONTEXT);
        var URL = "http://" + params.LOGIN + ":" + params.PASS + "@" + params.TOMCAT_HOST + "/manager/text/reload?path=" + params.CONTEXT;
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

    params.DIRECTORIES.forEach(function (dir) {
        params.EXTENSIONS.forEach(function (ext) {
            watchPaths.push(dir + '/**/*.' + ext);
        });
    });

    watcher.add(watchPaths);

    watcher.on('all', (event, path) => {
        console.log(event, path);
        changed = true;
    });
});