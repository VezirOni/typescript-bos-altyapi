import { prefixCommands } from '../../helpers';

import { EmbedBuilder } from 'discord.js';

export const Command: prefixCommands = {
    data: {
        name: 'ping',
        description: 'Websocket gecikme hızını gösterir.'
    },
    
    run: async (message) => {
        await message.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Blue')
                .setAuthor({ name: `${message.client.user.username}`, iconURL: `${message.client.user.avatarURL()}` })
                .setDescription(`> Pong, websocket gecikme hızım anlık olarak **${message.client.ws.ping} milisaniye**`)
                .setTimestamp()
                .setFooter({ text: `${message.author.tag} tarafından talep edildi.`, iconURL: `${message.author.avatarURL()}` })
            ]
        });
    }
}