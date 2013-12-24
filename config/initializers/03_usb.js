var usb = require('usb');
var _ = require('underscore');
var colors = require('colors');

// Config files
var config_mouse = require('../devices/mouse.usb.json');

// Statics
BUFFER_SIZE = 3;

module.exports = function(done) {

	console.log('  - ' + usb.getDeviceList().length + ' usb ports'.red);

	var self = this;
	usb.setDebugLevel(3);

	_.each(usb.getDeviceList(), function(dev) {
		//	console.log(dev);
	});

	// Map controls
	this.controls = [];
	_.each(config_mouse.controls, function(value, key) {
		self.controls.push({ ctrl: key, val: new Uint8Array(value)});
	});

	// Select USB-port by Vendor, Product.
	var remote = usb.findByIds(config_mouse.config.vendorId, config_mouse.config.productId); // mouse

	// Open USB BUS
	remote.open();

	// Get the interface to device
	var interfaces = remote.interfaces; // 0
	var interface = remote.interface(0);

	// If kernel driver is active, close and claim!
	if ( interface.isKernelDriverActive()) {
		interface.detachKernelDriver();
		interface.claim();
	} else {
		interface.release();
		interface.attachKernelDriver();
	}

	// Get device endpoints and select
	var endpoints = interface.endpoints;
	var endpoint = interface.endpoint(config_mouse.config.endpoint);

	// Read or read/write
	var direction = endpoint.direction; // in

	// Receive data events
	endpoint.on('data', function(data) {
		if( Buffer.isBuffer(data)) {
			var arrayBuffer = new Uint8Array(data);
			var pluck = _.find(self.controls, function(ctrl) { return _.isEqual(arrayBuffer, ctrl.val); });
			if (pluck) console.log(_.first(_.values(pluck)));
		}
	});

	// Receive error events
	endpoint.on('error', function(error) {
		console.log(error);
	});

	// Receive end events
	endpoint.on('end', function() {
		console.log('Stream ended');
	});

	// Start streaming from device
	endpoint.startStream( BUFFER_SIZE, endpoint.descriptor.wMaxPacketSize);

	// End
	done();
};