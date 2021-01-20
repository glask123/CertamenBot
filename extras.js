const Discord = require('discord.js');

module.exports = {
    legioAeternaVictrix: function(msg, content, channel) {
        if (msg.content.includes ("AETERNA") && !msg.author.bot){
            channel.send("AAAAAAAAAAAAAAAAH");
        }
    
        if (content.includes("aeterna") && !msg.content.includes("AETERNA")){
            channel.send("VICTRIX");
        }
    
        if (content.includes("legio")){
            channel.send("AETERNA");
        }
    },

    daVinky: function(msg, content, channel){
        if (content.includes("mona lisa")){
            channel.send({ files: ["./assets/daVinky.mp4"] });
        }

    },
  
  };