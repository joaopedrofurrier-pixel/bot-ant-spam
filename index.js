const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ID do canal armadilha
const TRAP_CHANNEL_ID = '1503466076032467044';

client.on('ready', () => {
    console.log(`Bot ligado como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {

    if (message.author.bot) return;

    // ignora admins
    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return;
    }

    if (message.channel.id === TRAP_CHANNEL_ID) {

        try {
            await message.delete();

            await message.member.timeout(
                60 * 60 * 1000,
                'Caiu no canal armadilha'
            );

            console.log(`${message.author.tag} caiu no honeypot`);

        } catch (err) {
            console.log(err);
        }
    }
});

// TOKEN DO BOT
client.login('MTUwMzQ2MTgwNDUzNjM2OTE1Mg.GHktkU.UHvM3HzDmx4rU_veKuDgR0rbPUt7HeDWil13SE');