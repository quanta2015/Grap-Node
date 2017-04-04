var cheerio = require('cheerio');
var superAgent = require('superagent');
var db = require("./dbAsync")
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
            console.log(err.status)

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
                if (index == 0) return true

                //过滤推荐列表的数据
                if ($(this).attr("class") === 'show_recommend_tips') return false

                //取出数据列
                comUrl = $(this).find("tr td").eq(0).find("a").attr('href')
                posName = $(this).find("tr td").eq(0).find("a").text()
                company = $(this).find("tr td").eq(2).find("a").text()
                money = $(this).find("tr td").eq(3).text()
                area = $(this).find("tr td").eq(4).text()
                pubdate = $(this).find("tr td").eq(5).text()
                exp = $(this).find("tr").eq(1).find(".newlist_deatil_two span").eq(3).text()
                edu = $(this).find("tr").eq(1).find(".newlist_deatil_two span").eq(4).text()
                desc = $(this).find("tr").eq(1).find(".newlist_deatil_last").text()

                //保存到数据表
                db.saveJobEx(posName, company, money, area, pubdate, exp, edu, desc, comUrl)
            }); //end of each shopList 

            if (page < ps) {     //判断页面是否结束
                page++
                url = utils.format(config.url.job_url, encodeURI(cList[index]), page)
                utils.sleep(1)
                getJob()
            } else if (index < config.amount) {     //判断公司列表是否结束
                console.log( index + " " + cList[index] + " finished......" );
                index++
                page = 1
                url = utils.format(config.url.job_url, encodeURI(cList[index]), page)
                utils.sleep(1)
                getJob()
            } else {     //抓取完毕
                db.disconnect()
            }

        } // end of res 
    }) // end of superagent
}


exports.getDetail = getDetail

function getDetail() {

    var url =  global.ret[index].url
    var id = global.ret[index]._id
    var opt = {
        Referer: url,
        'User-Agent': config.url.opt
    }
    superAgent.get(url).set(opt).end(function(err, res) {
        if (err) {
            console.log(err.status)
            db.disconnect()
            return false;
        }
        if (res.status === 200) {
            var $ = cheerio.load(res.text)
            var jobCount = $(".terminal-ul li").eq(6).text()
            var jobType = $(".terminal-ul li").eq(7).text()
            db.updateDetail(id, jobCount, jobType)

             if (index < ret.length) {
                index++
                getDetail()
                // utils.sleep(1)
             }else{
                db.disconnect()
             }

        } // end of res 
    }) // end of superagent

}