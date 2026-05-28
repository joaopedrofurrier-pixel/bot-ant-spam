const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
require('dotenv').config();

// ======================
// CONFIG DOS SERVIDORES
// ======================

const SERVERS = [
    { trapChannelId: process.env.ID_CANAL_1, voiceChannelId: process.env.ID_CALL_1 },
    { trapChannelId: process.env.ID_CANAL_2, voiceChannelId: process.env.ID_CALL_2 },
    // Adicione mais servidores aqui:
    // { trapChannelId: process.env.ID_CANAL_3, voiceChannelId: process.env.ID_CALL_3 },
];

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

// ======================
// FUNÇÕES AUXILIARES
// ======================

async function connectToVoice(server) {
    if (!server.voiceChannelId) return;

    try {
        const channel = await client.channels.fetch(server.voiceChannelId);

        if (!channel) {
            console.log(`Call não encontrada: ${server.voiceChannelId}`);
            return;
        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: true,
        });

        await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
        console.log(`Conectado na call: ${channel.name}`);

    } catch (err) {
        console.error(`Erro ao entrar na call ${server.voiceChannelId}:`, err);
    }
}

async function handleTrap(message) {
    try {
        await message.delete();
        await message.member.timeout(60 * 60 * 1000, 'Caiu no canal armadilha');
        console.log(`${message.author.tag} caiu na trap`);
    } catch (err) {
        console.error('Erro ao aplicar punição:', err);
    }
}

// ======================
// EVENTOS
// ======================

client.once('ready', async () => {
    console.log(`Bot ligado como ${client.user.tag}`);
    await Promise.allSettled(SERVERS.map(connectToVoice));
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.member) return;
    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    const isInTrap = SERVERS.some(
        (s) => s.trapChannelId && message.channel.id === s.trapChannelId
    );

    if (isInTrap) await handleTrap(message);
});

// ======================
// LOGIN
// ======================

client.login(process.env.TOKEN_BOT);