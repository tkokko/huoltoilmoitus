// citymapper
var deployd = require('deployd')
  , options = {port: 7070};

var dpd = deployd(options);

dpd.listen();

dpd.on('listening', function() {
  console.log("Server is listening");
});

dpd.on('error', function(err) {
  console.error(err);
  process.nextTick(function() { // Give the server a chance to return an error
    process.exit();
  });
});

