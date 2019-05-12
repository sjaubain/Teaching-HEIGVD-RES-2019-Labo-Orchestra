var UDP_SERVER_PORT = 12345;
var MULTICAST_ADDRESS = '239.255.22.5';

var dgram = require('dgram');
var uuid = require('uuid');

var udpClient = dgram.createSocket('udp4');

function Musician(instrument) {
	
    this.instrument = instrument;

    var data = {
        uuid: uuid(),
        instrument: instrument
    }

	/* update musician activity each second and inform server
	 * to let it know if it has to remove a non active musician */
    Musician.prototype.update = function () {
		
        data.activeSince = new Date().toISOString();
        var payload = JSON.stringify(data, null,'\t');

        message = new Buffer(payload);
        udpClient.send(message, 0, message.length, UDP_SERVER_PORT, MULTICAST_ADDRESS, function (err, bytes) {
            console.log('Update : ' + payload);
        });
    }
    setInterval(this.update.bind(this), 1000);
}

/* Start new musician with node musician <instrument> */
var instrument = process.argv[2];
var m1 = new Musician(instrument);