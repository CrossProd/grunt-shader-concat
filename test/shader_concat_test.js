'use strict';

var grunt = require('grunt');

exports.shader_concat = {
  setUp: function(done) {
    done();
  },

  default_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/default_options');
    var expected = grunt.file.read('test/expected/default_options');

    test.equal(actual, expected, 'should describe what the default behavior is.');

    test.done();
  },
};
