## tomcat-watcher

### Install

Install as global nodejs module

```bash
$ npm i -g tomcat-watcher
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
    ]
}
```

or

```bash
$ wget http://raw.githubusercontent.com/minya92/tomcatWatcher/master/watcher-config.json
```

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