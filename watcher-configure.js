#!/usr/bin/env node

var fs = require('fs');
const readline = require('readline');

require('events').EventEmitter.prototype._maxListeners = 100;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var defConf = [
    {
        param : "TOMCAT_HOST",
        value : "localhost:8084"
    },
    {
        param : "CONTEXT",
        value : "/test"
    },
    {
        param : "LOGIN",
        value : "sa"
    },
    {
        param : "PASS",
        value : "sa"
    },
    {
        param : "EXTENSIONS",
        value : "js,sql"
    },
    {
        param : "DIRECTORIES",
        value : "app"
    },
    {
        param : "SFTP",
        value : true
    },
    {
        param : "SFTP_HOST",
        value : "192.168.1.12"
    },
    {
        param : "SFTP_PORT",
        value : "22"
    },
    {
        param : "SFTP_USER",
        value : "root"
    },
    {
        param : "SFTP_PASS",
        value : "password"
    },
    {
        param : "SFTP_PATH",
        value : "/var/testProject/"
    }
];

var outConf ={};

var save = function(){
    fs.writeFile('watcher-config.json', JSON.stringify(outConf), function(err) {
		if (err) throw err;
		else {
			fs.writeFile('.babelrc', '{ "presets": ["es2015"] }', function(err) {
				if (err) throw err;
				console.log("Config saved! Use command to run: watcher");
			});
		}
			
    });
}

var ask = function(i){
    if(i != 100) {
        rl.question(defConf[i].param + " (" +defConf[i].value+ "): ", function(answer) {
            outConf[defConf[i].param] = answer ? answer : defConf[i].value;
            if (i == defConf.length - 1) {
                console.log(outConf);
                ask(100);
            } else {
                ask(i + 1);
            }
        });
    } else {
        rl.question("All right? y/n (y): ", function(answer) {
            if(answer == 'Y' || answer == 'y' || answer == 'yes' || !answer){
                rl.close();
                save();
            } else {
                outConf = {};
                ask(0);
            }
        });
    }
};

ask(0);