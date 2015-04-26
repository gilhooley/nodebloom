var express = require('express');
var bloomFilter = require('./bloomFilter');

var router = express.Router();

router.post('/', function insertString(req, res) {
  var string = req.body.string;
  if(!string) {
    res.status(400).send('Include a string with your insert request.');
  } else {
    bloomFilter.insert(string, function(error) {
      if(error) throw error;
      res.sendStatus(200);
    });
  }
});

module.exports = router;
