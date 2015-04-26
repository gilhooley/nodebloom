var assert = require('assert');
var bloomFilter = require('../src/bloomFilter');

describe('the bloom filter data structure', function(){
  var psmith = 'P as in pshrimp';
  var bertie = 'a blot on the Wooster escutcheon';

  describe('insert method', function() {
    var insertError = false;
    bloomFilter.insert(psmith, function(error) {
      if(error) insertError = error;
    });

    it('should not err on insertion', function() {
      assert.equal(false, insertError);
    });
  });

  describe('query method', function() {
    it('should return true when the string is probably stored', function(){
      assert.equal(true, bloomFilter.query(psmith));
    });

    it('should return false when the string is definitely not stored', function(){
      assert.equal(false, bloomFilter.query(bertie));
    });
  });
});
