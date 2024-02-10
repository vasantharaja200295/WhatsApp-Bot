const { Client, RemoteAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');



mongoose.connect("mongodb://localhost:27017").then(() => {
    const store = new MongoStore({ mongoose: mongoose });
    const client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000,
        })
    });


    client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
    });

    client.on('remote_session_saved', ()=>{
        console.log('Session saved!');
    })
    
    client.on('ready', () => {
        console.log('Client is ready!');
    });
    
    let tirgger = ['Hey', "hello", 'Hi', 'hi', 'Hello', 'Oi', 'oi', 'Hoi', 'hoi', 'hey', 'hoii', 'Hoii', 'oii', 'Oii'] 
    let contacts = ['919629579216', '917010846735']
    let count = 0;
    client.on('message', async (message) => {
        if(contacts.includes(message.from.split('@')[0])){
            if (tirgger.includes(message.body)) {
                await message.reply('What!');
                count++;
            }else if(count>0){
                await client.sendMessage(message.from, 'Bye!');
                count = 0;
            } 
        }
    });
    
    client.initialize();
});