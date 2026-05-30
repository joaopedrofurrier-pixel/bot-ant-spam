const {
    Client,
    GatewayIntentBits,
    PermissionsBitField
} = require('discord.js');

const {
    joinVoiceChannel,
    entersState,
    VoiceConnectionStatus
} = require('@discordjs/voice');

require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});


// ======================
// CONFIG DOS SERVIDORES
// ======================

const SERVERS = [
    {
        trapChannelId: process.env.ID_CANAL_1,
        voiceChannelId: process.env.ID_CALL_1
    },

    {
        trapChannelId: process.env.ID_CANAL_2,
        voiceChannelId: process.env.ID_CALL_2
    }

    // ADICIONE MAIS AQUI SE QUISER
    // {
    //     trapChannelId: process.env.ID_CANAL_3,
    //     voiceChannelId: process.env.ID_CALL_3
    // }
];


// ======================
// BOT ONLINE
// ======================

client.on('ready', async () => {

    console.log(`Bot ligado como ${client.user.tag}`);

    for (const server of SERVERS) {

        try {

            // ignora configs vazias
            if (!server.voiceChannelId) continue;

            const channel = await client.channels.fetch(
                server.voiceChannelId
            );

            if (!channel) {

                console.log(
                    `Call não encontrada: ${server.voiceChannelId}`
                );

                continue;
            }

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: false,
                selfMute: true
            });

            await entersState(
                connection,
                VoiceConnectionStatus.Ready,
                30000
            );

            console.log(
                `Conectado na call: ${channel.name}`
            );

        } catch (err) {

            console.log(
                `Erro ao entrar na call ${server.voiceChannelId}`
            );

            console.log(err);
        }
    }
});


// ======================
// CANAL ARMADILHA
// ======================

client.on('messageCreate', async (message) => {

    if (message.author.bot) return;

    if (!message.member) return;

    // ignora admins
    if (
        message.member.permissions.has(
            PermissionsBitField.Flags.Administrator
        )
    ) {
        return;
    }

    for (const server of SERVERS) {

        if (!server.trapChannelId) continue;

        if (message.channel.id === server.trapChannelId) {

            try {

                await message.delete();

                await message.member.timeout(
                    60 * 60 * 1000,
                    'Caiu no canal armadilha'
                );

                console.log(
                    `${message.author.tag} caiu na trap`
                );

            } catch (err) {

                console.log(err);
            }
        }
    }
});


// ======================
// LOGIN
// ======================

client.login(process.env.TOKEN_BOT);
