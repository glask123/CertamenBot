const Discord = require('discord.js');
//const ffmpeg = require('@ffmpeg-installer/ffmpeg');

// ---- MODULE EXPORTS ----

const scoreJS = require('./score.js');
const buzzJS = require('./buzz.js');
const modsJS = require('./mods.js');
const muteJS = require('./mute.js');
const extrasJS = require('./extras.js');

const client = new Discord.Client();

const token = 'NzMyODc5NDY1NjYyNzc1MzI2.Xw7BMA.yPItlNB-0RyaIKBfTuPglyGXHyE';

//swag channelID = 727085410072658031
//certamenBot channelID = 750892623631351919
client.on('ready', () => {
    client.channels.cache.get('727085410072658031').send("CertamenBot is online.");
    client.user.setActivity('certamen | !help & !about');
});

client.on('guildCreate', async guild => {
    let channel = guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
    const joinEmbed = new Discord.MessageEmbed()
        .setTitle('CertamenBot is here!')
        .setDescription("Thank you for choosing CertamenBot by `glask123#5514`. In order to view all of CertamenBot's functions, use the command `!help`, which will lead you to even more advanced commands. To learn more about the bot, send `!about` into the channel. It is recommended that at least one person per server joins the CertamenBot support server at https://discord.gg/gq3vwGh for updates as well as support.")
        .setColor('#4C047C')
        .setFooter('If you accidentally added CertamenBot to your server, delete this message and remove CertamenBot from the server by reacting to this message with ❌.')

    var joinAsyncEmbed = await channel.send(joinEmbed);

    joinAsyncEmbed.react('❌');

    const filter = (reaction) => {
        return reaction.emoji.name === '❌';
    };

    const collector = joinAsyncEmbed.createReactionCollector(filter, { time: 15000 });

    collector.on('collect', (reaction) => {
        joinAsyncEmbed.delete();
        const leaveEmbed = new Discord.MessageEmbed()
            .setTitle('CertamenBot has left the server.')
            .setColor('#FF0000')

        channel.send(leaveEmbed);
        guild.leave();
        
    });

});

var startBoolean = {};
var roleBoolean = {};
var modBoolean = {};
var muteBoolean = {};
var voiceBoolean = {};
var displayNameList = {};
var roleList = {};
var channelTeams = {};
var channelScores = {};
var modList = {};
var numMessages = {};

var connection = 0;

