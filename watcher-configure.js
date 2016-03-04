#!/usr/bin/env node

var fs = require('fs');
const readline = require('readline');

require('events').EventEmitter.prototype._maxListeners = 100;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// var defConf = {
//     TOMCAT_HOST : "localhost:8084",
//     CONTEXT     : "/test",
//     LOGIN       : "sa",
//     PASS        : "sa",
//     DIRECTORIES : [
//         "app"
//     ],
//     EXTENSIONS  : [
//         "js",
//         "sql"
//     ],
//     SFTP        : false,
//     SFTP_HOST   : "192.168.100.12",
//     SFTP_PORT   : "22",
//     SFTP_USER   : "root",
//     SFTP_PASS   : "password",
//     SFTP_PATH   : "/var/testProject/"
// };

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
]

var outConf =[];

var ask = function(i){
    rl.question(defConf[i].param + ":", function(answer) {
        outConf.push(answer);
        i = i++;
        console.log(outConf);
        if(i == defConf.length - 1)
            rl.close();
        else
            ask(i);
    });
}

ask(0);