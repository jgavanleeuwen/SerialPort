var serialport = require('serialport');
var sf = require('sf');
var _ = require('underscore');
var colors  = require('colors');

module.exports = function(done) {
	
	serialport.list(function(err, results) {

		if (err) throw (err);

		console.log('  - ' + results.length + ' serial ports'.red);

		_.each(results, function(result) {
			console.log(sf('{comName,-15} {pnpId,-20} {manufacturer}', result));
		});

		done();

	});
};
