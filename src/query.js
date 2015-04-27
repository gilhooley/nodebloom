var express = require('express');
var bloomFilter = require('./bloomFilter');
var failure = require('./failure');

var router = express.Router();

router.get('/:string', function findString(req, res) {
  var string, found;
  string = req.params.string;
  found = {found: bloomFilter.query(string)};
  res.send(JSON.stringify(found));
});

router.all('/', function stringlessQueryFailure(req, res) {
  res.status(400).send(failure.query);
});

module.exports = router;
