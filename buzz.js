const Discord = require('discord.js');
const mute = require('./mute.js');

var displayNameList = {};
var roleList = {};
var numMessages = {};

var editBuzzEmbed;

module.exports = {

    newBuzz: async function(startBoolean, roleBoolean, muteBoolean, voiceBoolean, displayName, msg, channelID, channel, highestRole) {
        
        const buzzEmbed = new Discord.MessageEmbed()
            .setColor('#4C047C')
        
        if (displayNameList[channelID] == undefined){
            displayNameList[channelID] = [];
            roleList[channelID] = [];
        }

        if  (startBoolean == true){
            msg.delete();
            if (roleBoolean == true){
                if (displayNameList[channelID].length == 0 || displayNameList[channelID] == undefined){
                    displayNameList[channelID][0] = displayName;
                    roleList[channelID][0] = highestRole;
                    if (highestRole == channel.guild.roles.everyone){
                        buzzEmbed.addField("1", displayName);
                        editBuzzEmbed = await channel.send(buzzEmbed);
                    } else {
                        buzzEmbed.addField("1", displayName + " [" + highestRole + "]");
                        editBuzzEmbed = await channel.send(buzzEmbed);
                    }
                    //VOICE
                    //MUTE
                    //UNMUTE
                    numMessages[channelID] = 1;
                } else if (!displayNameList[channelID].includes(displayName) && !roleList[channelID].includes(highestRole)){
                    numMessages[channelID]++;
                    displayNameList[channelID].push(displayName);
                    roleList[channelID].push(highestRole);
                    if (highestRole == channel.guild.roles.everyone){
                        displayNameList[channelID].forEach(name => {
                            buzzEmbed.addField(displayNameList[channelID].indexOf(name) + 1, name);
                        });
                        buzzEmbed.addField(numMessages[channelID], displayName);
                        editBuzzEmbed.edit(buzzEmbed);
                    } else {
                        displayNameList[channelID].forEach(name => {
                            var index = displayNameList[channelID].indexOf(name)
                            buzzEmbed.addField(index + 1, name + " [" + roleList[channelID][index] + "]");
                        });
                        editBuzzEmbed.edit(buzzEmbed);
                    }
                    
                }
                
            } else {
                
            }
        }
    },

    clear: function(channelID, channel, msg){
        displayNameList[channelID] = [];
        numMessages[channelID] = 0;
        roleList[channelID] = 0;
        msg.delete();
        channel.send("CLEAR");
    }
  
  };