client.on('message', async msg => {
    const content = msg.content.toLowerCase();
    const channelID = msg.channel.id;
    const channel = msg.channel;
    const displayName = msg.member.displayName;
    const highestRole = msg.member.roles.highest.name;

    if (startBoolean[channelID] == undefined){
        startBoolean[channelID] = false;
        roleBoolean[channelID] = false;
        modBoolean[channelID] = false;
        muteBoolean[channelID] = false;
        voiceBoolean[channelID] = false;
        modList[channelID] = [];
        channelTeams[channelID] = [];
        channelScores[channelID] = [];
        displayNameList[channelID] = [];
    }

    const filter = (reaction, user) => {
        return ['❌', '✔️'].includes(reaction.emoji.name) && user.id === msg.author.id;
    };

    switch (content){
        case "!about":
            const aboutEmbed = new Discord.MessageEmbed()
                .setTitle('Certamenbot v3.0.0')
                .setColor('#4C047C')
                .addFields(
                    {name: "About", value: "CertamenBot was developed by Graydon Schulze-Kalt with the help of Kabir Ramzan."},
                    {name: "Help", value: "Join the CertamenBot server at https://discord.gg/PXwXumQ"},
                )
            
            channel.send(aboutEmbed);
            break;
        case "!changelog":
            break;
        case "!serverlist":
            break;
        case "!update":
            break;
        case "!help":
            const helpEmbed = new Discord.MessageEmbed()
                .setTitle('CertamenBot Help Commands')
                .setColor('#4C047C')
            
            channel.send(helpEmbed);
            break;
        case "!advanced":
            const advancedEmbed = new Discord.MessageEmbed()
                .setTitle('Advanced CertamenBot Commands')
                .setColor('#4C047C')

            channel.send(advancedEmbed);
            break;
        case "!aurelia":
            const aureliaEmbed = new Discord.MessageEmbed()
                .setColor('#4C047C')
                .setDescription('Aurēlia, cui urbs placēbat, erat in Aegyptō cum familiā suā ingentī et equō suō. Tredecim lūdōs magnōs Iovis in Amphitheātrō Alexandrīae spectābant. Tandem, hic equus īrātus domum recurrere coepit. Ēheu!')
            
            channel.send(aureliaEmbed);
            break;
        case "!roundsettings": 
            msg.delete();
            const roundSettingsEmbed = new Discord.MessageEmbed()
                .setColor('#4C047C')
                .setTitle('Round Start/End  [' + channel.name + "] ")
                .setDescription('React to this message with ✔️ or ❌ to change the buzz settings for the channel. Choosing ✔️ will turn the channel on, allowing for buzzes and score modifications. Choosing ❌ will terminate all settings for this channel, in addition to *clearing score* as well as *removing all teams*. Only react with this if you mean to, as this action cannot be undone.')
                .setFooter('Choosing one or the other when that setting is already in effect will not change anything in the channel.')

            var roundEdit = await channel.send(roundSettingsEmbed);
            roundEdit.react('✔️');
            roundEdit.react('❌');
        
            const roundCollector = roundEdit.createReactionCollector(filter, { time: 15000 });
        
            roundCollector.on('collect', (reaction, user) => {
                roundEdit.delete();
                
                if (reaction.emoji.name === '❌'){
                    startBoolean[channelID] = false;
                    const falseEmbed = new Discord.MessageEmbed()
                        .setColor("#FF0000")
                        .setDescription('CertamenBot is no longer active in this channel, and buzzes will not be handled.')
                    channel.send(falseEmbed);
                } else {
                    startBoolean[channelID] = true;
                    const trueEmbed = new Discord.MessageEmbed()
                        .setColor("#00FF00")
                        .setDescription('CertamenBot is now active in this channel, and will accept buzzes.')
                    channel.send(trueEmbed);
                }
        
            });

            break;
        case "!rolesettings":
            msg.delete();
            const roleSettingsEmbed = new Discord.MessageEmbed()
                .setColor('#4C047C')
                .setTitle('Round Start/End  [' + channel.name + "] ")
                .setDescription('React to this message with ✔️ or ❌ to change the role settings for the channel. Choosing ✔️ means that each team has a *unique* role that is *different* from the other roles, allowing for CertamenBot to prevent double buzzes from each team. Choosing ❌ will turn this function off, and it will essentially take everyone as being on their own team.')
                .setFooter('The unique role must be the highest on the role list for each person on the team.')

            var roleEdit = await channel.send(roleSettingsEmbed);
            roleEdit.react('✔️');
            roleEdit.react('❌');
        
            const roleCollector = roleEdit.createReactionCollector(filter, { time: 15000 });
        
            roleCollector.on('collect', (reaction, user) => {
                roleEdit.delete();
                
                if (reaction.emoji.name === '❌'){
                    roleBoolean[channelID] = false;
                    const falseEmbed = new Discord.MessageEmbed()
                        .setColor("#FF0000")
                        .setDescription('CertamenBot will no longer differentiate between teams.')
                    channel.send(falseEmbed);
                } else {
                    roleBoolean[channelID] = true;
                    const trueEmbed = new Discord.MessageEmbed()
                        .setColor("#00FF00")
                        .setDescription('Each team is now recognized, and CertamenBot will only show the first buzz for each team.')
                    channel.send(trueEmbed);
                }
        
            });
            //roleBoolean[channelID] = true;
            break;
        case "!teamsettings":
            const teamSettingsEmbed = new Discord.MessageEmbed()
                .setColor('#4C047C')
                .setTitle('')
                .setDescription('')
                .setFooter('')
            break;
        case "!audiosettings":
            const audioSettingsEmbed = new Discord.MessageEmbed()
                .setColor('#4C047C')
                .setTitle('')
                .setDescription('')
                .setFooter('')
            break;
        case "!modsettings":
            const modSettingsEmbed = new Discord.MessageEmbed()
                .setColor('#4C047C')
                .setTitle('')
                .setDescription('')
                .setFooter('')
            break;
        case "b":
        case "buzzz":
        case "zubb":
        case "buz":
        case "bazinga":
        case "buzz":
            buzzJS.newBuzz(startBoolean[channelID], roleBoolean[channelID], muteBoolean[channelID], voiceBoolean[channelID], displayName, msg, channelID, channel, highestRole);
            break;
        default:
            extrasJS.daVinky(msg, content, channel);
            extrasJS.legioAeternaVictrix(msg, content, channel);
    }

    if (content.includes("clear") && !msg.author.bot){
        buzzJS.clear(channelID, channel, msg);
    }

});

client.login(token);