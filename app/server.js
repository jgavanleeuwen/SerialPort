var locomotive = require('locomotive');
var colors = require('colors');
var	env = process.env.NODE_ENV || 'development';
var	port = process.env.PORT || 3000;
var	address = '0.0.0.0';

locomotive.boot('./', env, function(err, server) {
	if (err) { 
		throw err; 
	}
	
	server.listen(port, address, function() {
		var addr = this.address();
		console.log('   info  -'.cyan + ' locomotive started on %s:%d', addr.address, addr.port);
	});
});