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

client.on(Events.MessageCreate, async (message) => {
        const matches = message.content.match(/https:\/\/(twitter\.com|x\.com)\/[^/]+\/status\/\d+/);
    
        if (matches) {
            try {
                const new_url = new URL(matches[0]);
                const path = new_url.pathname;

                fetch(`https://api.vxtwitter.com${path}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.json();
                    })
                    .then(async data => {

                        if (data.error) {
                            return;
                        }

                        const embed = new EmbedBuilder()
                            .setAuthor({ name: data.user_name, iconURL: data.user_profile_image_url, url: data.tweetURL })
                            .setDescription(data.text)
                            .setFields(
                                { name: '💘', value: `${data.likes}`, inline: true },
                                { name: '🔄 + 🗣️', value: `${data.replies + data.retweets}`, inline: true },
                            )
                            .setColor('Green');

                        if (data.mediaURLs.length > 0) {
                            embed.setImage(data.mediaURLs[0]);
                        }

                        await message.channel.send({ embeds: [embed] });
                    })
                    .catch(error => console.error('Error:', error));

            } catch (e) {
                console.error(e);
            }
        }
    }
});

client.login(process.env.TOKEN);
