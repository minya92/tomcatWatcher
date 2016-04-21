## Install

Install only npm global module

```bash
$ npm install -g tomcat-watcher
```
## Configure

To configure your project run:

```bash
$ cd PATH_TO_PROJECT
$ watcher-conf
```

and answer a few questions

## In version 2.0.0 add support SFTP Deploy

**Bugs SFTP:**
 * Don't create new folders on remote server
 * Don't remove files on remote server

## ES6 Support (Beta)

 **To use this feature, you need to:**
 
 * Allow check 'es6' extension in watcher-config.json
 * install babel-preset-es2015 in the project folder 
 
 ```bash
$ cd PATH_TO_PROJECT
$ npm i babel-preset-es2015
```

If the ES6 file '.es6' is changed, it will be automatically compiled into ES5 '.js' file.

## Run

After configure will be created file:
 * watcher-config.json
 
```javascript
{
  "TOMCAT_HOST": "localhost:8084",
  "CONTEXT": "/test",
  "LOGIN": "sa",
  "PASS": "sa",
  "EXTENSIONS": "js,sql",
  "DIRECTORIES": "app",
  "SFTP": "true",
  "SFTP_HOST": "192.168.1.12",
  "SFTP_PORT": "22",
  "SFTP_USER": "root",
  "SFTP_PASS": "rootpass",
  "SFTP_PATH": "/var/test/"
}
```

If this file exists run:

```bash
$ cd PATH_TO_PROJECT
$ watcher
```

If you named config file specific:

Then you can run the command with parameter

```bash
$ cd PATH_TO_PROJECT
$ watcher my_conf_file.json
```

