var TCP_SERVER_PORT = 2205;
var UDP_SERVER_PORT = 12345;
var MULTICAST_ADDRESS = '239.255.22.5';

var musicians = [];

var net = require('net');
var tcpServer = net.createServer();

/* Connect to the server with TCP using telnet <address_depending_on_setup> <tcp_port> */

/* display list of musicians for each connection. Disconnect immediatly */
tcpServer.on('connection', function (socket) {
    updateMusicians();
    socket.write(JSON.stringify(musicians, null, '\t') + "\n");
    socket.end();
});

tcpServer.listen(TCP_SERVER_PORT);

function updateMusicians() {
	
    var date = new Date().getTime();
    for (var i = 0; i < musicians.length; i++) {
		
		/* remove musician if not active since more than 5 seconds */
        if ((Date.parse(musicians[i].activeSince)) < date - 5000) {
            console.log('Musician : ' + JSON.stringify(musicians[i]) + ' not active anymore');
            musicians.splice(i, 1);
        }
    }
}

/* This part is to listen to all musicians through UDP datagrams */

var dgram = require('dgram');
var udpServer = dgram.createSocket('udp4');

udpServer.on('message', function (musician, source) {
	
    var m = JSON.parse(musician);
    for (var i = 0; i < musicians.length; i++) {
        if (m.uuid == musicians[i].uuid) {
			/* refresh remaining time */
            musicians[i].activeSince = m.activeSince; 
            return;
        }
    }
    console.log('New musician has arrived : ' + musician);
    musicians.push(m);
});

udpServer.bind(UDP_SERVER_PORT, function () {
    console.log('An auditor joined the multicast group');
    udpServer.addMembership(MULTICAST_ADDRESS);
});