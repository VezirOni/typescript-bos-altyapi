import { Client } from 'discord.js';
import { Events } from '../helpers';

export const Event: Events = {
    name: 'ready',

    run: (client: Client) => {
        console.log(`Logged in as ${client.user?.tag}!`);

        setTimeout(() => {
            client.user?.setActivity({ name: `Shards: ${client.shard?.count || 1}` });
        }, 5000);
    }
}