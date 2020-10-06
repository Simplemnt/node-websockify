# node-websockify (inspired by [@maximegris/node-websockify](https://github.com/maximegris/node-websockify))
WebSocket-to-TCP proxy/bridge in NodeJS

If you want to run a websockets to tcp proxy alongside a standard http server, this package is for you.

It is very similar to the aformentioned [@maximegris/node-websockify](https://github.com/maximegris/node-websockify), but the big difference is that library spins up a standalone web server. If you are already using a http server, you would be out of luck. This package lets you do that!

This has not been tested at all for any use cases aside from what [Simplemnt](https://simplemnt.com) uses. PRs and issues welcome.

Probably works on Node 10+ only, but may work all the way back to Node 6.

## Installation 

```
npm install --save @simplemnt/node-websockify
```

## Usage

```javascript
const websockify = require('@simplemnt/node-websockify')
const wsProxy = websockify('HOST:PORT')
 ...
 ...
 wsProxy(httpServer, 'path-to-serve-websockets-on')
```
### Express

```javascript
const express = require('express')
const app = express()
const server = require('http').Server(app)

const port = process.env.PORT || 8080

const websockify = require('@simplemnt/node-websockify')
const wsProxy = websockify('0.0.0.0:5900')

server.listen(port, () =>  console.log('listening on *:' + port))
wsProxy(server, '/some-path')
```

### http (untested)
```javascript
const http = require('http')

const port = process.env.PORT || 8080

const websockify = require('@simplemnt/node-websockify')
const wsProxy = websockify('0.0.0.0:5900')

const server = http.createServer()
server.listen(port)
wsProxy(server, '/some-path')
```
