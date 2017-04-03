var cheerio = require('cheerio');
var superAgent = require('superagent');
var db = require("./db")
var utils = require("./utils")
var config = require("../config")
var cList = require("../data/company")

exports.getJob = getJob

function getJob() {
    var opt = {
        Referer: url,
        'User-Agent': config.url.opt
    }
    superAgent.get(url).set(opt).end(function(err, res) {
        if (err) {
            console.log(err.status);

            utils.sleep(60)
            if (index != config.amount) { //数据尚未抓完
                getJob()
            } else {
                db.disconnect() //数据完成关闭连接
            }
            return false;
        }
        if (res.status === 200) {
            var $ = cheerio.load(res.text)
            var jobList = $("#newlist_list_content_table").children()
            var count = $(".search_yx_tj em").text()
            var ps = Math.ceil(count / 60) //分页数量

            jobList.each(function(index, item) {
                //过滤标题行
                if (index == 0) return true;

                //过滤推荐列表的数据
                if ($(this).attr("class") === 'show_recommend_tips') return false;

                //取出数据列
                posName = $(this).find("tr td").eq(0).find("a").text();
                company = $(this).find("tr td").eq(2).find("a").text();
                money = $(this).find("tr td").eq(3).text();
                area = $(this).find("tr td").eq(4).text();
                pubdate = $(this).find("tr td").eq(5).text();

                //保存到数据表
                db.saveJobEx(posName, company, money, area, pubdate)
            }); //end of each shopList 

            if (page < ps) {
                page++;
                url = utils.format(config.url.job_url, encodeURI(cList[index]), page);
                // utils.sleep(1)
                getJob()
            } else if (index < config.amount) {
                console.log(index + " " + cList[index] + " finished......");
                index++
                page = 1;
                url = utils.format(config.url.job_url, encodeURI(cList[index]), page);
                // utils.sleep(1)
                getJob()
            } else {
                db.disconnect()
            }

        } // end of res 
    }) // end of superagent
}