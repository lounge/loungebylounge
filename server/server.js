var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Mjoojo! nu jaevlar haender det grejer!\n');
}).listen(80);
console.log('Server running at port 80');
