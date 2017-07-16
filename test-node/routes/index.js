var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
    res.send('My test express');
});

module.exports = router;

