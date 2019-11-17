'use strict';
const http = require('http');
const headers = {};
http.createServer((req, res) => {
  headers['Access-Control-Allow-Origin'] = '*'
  headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
  headers['Access-Control-Allow-Credentials'] = true
  headers['Access-Control-Max-Age'] = '86400' // 24 hours
  headers['Access-Control-Allow-Headers'] = 'X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept'
  if (req.headers.accept && req.headers.accept == 'text/event-stream') {
    sendSSE(req, res)
  } else {
        headers['Content-Type'] = 'text/html';
        res.writeHead(200,headers);
        res.end("content");
  }
}).listen(8000)
const sendSSE = (req, res) => {
  headers['Content-Type'] = 'text/event-stream';
  headers['Cache-Control'] = 'no-cache';
  headers['Connection'] = 'keep-alive';
  headers['X-Accel-Buffering'] = 'no'; 
  // ^ no nginx proxy buffering, till now.sh fixes it.
  res.writeHead(200, headers);
  const id = (new Date()).toLocaleTimeString()
  // SSE every 5sec.
  setInterval(() => {
    constructSSE(res, id, (new Date()).toLocaleTimeString())
  }, 5000)
  constructSSE(res, id, (new Date()).toLocaleTimeString())
}
const constructSSE = (res, id, data) => {
  // @ebidel's impl.
  res.write(`id: ${id}\n`)
  res.write(`data: ${data}\n\n`)
}
