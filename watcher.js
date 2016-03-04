#!/usr/bin/env node

var fs = require('fs');
var url = require('url');
var http = require('http');
var chokidar = require('chokidar');
var client = require('scp2');

var filename = process.argv[2] ? process.argv[2] : "watcher-config.json";

fs.readFile(filename, (err, data) => {
  if (err) throw err;
  
  var params = JSON.parse(data.toString());
  var changed = false;
  var FILES = [];
  var firstRun = true;
  
  function checkChanges(){
        if(changed){
            changed = false;
            reloadContext();
            if(!!params.SFTP)
                sftpSync();
        }
        firstRun = false;
    }

    setInterval(checkChanges, 2000);
    
    function sftpSync(){
        console.log ("!!!!!!!!!!!!!!!!!!!!!!!");
        FILES.forEach(function(file){
            var path = file.split('\\');
            if(!path[1])
                path = file.split('/')
            path.pop();
            path = path.join('/') + '/';
            client.scp(file, {
                host: params.SFTP_HOST,
                username: params.SFTP_USER,
                password: params.SFTP_PASS,
                path: params.SFTP_PATH + path, 
            }, function(err) {
                console.log("UPLOAD FILE TO: " + params.SFTP_PATH + path);
            });
        });
        FILES = [];
    }
    
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
        if(!firstRun){
            FILES.push(path);
            changed = true;
        } 
    });
});
