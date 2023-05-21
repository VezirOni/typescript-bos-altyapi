import { SlashCommandBuilder } from 'discord.js';
import { slashCommands } from '../../helpers';

import { EmbedBuilder } from 'discord.js';

export const Command: slashCommands = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Websocket gecikme hızını gösterir.'),

    run: async (interaction) => {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Blue')
                .setAuthor({ name: `${interaction.client.user.username}`, iconURL: `${interaction.client.user.avatarURL()}` })
                .setDescription(`> Pong, websocket gecikme hızım anlık olarak **${interaction.client.ws.ping} milisaniye**`)
                .setTimestamp()
                .setFooter({ text: `${interaction.user.tag} tarafından talep edildi.`, iconURL: `${interaction.user.avatarURL()}` })
            ]
        });
    }
}