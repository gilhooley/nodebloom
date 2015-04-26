var BitArray = require('bit-array');
var FNV = require('fnv').FNV;
var murmur = require("murmurhash-js");
var djb2 = require('djb2');

var BloomFilter = function(bitArraySize) {
  var storage, findHashIndices;

  storage = new BitArray(bitArraySize);

  findHashIndices = function(string) {
    var hashFNV, hashMurmur3, hashdjb2;

    hashFNV = new FNV().update(string).value() % bitArraySize;
    hashMurmur3 = murmur.murmur3(string, 32) % bitArraySize;
    hashdjb2 = djb2(string) % bitArraySize;

    return [].concat({hash: 'fnv', value: hashFNV}, 
      {hash: 'murmur3', value: hashMurmur3}, 
      {hash: 'djb2', value: hashdjb2});
  };

  this.insert = function(string, cb) {
    var error, hashIndexArray;
    hashIndexArray = findHashIndices(string);
    hashIndexArray.forEach(function(hashIndex) {
      storage.set(hashIndex.value, true);
      if(!storage.get(hashIndex.value)) {
        error = "Error inserting at index " + hashIndex.value
        + " with hash " + hashIndex.hash;
      }
    });
    return cb(error);
  };

  this.query = function(string) {
    var found = true, hashIndexArray;
    hashIndexArray = findHashIndices(string);

    return hashIndexArray.reduce(function(last, next) {
      return !last ? last : storage.get(next.value);
    }, found);
  };

};

var nodeBloom = new BloomFilter(32);

module.exports = nodeBloom;
