import { Client, IntentsBitField, Partials } from 'discord.js';
import { slashCommandsHandler, slashCommandsRegister, prefixCommandsHandler, eventsHandler, prefixCommands, slashCommands } from './helpers';

import config from './config';

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ],
    partials: [
        Partials.Channel, Partials.Message, Partials.GuildMember, Partials.User
    ],
    allowedMentions: {
        parse: ['everyone', 'roles', 'users']
    },
    presence: {
        status: 'online',
        afk: false,
        activities: [{ name: 'connecting..' }]
    },
    shards: 'auto',
});

slashCommandsHandler();
prefixCommandsHandler();
eventsHandler(client);

client.once('ready', () => slashCommandsRegister());

client.on('interactionCreate', (interaction) => {
    if(interaction.isCommand()) {
        let cmd = slashCommands.find((cmd) => cmd.data.name === interaction.commandName);

        if(cmd) {
            cmd.run(interaction)
        }
    }
});

client.on('messageCreate', (message) => {
    if(!message.guild) return;
    if(message.author.bot) return;

    if(!message.content.startsWith(config.messageContent.prefix)) return;

    let args = message.content.slice(config.messageContent.prefix.length).trim().split(/ +/g);
    let cmd = prefixCommands.find((cmd) => cmd.data.name === `${args.shift()?.toLowerCase()}`);

    if(cmd) {
        return cmd.run(message, args)
    } 
});

client.login(config.discord.token);
