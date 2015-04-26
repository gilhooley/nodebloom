var assert = require('assert');
var request = require('supertest');
var app = require('../app');
request = request(app);

describe('the service', function() {
  describe('known routes', function() {
    var bassett = 'the stars are god\'s daisy chain';
    var auntDahlia = 'a tomato struggling for self-expression';

    describe('POST /insert', function() {
      var postFailureMessage = 'Include a string with your insert request.';
      
      it('should insert a string', function(done) {
        request.post('/insert')
          .send({string: bassett})
          .expect(200, done);
      });
      
      it('should fail gracefully if user doesn\'t include a string', function(done) {
        request.post('/insert')
          .expect(postFailureMessage)
          .expect(400, done);
      });

      it('should fail gracefully if user sends bad data', function(done) {
        request.post('/insert')
          .send({data: bassett})
          .expect(postFailureMessage)
          .expect(400, done);
      });
    });

    describe('GET /query', function() {
      var getFailureMessage = 'Include a string with your query.';
      
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
          .expect(getFailureMessage)
          .expect(400, done);
      });
    });
  });

  describe('unknown routes', function() {
    var routeFailureMessage = 'We don\'t recognize that route. Try /query or /insert.';
    
    it('should fail gracefully if user requests a nonexistent route', function(done) {
      request.get('/imconfused')
        .expect(routeFailureMessage)
        .expect(400, done);
    });
  });
});
