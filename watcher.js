#!/usr/bin/env node

var fs = require('fs');
var url = require('url');
var http = require('http');
var chokidar = require('chokidar');
var client = require('scp2');
var babel = require("babel-core");

var filename = process.argv[2] ? process.argv[2] : "watcher-config.json";

fs.readFile(filename, (err, data) => {
  if (err) throw err;
  
  var params = JSON.parse(data.toString());
  var changed = false;
  var FILES = [];
  var ES6_FILES = [];
  var firstRun = true;
  
  function checkChanges(){
        if(changed){
            changed = false;
            reloadContext();
			ESCompile();
            if(params.SFTP == 'true' && params.SFTP != true){
                params.SFTP_PATH = (params.SFTP_PATH.slice(-1) == '/' ? params.SFTP_PATH : params.SFTP_PATH + '/');
                sftpSync();
            }
                
        }
        firstRun = false;
    }

    setInterval(checkChanges, 2000);
    
	function ESCompile(){
		ES6_FILES.forEach(function(file){
			babel.transformFile(file, {}, function(err, res){
				var outFile = file.split('.es6').join('.') + 'js';
                if(res && res.code){
                    fs.writeFile(outFile, res.code, function(err) {
                        if (err) throw err;
                        console.log("ES6 FILE COMPILIED: " + file + " -> " + outFile);
                    });
                } else {
                    console.log("ERROR CONVERTING FILE FROM ES6. Please install babel-preset-es2015 for this project (npm i babel-preset-es2015)");
                }
			});
		});
		ES6_FILES = [];
	}
	
    function sftpSync(){
        FILES.forEach(function(file){
            var path = file.split('\\');
            if(!path[1])
                path = file.split('/')
            path.pop();
            path = path.join('/') + '/';
            console.log("UPLOADING FILE TO: " + params.SFTP_PATH + path);
            client.scp(file, {
                host: params.SFTP_HOST,
                username: params.SFTP_USER,
                password: params.SFTP_PASS,
                path: params.SFTP_PATH + path, 
            }, function(err) {
                console.log("FILE UPLOADED TO: " + params.SFTP_PATH + path);
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
    var DIRS = params.DIRECTORIES.split(",");
    var EXT = params.EXTENSIONS.split(",");
    DIRS.forEach(function (dir) {
        EXT.forEach(function (ext) {
            watchPaths.push(dir + '/**/*.' + ext);
        });
    });

    watcher.add(watchPaths);

    watcher.on('all', (event, path) => {
        console.log(event, path);
        if(!firstRun){
			if(event != 'unlink' && path.split('.').pop() == 'es6'){
                ES6_FILES.push(path);
                changed = true;
            } else {
                var layoutFile = path.split('.js').join('.') + 'layout';
                fs.exists(layoutFile, (exists) => {
                    if(!exists){
                        FILES.push(path);
                        changed = true;
                    } else {
                        console.log("LAYOUT FILE DETECTED, NO RESTART " + layoutFile);
                    }
                });      
            }  
        } 
    });
});
