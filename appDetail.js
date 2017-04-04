var db = require("./api/dbAsync")
var grap = require("./api/grap")

index = 0

db.connect().then(db.getUrl)
.then(function(ret) {
    global.ret = ret
    grap.getDetail()
})
.finally(function() {
    // db.disconnect()
})


