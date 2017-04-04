var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jobSchema = new Schema({
        posname: String,
        company: String,
        money: String,
        area: String,
        pubdate: String,
        exp: String,
        edu: String,
        desc: String,
        url: String,
        type: String,
        count: String
});


module.exports = mongoose.model('Jobs', jobSchema);
