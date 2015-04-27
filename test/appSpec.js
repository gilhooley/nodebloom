var assert = require('assert');
var request = require('supertest');
var app = require('../app');
var failure = require('../src/failure');
request = request(app);

describe('the service', function() {
  describe('known routes', function() {
    var bassett = 'the stars are god\'s daisy chain';
    var auntDahlia = 'a tomato struggling for self-expression';

    describe('POST /insert', function() {      
      it('should insert a string', function(done) {
        request.post('/insert')
          .send({string: bassett})
          .expect(200, done);
      });
      
      it('should fail gracefully if user doesn\'t include a string', function(done) {
        request.post('/insert')
          .expect(failure.insert)
          .expect(400, done);
      });

      it('should fail gracefully if user sends bad data', function(done) {
        request.post('/insert')
          .send({data: bassett})
          .expect(failure.insert)
          .expect(400, done);
      });
    });

    describe('GET /query', function() {      
      it('should retrieve a string that\'s probably stored', function(done) {
        request.get('/query/' + bassett)
          .expect('{"found":true}')
          .expect(200, done);
      });

      it('should not retrieve a string that definitely isn\'t stored', function(done) {
        request.get('/query/' + auntDahlia)
          .expect('{"found":false}')
          .expect(200, done);
      });

      it('should fail gracefully if user doesn\'t include a string', function(done) {
        request.get('/query')
          .expect(failure.query)
          .expect(400, done);
      });
    });
  });

  describe('unknown routes', function() {    
    it('should fail gracefully if user requests a nonexistent route', function(done) {
      request.get('/imconfused')
        .expect(failure.route)
        .expect(400, done);
    });
  });
});
