var BitArray = require('bit-array');
var FNV = require('fnv').FNV;
var murmur = require("murmurhash-js");
var djb2 = require('djb2');

var BloomFilter = function(bitArraySize) {
  var storage, findHashIndices;

  storage = new BitArray(bitArraySize);

  findHashIndices = function(string) {
    var hashFNV, hashMurmur3, hashdjb2;

    hashFNV = Math.abs(new FNV().update(string).value() % bitArraySize);
    hashMurmur3 = Math.abs(murmur.murmur3(string, 32) % bitArraySize);
    hashdjb2 = Math.abs(djb2(string) % bitArraySize);

    return [].concat({hash: 'fnv', index: hashFNV}, 
      {hash: 'murmur3', index: hashMurmur3}, 
      {hash: 'djb2', index: hashdjb2});
  };

  this.insert = function(string, cb) {
    var error, hashIndexArray;
    hashIndexArray = findHashIndices(string);
    hashIndexArray.forEach(function(hashIndex) {
      storage.set(hashIndex.index, true);
      if(!storage.get(hashIndex.index)) {
        if(!error) error = {};
        error[hashIndex.hash] = hashIndex.index;
      }
    });
    return cb(error);
  };

  this.query = function(string) {
    hashIndexArray = findHashIndices(string);

    return hashIndexArray.every(function(hash) {
      return storage.get(hash.index);
    });
  };

};

var nodeBloom = new BloomFilter(32);

module.exports = nodeBloom;
