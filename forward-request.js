var net = require('net');

process.on('message', function(m, parentSocket) {
  if (m == 'socket') {
    createConnection(parentSocket, {
        "target_host": process.argv[2],
        "inport": process.argv[3],
        "outport": process.argv[4]
    });
  }
});

function createConnection(parentSocket, forward) {
  var client = new net.Socket();
  try {
    client.connect(forward.outport, forward.target_host, function() {
      console.log('Forwarding to ' + forward.target_host + ":" + forward.outport);
    });

    client.on('end', function() {
      console.log('End on ' + forward.target_host);
      process.exit(0);
    });

    client.on('error', function() {
      console.log('Error on ' + forward.target_host);
      process.exit(0);
    });

    client.on('close', function() {
      console.log('Close on ' + forward.target_host);
      process.exit(0);
    });

    client.on('timeout', function() {
      console.log('Timeout on ' + forward.target_host);
      process.exit(0);
    });
  } catch (err) {
    console.log(err.message);
  }

  try {
    parentSocket.pipe(client);
    client.pipe(parentSocket);
  } catch (error) {
    console.log(error);
  }
}
