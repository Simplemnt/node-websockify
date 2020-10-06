'use strict'

const net = require('net')
const WebSocketServer = require('ws').Server

module.exports = target => {

  const [target_host, target_port] = target.split(':')

  if (isNaN(target_port)) {
    console.error("illegal port")
    process.exit(2)
  }

  return (server, path) => {
    if (!path) path = '/'
    const wsServer = new WebSocketServer({ server, path })

    wsServer.on('connection', (client, req) => {
      const clientAddr = client._socket.remoteAddress
      console.log(req ? req.url : client.upgradeReq.url)
      const log = msg => console.log(' ' + clientAddr + ': ' + msg)
      log('WebSocket connection from : ' + clientAddr)
      log('Version ' + client.protocolVersion + ', subprotocol: ' + client.protocol)

      const target = net.createConnection(target_port, target_host, () => log('connected to target'))
      target.on('data', data => {
        try {
          client.send(data)
        } catch (e) {
          log("Client closed, cleaning up target")
          target.end()
        }
      })
      target.on('end', () => {
        log('target disconnected')
        client.close()
      })
      target.on('error', () => {
        log('target connection error')
        target.end()
        client.close()
      })
      client.on('message', msg => {
        target.write(msg)
      })
      client.on('close', (code, reason) => {
        log(`WebSocket client disconnected: ${code} [ ${reason} ]`)
        target.end()
      })
      client.on('error', error => {
        log('WebSocket client error: ' + error)
        target.end()
      })
    })
  }
}