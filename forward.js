var net = require('net');
var child = require('child_process');
 
var forwards = require('/etc/forwards.json');

for (var x=0; x < forwards.length; x++ ) {
  start_proxy(forwards[x]);
}

function start_proxy(forward) {
  var server = net.createServer(function(c) { //'connection' listener
    // fork the process    
    var forwardRequest = child.fork(__dirname + '/forward-request.js',
        [
            forward.target_host,
            forward.inport,
            forward.outport
        ]
    );

    forwardRequest.send('socket', c);
    forwardRequest.disconnect();
  });
  
  server.listen(forward.inport, function() {
    console.log(forward.target_host + " :: " + 
      forward.outport + " -> " + 
      forward.inport );
  });

  server.on('error', function(e) { console.log(e) });
}

