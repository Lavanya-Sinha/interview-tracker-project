const { WebSocketServer } = require("ws");

let wss;

function initWebSocket(server) {
  wss = new WebSocketServer({ server });

  globalThis.wss = wss;

  wss.on("connection", (ws) => {
    console.log("Client Connected");

    ws.on("message", (message) => {
      const msg = message.toString();

      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(
            JSON.stringify({
              type: "TEST_EVENT",
              message: msg,
            })
          );
        }
      });
    });

    ws.on("close", () => {
      console.log("Client Disconnected");
    });
  });
}

module.exports = initWebSocket;
