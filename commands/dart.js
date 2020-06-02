const Discord = require('discord.js');
const { cyber } = require('../jsons/colours.json');
const fetch = require('node-fetch');
const url = 'http://topper64.co.uk/nk/btd6/dat/towers.json';
const settings = { method: 'Get' };
module.exports = {
    name: 'dart',
    aliases: ['dm', 'dart-monkey'],
    description:
        'very epic thing inspired from https://unforgivenjake.github.io/btd6rc/',
    usage: '[command name]',
    execute(message, args, client) {
        if (!args[0]) {
            return message.channel.send(
                `The syntax of this command is q!${name} <path1><path2><path3>, i.e. q!${name} 003 would represent the third tier tower of the third path. **no crosspaths are accepted**, i.e. no more that one path should be inputted`
            );
        }
        if (args[1]) {
            return message.channel.send(
                'There should not be space in between the paths!'
            );
        }

        let name = 'dart-monkey';

        let path1 = Math.floor(parseInt(args[0]) / 100);
        let path2 = Math.floor((parseInt(args[0]) - path1 * 100) / 10);
        let path3 = parseInt(args[0] - path1 * 100 - path2 * 10);
        let path = 1;
        function hard(cost) {
            return Math.round((cost * 1.08) / 5) * 5;
        }
        if (path2 < 1 && path3 < 1) {
            path = 1;
        } else if (path1 < 1 && path3 < 1) {
            path = 2;
        } else if (path1 < 1 && path2 < 1) {
            path = 3;
        } else {
            // when more than 2 values are positive, i.e. like not 00x, 0x0, or x00 args[0]
            const embed = new Discord.MessageEmbed()
                .setTitle('Please choose one upgrade at a time!')
                .setDescription(
                    `For example:\n❌ q!${name} 130\n✅ q!${name} 030`
                );
            return message.channel.send(embed);
        }
        let tier = 0;
        switch (path) {
            case 1:
                tier = path1;
                break;
            case 2:
                tier = path2;
                break;
            case 3:
                tier = path3;
                break;
        }
        fetch(url, settings)
            .then((res) => res.json())
            .then((json) => {
                let object = json[`${name}`].upgrades[path - 1][tier - 1];
                if (!object) {
                    object = json[`${name}`];
                    let embed = new Discord.MessageEmbed()
                        .setColor(cyber)
                        .addField('name', object.name)
                        .addField('cost', `${object.cost} (medium)`)
                        .addField('notes', object.notes)
                        .addField('in game description', object.description)
                        .setFooter(
                            'd:dmg|md:moab dmg|cd:ceram dmg|p:pierce|r:range|s:time btw attacks|j:projectile count|\nq!ap for help and elaboration'
                        );
                    return message.channel.send(embed).then((msg) => {
                        msg.react('❌');
                        let filter = (reaction, user) => {
                            return (
                                reaction.emoji.name === '❌' &&
                                user.id === message.author.id
                            );
                        };
                        const collector = msg.createReactionCollector(filter, {
                            time: 20000,
                        });

                        collector.on(
                            'collect',
                            (reaction, reactionCollector) => {
                                msg.delete();
                            }
                        );
                    });
                }

                let totalCost = 0;
                let hardTotalCost = 0;
                let newCost = 0;
                for (i = tier; i > 0; i--) {
                    newCost = json[`${name}`].upgrades[path - 1][i - 1].cost;
                    totalCost += parseInt(newCost);
                }
                let baseCost = parseInt(json[`${name}`].cost);
                totalCost += baseCost;

                let embed = new Discord.MessageEmbed()
                    .setColor(cyber)
                    .addField('name', object.name)
                    .addField(
                        'cost',
                        `${hardTotalCost} (hard), ${object.cost} (medium)`
                    )
                    .addField('notes', object.notes)
                    .addField('in game description', object.description)
                    .addField(
                        'total cost',
                        `${hardTotalCost} (hard), ${totalCost} (medium)`
                    )
                    .setFooter(
                        'd:dmg|md:moab dmg|cd:ceram dmg|p:pierce|r:range|s:time btw attacks|j:projectile count|\nq!ap for help and elaboration'
                    );
                message.channel.send(embed).then((msg) => {
                    msg.react('❌');
                    let filter = (reaction, user) => {
                        return (
                            reaction.emoji.name === '❌' &&
                            user.id === message.author.id
                        );
                    };
                    const collector = msg.createReactionCollector(filter, {
                        time: 20000,
                    });

                    collector.on('collect', (reaction, reactionCollector) => {
                        msg.delete();
                    });
                });
            });
    },
};
