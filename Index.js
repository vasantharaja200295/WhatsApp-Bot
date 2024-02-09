const qrcode = require("qrcode-terminal");
const { Client, RemoteAuth } = require("whatsapp-web.js");
const { MongoClient } = require("mongodb");

require("dotenv").config();

const mongoClient = new MongoClient(process.env.MONGODB_URI);



mongoClient.connect()
    .then(() => {
        console.log('Connected to MongoDB');
        const sessionsStore = mongoClient.db('Secure');
        const client = new Client({
            session: {
                // Implement your own session storage using MongoDB
                store: async (key, value) => {
                    await sessionsStore.updateOne({ _id: key }, { $set: { value } }, { upsert: true });
                },
                retrieve: async (key) => {
                    const session = await sessionsStore.findOne({ _id: key });
                    return session ? session.value : null;
                },
            },
        });

        Authenticate(client);
        const {sessionStatus, readyStatus} = CheckStatus(client);
        console.log('Session Status:', sessionStatus);
        console.log('Ready Status:', readyStatus);

        client.initialize();

    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error);
    });


function Authenticate(client) {
    client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
    });
}

function CheckStatus(client) {
    let sessionStatus, readyStatus;
    client.on('remote_session_saved',()=>{
        sessionStatus= true;
    });
    client.on('ready',()=>{
        readyStatus = true;
    });
    return {sessionStatus, readyStatus};
}