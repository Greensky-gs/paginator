const { Collection, Message } = require("discord.js");

/**
* @param {Discord.User} user 
* @param {Discord.Channel} channel
* @param {Array} list 
* @param {String} paginationName 
*/
const paginator = (user, channel, list, paginationName) => {
    const pages = list;
    let index = 0;
    let id = paginationName;

    // Buttons
    const row = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageButton()
        .setEmoji('◀')
        .setCustomId('back')
        .setStyle('SECONDARY'),
    new Discord.MessageButton()
        .setEmoji('🔢')
        .setCustomId('select')
        .setStyle('PRIMARY'),
    new Discord.MessageButton()
        .setStyle('SECONDARY')
        .setEmoji('▶')
        .setCustomId('front'),
    new Discord.MessageButton()
        .setStyle('DANGER')
        .setCustomId('close')
        .setEmoji('❌')
        )
    
    // Here we send the first page of the paginator with the buttons.
    channel.send({ embeds: [list[index]], components: [ row ] }).then(/** @param {Discord.Message} msg*/ (msg) => {
        // Create a component (button) collector
        const collector = msg.createMessageComponentCollector({ filter: (i) => i.user.id == user.id , time: 60000*5});
        
        // Here we define all functions ( front, back, select and close )
        /**
         * @param {Discord.ButtonInteraction} interaction 
         */
        const fnt = async(interaction) => {
            if (interaction.customId == 'back') {
                // Here we can't decrement index
                if (index == 0) return;
                // Decrement index
                index--;

                // Send new page
                await msg.edit({ embeds: [ pages[index] ] }).catch(() => {});
            };

            if (interaction.customId == 'front') {
                // We can't increment index
                if (index == pages.length) return;
                // Increment index
                index++;

                // Send new page
                await msg.edit({ embeds: [ pages[index] ] }).catch(() => {});
            };

            if (interaction.customId === 'close') {
                // Just delete message
                await msg.delete().catch(() => {});

                // Send close message
                channel.send({ content: `<@${user.id}> you closed the \`${id}\` paginator` }).catch(() => {});
                // Stop collector
                collector.stop('closed');
            };
        
            if (interaction.customId === 'select') {
                // Create a message collector, that only the user can use.
                const msgCollector = channel.createMessageCollector({ filter: (m) => m.author.id == user.id , time: 120000});

                // Create a trash for messages to delete
                var trash = new Collection();
                
                // Ask user for page
                channel.send({ content: `<@${user.id}> Wich page did you want to see ?` }).then((x) => {
                    // Set sent in trash
                    trash.set(x.id, x);
                });

                msgCollector.on('collect', async(m) => {
                    // Set sended message in trash
                    trash.set(m.id, m);
                    if (m.content.toLowerCase() == 'cancel') {
                        // Cancel
                        channel.send({ content: "Canceled" }).then((x) => {
                            setTimeout(() => {
                                // Delete message after 5 seconds
                                x.delete().catch(() => {})
                            }, 5000);
                        });

                        // Stop message collector
                        msgCollector.stop('closed');
                        return;
                    };

                    // Get specified number
                    let number = parseInt(m.content);
                    // Check if valid number
                    if (isNaN(number)) return channel.send({ content: "It's not a valid number" }).then(x => trash.set(x.id, x));
                    // Decrement number to get it as computer language
                    number--;
                    // Check if page exist.
                    if (number < 0 || number > pages.length) return channel.send({ content: 'This page doesn\'t exist' }).then(x => trash.set(x.id, x));

                    // Select page
                    const selected = pages[number];

                    // Edit message
                    await msg.edit({ embeds: [ selected ] }).catch(() => {});
                    // Set index on new value.
                    index = number;
                    // Stop message collector
                    msgCollector.stop();
                });

                msgCollector.on('end', () => {
                    // Delete all messages once ended
                    msg.channel.bulkDelete(trash).catch(() => {});
                });
            };
        }
        
        collector.on('collect', (interaction) => {
            // Use interaction
            fnt(interaction);

            // Defer interaction
            interaction.deferUpdate()
        });
    });
};

module.exports = paginator;