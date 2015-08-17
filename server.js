var net = require('net');
var util = require('util');
var io = require('socket.io').listen(8080, {log: false});

var connectionOptions = {
	ip: 'localhost',
	port: 6555
};

var connection = net.createConnection(connectionOptions, function() {

	console.log('Connected to TheEyeTribe Server on port ' + connectionOptions.port);

	setInterval(function() {
		connection.write(JSON.stringify({
				"category": "heartbeat"
		}));
	}, 2000);

	// Set some values
	connection.write(JSON.stringify({
		category: 'tracker',
		request: 'set',
		values: {push: true}
	}));

});

connection.on('error', function(err) {
	console.log('TheEyeTribe connection Error', err.errno);
});

connection.on('close', function(data) {
	console.log('TheEyeTribe connection closed');
});

connection.on('data', function(data) {
		try {
			data = JSON.parse(data);
			if(data.values && data.values.frame) {
				handleFrameData(data.values.frame);
			}
		} catch(e) {
			console.error('Malformed JSON', e);
		}
});

connection.setEncoding('utf8');

function handleFrameData(data) {
	console.log(data.avg.x+'\t\t'+data.avg.y);
	io.sockets.emit('frame', data);
}
