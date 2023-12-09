require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Events,
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require('discord.js');

const commands = [
    {//start
        command: new SlashCommandBuilder()
            .setName('start')
            .setDescription('スタートコマンド')
    }
].map(c => c.command);

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

    if (commands.length > 0) {
        client.application.commands.set(commands, process.env.DEV_GUILD_ID);//全ての鯖に登録する場合：.set(commands);にする
    }

});

client.on(Events.InteractionCreate, async (interaction) => {
    const { commandName, customId } = interaction;

    if (interaction.isChatInputCommand()) {
        if (commandName === 'start') {
            const modal = new ModalBuilder()
                .setCustomId('start_modal')
                .setTitle('何を入力しますか？')

            const f_input = new TextInputBuilder()
                .setCustomId('f_input')
                .setLabel('メッセージ')
                .setPlaceholder('メッセージを入力してください')
                .setStyle(TextInputStyle.Paragraph);

            const f_row = new ActionRowBuilder().addComponents(f_input);

            modal.addComponents(f_row);

            await interaction.showModal(modal);
        }
    }
    if (interaction.isModalSubmit()) {
        if (customId == interaction.customId) {
            const text = interaction.fields.getTextInputValue('f_input') ?? 'なんもない';
            await interaction.reply({ content: `あなたは ${text} と言いました。`, allowedMentions: { parse: [] } });
        }
    }
});

client.login(process.env.TOKEN);
