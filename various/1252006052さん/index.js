require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Events,
} = require('discord.js');

const client = new Client({
    intents:
        [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessages,
        ]
});

const cron = require('node-cron');

client.once(Events.ClientReady, (c) => {
    console.log(`Log in with ${c.user.tag}`);
});


cron.schedule('0 0 0 * * *', () => console.log('◯◯◯'));

client.on(Events.MessageCreate, async message => {
    if (message.channel.id === '<channel_id>') {
        message.reply('○○')
    }
    if (message.channel.name === '◯◯◯') {
        message.channel.send('○○');
    }
});

client.login(process.env.TOKEN);