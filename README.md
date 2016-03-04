## tomcat-watcher

### Install

Install only global module

```bash
$ npm install -g tomcat-watcher
```
### Create config file

Create config file in root folder your project 

```javascript
{
    "TOMCAT_HOST" : "localhost:8084",
    "CONTEXT"     : "/test",
    "LOGIN"       : "sa",
    "PASS"        : "sa",
    "DIRECTORIES" : [
        "app"
    ],
    "EXTENSIONS"  : [
        "js",
        "sql"
    ],
    "SFTP"        : false,
    "SFTP_HOST"   : "192.168.100.12",
    "SFTP_PORT"   : "22",
    "SFTP_USER"   : "root",
    "SFTP_PASS"   : "password",
    "SFTP_PATH"   : "/var/testProject/"
}
```
Login and pass for manager-script role

or

```bash
$ wget http://raw.githubusercontent.com/minya92/tomcatWatcher/master/watcher-config.json
```
In version 2.0.0 add support SFTP Deploy

Bugs SFTP:
 * Don't create new folders on remote server
 * Don't remove files on remote server

### Run

```bash
$ cd PATH_TO_PROJECT
$ watcher config_file
```
If you named config file as:

* watcher-config.json

Then you can run the command without parameters

```bash
$ cd PATH_TO_PROJECT
$ watcher
```
