import path from 'path';
import fs from 'fs';

import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, CommandInteraction, ClientEvents, REST, Routes, Client, Message } from 'discord.js';

import config from '../config';

export interface slashCommands {
    data: | Omit<SlashCommandBuilder, 'addSubcommandGroup' | 'addSubcommand'> 
          | SlashCommandSubcommandsOnlyBuilder;
    run: (interaction: CommandInteraction) => Promise<void> | any; 
}

export interface prefixCommands {
    data: {
        name: string,
        description: string,
        aliases?: string[]
    }
    run: (message: Message, args: string[]) => Promise<void> | any; 
}

export interface Events {
    name: keyof ClientEvents,
    run: (...args: any) => Promise<void> | any;
}

export const slashCommands: slashCommands[] = [];
export const prefixCommands: prefixCommands[] = [];

export const slashCommandsHandler = () => {
    let commandsDir = path.resolve(__dirname, '../commands/interactionContent');
    if(!fs.existsSync(commandsDir)) return console.error('Slash komutlar klasörü yok.');

    fs.readdirSync(commandsDir, { encoding: 'utf-8' }).filter((file: string) => file.endsWith('.ts')).forEach(async (command: string) => {
        const { Command }: { Command: slashCommands } = await import(`../commands/interactionContent/${command}`);
        if(!Command) return console.error(`${command} - props(lar) yok.`)

        slashCommands.push(Command)

        delete require.cache[require.resolve(`../commands/interactionContent/${command}`)];
    });
}

export const prefixCommandsHandler = () => {
    let commandsDir = path.resolve(__dirname, '../commands/messageContent');
    if(!fs.existsSync(commandsDir)) return console.error('Prefix komutlar klasörü yok.');

    fs.readdirSync(commandsDir, { encoding: 'utf-8' }).filter((file: string) => file.endsWith('.ts')).forEach(async (command: string) => {
        const { Command }: { Command: prefixCommands } = await import(`../commands/messageContent/${command}`);
        if(!Command) return console.error(`${command} - props(lar) yok.`)

        prefixCommands.push(Command)

        delete require.cache[require.resolve(`../commands/messageContent/${command}`)];
    });
}

export const eventsHandler = (client: Client) => {
    let eventsDir = path.resolve(__dirname, '../events');
    if(!fs.existsSync(eventsDir)) return console.error('Events komutlar klasörü yok.');

    fs.readdirSync(eventsDir, { encoding: 'utf-8' }).filter((file: string) => file.endsWith('.ts')).forEach(async (event: string) => {
        const { Event }: { Event: Events } = await import(`../events/${event}`);
        if(!Event) return console.error(`${event} - props(lar) yok.`)

        client.on(Event.name, (...args: any) => Event.run(...args));

        delete require.cache[require.resolve(`../events/${event}`)];
    });
}

export const slashCommandsRegister = () => {
    let rest = new REST({ version: '10' }).setToken(`${config.discord.token}`);

    rest.put(Routes.applicationCommands(`${config.discord.id}`), {
        body: slashCommands.map((cmd) => cmd.data)
    });
}