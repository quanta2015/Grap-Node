var db = require("./api/db")
var utils = require("./api/utils")
var grap = require("./api/grap")
var cList = require("./data/company")
var config = require("./config")

var cheerio = require('cheerio');
var superAgent = require('superagent');

//全局变量初始化
page = 1;
index = 0;
url = utils.format(config.url.job_url, encodeURI(cList[index]), page);

//连接mongodb
db.connect()

//抓取数据
grap.getJob()
