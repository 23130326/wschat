// Installeer eerst de benodigde packages:
// npm install ws

const WebSocket = require('ws');

// WebSocket server opzetten
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server draait op poort 8080');

// Bijhouden van alle verbonden clients
const clients = new Set();

// Nieuwe verbinding afhandelen
wss.on('connection', function connection(ws) {
    // Client toevoegen aan de set
    clients.add(ws);
    
    console.log('Nieuwe client verbonden. Totaal aantal clients:', clients.size);
    
    // Stuur een welkomstbericht naar de nieuwe client
    ws.send('Welkom bij de chat!');
    
    // Bericht ontvangen van client
    ws.on('message', function incoming(message) {
        console.log('Ontvangen bericht:', message.toString());
        
        // Bericht doorsturen naar alle andere clients
        clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });
    
    // Verbinding gesloten
    ws.on('close', function() {
        clients.delete(ws);
        console.log('Client verbroken. Totaal aantal clients:', clients.size);
    });
});
