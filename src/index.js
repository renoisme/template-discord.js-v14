require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Events,
    EmbedBuilder
} = require('discord.js');

const client = new Client({
    intents:
        [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessages,
        ]
});

client.once(Events.ClientReady, (c) => {
    console.log(`Log in with ${c.user.tag}`);
});

client.on(Events.MessageCreate, async message => {
    if (message.author.bot || message.webhookId) return;

    if (message.content == '!hi') {
        message.reply(`hi! ${message.author}`);
    }

    if (message.content == '!ping') {
        message.channel.send('pong!');
    }

    if (message.content.startsWith('!me')) {
        let user;
        if (message.mentions.users.size > 0) {
            user = message.mentions.users.first();
        } else {
            user = message.author;
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Avatar of ${user.username}` })
            .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setColor('Green')
            .setFooter({ text: `Created by ${user.username}` });

        await message.channel.send({ embeds: [embed] });
    }
});

client.login(process.env.TOKEN);