const WebSocket = require("ws")

const wss = new WebSocket.Server({port: 8082})

var dataString = JSON.stringify([[],[]])

wss.on("connection", ws => {
    console.log(`new client connected ! ${wss.clients.size}`)

    ws.on("message", data => {
        console.log(`recieved data from client: ${data}`)
    })

    ws.on("close", () => {
        console.log("a client has disconnected")
    })
})

