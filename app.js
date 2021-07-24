require("dotenv").config();
const Discord = require("discord.js");
//const ffmpeg = require("@ffmpeg-installer/ffmpeg");
const fs = require("fs");
const client = new Discord.Client();

const token = process.env.TOKEN;

client.on("ready", () => {
  client.channels.cache
    .get("727085410072658031")
    .send("CertamenBot is online.");
  client.user.setActivity("certamen | !help & !about");
});

var nicknames = {};
var initialized = {};
var roles = {};
var connection = 0;
var voice = {};
var teams = {};
var scores = {};
var rolesinit = {};
var mods = {};
var modslist = {};
var mutechannel = {};
var nummessages = {};

client.on("message", async (msg) => {
  var content = msg.content.toLowerCase();
  var channelid = msg.channel.id;
  var channel = msg.channel;
  var nickname = msg.member.displayName;
  var role = msg.member.roles.highest.name;

  if (initialized[channelid] == undefined) {
    initialized[channelid] = "off";
  }

  if (modslist[channelid] == undefined) {
    modslist[channelid] = [];
  }

  if (mods[channelid] == undefined) {
    mods[channelid] = "off";
  }

  if (voice[channelid] == undefined) {
    voice[channelid] = "off";
  }

  if (rolesinit[channelid] == undefined) {
    rolesinit[channelid] = "off";
  }

  if (mutechannel[channelid] == undefined) {
    mutechannel[channelid] = "off";
  }

  if (teams[channelid] == undefined) {
    teams[channelid] = [];
  }

  if (scores[channelid] == undefined) {
    scores[channelid] = [];
  }

  switch (content) {
    case "-submitscores":
      const submit = new Discord.MessageEmbed()
        .setTitle("Submitting scores to the database...")
        .setColor("#4C047C");

      submitembed();

      var submitMessage;

      async function submitembed() {
        submitMessage = await msg.channel.send(submit);
      }

      setTimeout(submitDelete, 4000);

      teams[channelid].forEach((team) => {
        var index = teams[channelid].indexOf(team);
        channel.send(
          "-scorelogcertamenbot " + team + " " + scores[channelid][index]
        );
      });

      async function submitDelete() {
        submitMessage.delete();
        var submitted = await channel.send("-submitted");
        submitted.delete();
      }

      break;
    case "!serverlist":
      const serverembed1 = new Discord.MessageEmbed()
        .setTitle("Server List")
        .setDescription(
          "CertamenBot is currently in " +
            client.guilds.cache.size +
            " servers."
        )
        .setColor("#4C047C");

      const serverembed2 = new Discord.MessageEmbed().setColor("#4C047C");

      let servercount = 0;

      client.guilds.cache.forEach(async (guild) => {
        var month = parseInt(guild.joinedAt.getMonth(), 10) + 1;
        servercount++;
        let owner = client.users.cache.get(guild.ownerID);
        if (servercount <= 25) {
          serverembed1.addField(
            guild.name,
            "Members: " +
              guild.memberCount +
              " | Owner: " +
              owner.tag.substring(0, owner.tag.length - 5) +
              " | Joined: " +
              month +
              "." +
              guild.joinedAt.getDate() +
              "." +
              guild.joinedAt.getFullYear()
          );
        } else {
          serverembed2.addField(
            guild.name,
            "Members: " +
              guild.memberCount +
              " | Owner: " +
              guild.ownerID +
              " | Joined: " +
              month +
              "." +
              guild.joinedAt.getDate() +
              "." +
              guild.joinedAt.getFullYear()
          );
        }
      });

      channel.send(serverembed1);
      if (servercount > 25) channel.send(serverembed2);
      break;
    case "!update":
      if (msg.author.id == "491424892890120204") {
        client.guilds.cache.forEach((guild) => {
          let channel = guild.channels.cache
            .filter((chx) => chx.type === "text")
            .find((x) => x.position === 0);
          const newUpdate = new Discord.MessageEmbed()
            .setTitle("CertamenBot has just been updated [v2.8.0]")
            .setDescription(
              "This is an automated message sent upon CertamenBot being updated, and should only be sent once per server. If there is an error, or you would like updates to be posted in a different channel, join the discord at https://discord.gg/PXwXumQ. It is recommended that at least the admin of this server joins the CertamenBot server in order to get more in-depth updates."
            )
            .setColor("#4C047C")
            .setFooter(
              "Feel free to delete this message if it is in an unconvenient place."
            );
          channel.send(newUpdate);
        });
      }
      break;
    case "!info":
      const info = new Discord.MessageEmbed()
        .setTitle("Certamenbot v2.9.0")
        .setColor("#4C047C")
        .setDescription(
          "– Removed changelog section and added log to `!info` \n– Added more buzz variations:\n\t*·buzzah\n\t·bvzz\n\t·pnzz\n\t·zznq*\n– Added to help card:\n\t*·buzzah\n\t·bvzz\n\t·pnzz\n\t·zznq\n\t·buźz\n\t·bazinga*\n– Added validation to score system, which previously would display NaN if a value other than a number was inputted\n– Added a `!clearscores` command and updated `!help`\n– Fixed issue in serverlist command where server owners would be displayed incorrectly"
        )
        .addFields(
          {
            name: "About",
            value:
              "CertamenBot is developed by Graydon Schulze-Kalt with the help of Kabir Ramzan.",
          },
          {
            name: "Help",
            value:
              "Join the CertamenBot server at https://discord.gg/PXwXumQ, and visit the website at https://certamenbot.graydon.sk",
          }
        );
      channel.send(info);
      break;
    case "!help":
      const help = new Discord.MessageEmbed()
        .setTitle("Basic Commands")
        .setColor("#4C047C")
        .setDescription(
          "The following commands can be used to access all of CertamenBot's features. All are channel-specific unless otherwise noted."
        )
        .addFields(
          {
            name: "!start",
            value:
              "Allows CertamenBot to accept buzzes in the channel, and will allow you to make teams and keep score. *NOTE: Do not use when the bot is already active in the channel, as this will reset the score.",
          },
          {
            name: "!end",
            value:
              "CertamenBot will no longer accept buzzes in the channel, and will clear all teams and scores.",
          },
          {
            name: "!join",
            value:
              "CertamenBot will join the active voice channel. The '!start' command must still be used to allow buzz tracking.",
          },
          {
            name: "!leave",
            value:
              "Disconnects CertamenBot from the voice channel. The '!end' command is still required to end buzzing",
          },
          {
            name: "buzz, b, zubb, buz, buzzz, zub, bazinga, buźz, buzzah, bvzz, pnzz, zznq (along with capital variations)",
            value:
              "Will create a list of the names of the people who buzzed in order once the round is started in the channel.",
          },
          {
            name: "clear",
            value:
              "Clears the buzzers for the channel once the round has started. Works with ANY message containing 'clear' or any capital variations.",
          },
          {
            name: "!advanced",
            value: "View the advanced capabilities of CertamenBot.",
          },
          {
            name: "!changelog",
            value: "View the latest updates and bug fixes made to CertamenBot.",
          },
          {
            name: "!aurelia",
            value: "Sends the Aurelia passage to the channel.",
          }
        );
      channel.send(help);
      break;
    case "!advanced":
      const advanced = new Discord.MessageEmbed()
        .setTitle("Advanced Commands")
        .setColor("#4C047C")
        .setDescription(
          "The following commands can be used to access all of CertamenBot's features. All are channel-specific unless otherwise noted."
        )
        .addFields(
          {
            name: "!roles {on/off}",
            value:
              "Choose 'on' if you have a unique role for each team, and 'off' if you don't. If 'on', CertamenBot will ignore duplicate buzzes from the same team.",
          },
          {
            name: "!mods {on/off}",
            value:
              "Choose 'yes' if you would like to assign mods to the channel. Otherwise, everyone will be able to access the score at all times. Choosing 'no' will also clear the current mods.",
          },
          {
            name: "!mute {on/off}",
            value:
              "Turns on and off the ability for CertamenBot to server mute all people in the voice channel when someone buzzes.",
          },
          {
            name: "!modlist {@username} {add/remove}",
            value:
              "Assigns the mentioned person to become the moderator in the channel. If this person is already a mod, you can remove them as well.",
          },
          {
            name: "!team {name} {add/remove}",
            value:
              "Allows you to make teams that will be used to keep track of score.",
          },
          {
            name: "!clearteams",
            value:
              "Clears the current teams, allowing you to reset them individually with '!team'.",
          },
          {
            name: "!score / !scores",
            value:
              "Lists each team with their respective scores. If the moderator function is turned on, only the mod can access this command.",
          },
          {
            name: "!clearscores",
            value: "Resets scores for all teams in the channel.",
          }
        );
      channel.send(advanced);
      break;
    case "!aurelia":
      msg.delete();
      channel.send(
        "Aurēlia, cui urbs placēbat, erat in Aegyptō cum familiā suā ingentī et equō suō. Tredecim lūdōs magnōs Iovis in Amphitheātrō Alexandrīae spectābant. Tandem, hic equus īrātus domum recurrere coepit. Ēheu!"
      );
      break;
    case "!join":
      if (msg.member.voice.channel && connection == 0) {
        connection = await msg.member.voice.channel.join();

        msg.reply("CertamenBot is now in your voice channel.");
        voice[channelid] = "on";
      } else {
        if (msg.member.voicechannel) {
          msg.reply(
            "CertamenBot is already in a voice channel. If you would like to play with only text, type '!start'"
          );
        } else if (connection == 0) {
          msg.reply(
            "You are not in a voice channel, but CertamenBot is available. Please join a voice channel and retype '!startaudio'."
          );
        } else {
          msg.reply(
            "CertamenBot is not available to be in the voice channel right now. If you have any questions, contact the administrator of the tournament."
          );
        }
      }
      break;
    case "!start":
      initialized[channelid] = "on";
      nicknames[channelid] = [];
      roles[channelid] = [];
      nummessages[channelid] = 0;
      msg.reply(
        "CertamenBot is now ready to start the round. You may begin buzzing at any time. To view the settings for the channel, use '!settings'."
      );
      break;
    case "!settings":
      const settings = new Discord.MessageEmbed()
        .setTitle("**" + msg.channel.name.toUpperCase() + " — SETTINGS**")
        .setDescription(
          "Current settings for this channel. If you need to change a setting, visit '!advanced' to learn more."
        )
        .setColor("#4C047C")
        .addFields(
          {
            name: "Mods [!mods {on/off}]",
            value: mods[channelid].toUpperCase(),
          },
          {
            name: "Roles [!roles {on/off}]",
            value: rolesinit[channelid].toUpperCase(),
          },
          {
            name: "Buzzer Sound [!join/!leave]",
            value: voice[channelid].toUpperCase(),
          },
          {
            name: "Channel Mute [!mute {on/off}]",
            value: mutechannel[channelid].toUpperCase(),
          },
          {
            name: "Round Started [!start/!end]",
            value: initialized[channelid].toUpperCase(),
          }
        );
      channel.send(settings);
      break;
    case "!clearteams":
      teams[channelid] = [];
      scores[channelid] = [];
      msg.reply(
        "The teams have been reset. Please use '!maketeams' to create the new teams list."
      );
      break;
    case "!clearscore":
    case "!clearscores":
      if (initialized[channelid] == "on") {
        if (mods[channelid] == "on") {
          if (modslist[channelid].includes(nickname)) {
            setAll(scores[channelid], 0);
          } else {
            msg.reply("you do not have permission to modify the score.");
          }
        } else {
          setAll(scores[channelid], 0);
        }
      }
    case "!score":
    case "!scores":
      if (initialized[channelid] == "on") {
        msg.delete();
        const score = new Discord.MessageEmbed()
          .setTitle("**" + msg.channel.name.toUpperCase() + " — SCORE CHECK**")
          .setColor("#4C047C")
          .addFields();

        if (teams[channelid].length != 0) {
          teams[channelid].forEach((team) => {
            var index = teams[channelid].indexOf(team);
            score.addField(teams[channelid][index], scores[channelid][index]);
          });
        } else {
          score.setDescription("There are no teams set for this channel.");
        }

        if (mods[channelid] == "on") {
          if (modslist[channelid].includes(nickname)) {
            channel.send(score);
          } else {
            msg.reply("You do not have permission to access the score.");
          }
        } else {
          channel.send(score);
        }
      } else {
        msg.reply(
          "Either you have not assigned teams for this channel, or the round has not begun. To start the round, use '!start'."
        );
      }
      break;
    case "!end":
      msg.reply(
        "CertamenBot is no longer accepting buzzes in this channel. If you are having trouble, contact the administrator of the tournament."
      );
      initialized[channelid] = "off";
      nicknames[channelid] = [];
      roles[channelid] = [];
      teams[channelid] = [];
      rolesinit[channelid] = "off";
      mutechannel[channelid] = "off";
      mods[channelid] = "off";
      scores[channelid] = [];
      break;
    case "!leave":
      msg.reply("CertamenBot has disconnected from the voice channel.");
      voice[channelid] = "off";
      if (connection != 0) {
        connection.disconnect();
        connection = 0;
      }
      break;
    case "!unmute":
      msg.member.voice.setMute(false);
      break;

    case "b":
    case "buzzz":
    case "zubb":
    case "buz":
    case "zub":
    case "bazinga":
    case "buźz":
    case "buzz":
    case "buzzah":
    case "bvzz":
    case "pnzz":
    case "zznq":
      if (initialized[channelid] == "on" && rolesinit[channelid] == "on") {
        if (nicknames[channelid].length == 0) {
          nicknames[channelid].push(nickname);
          roles[channelid].push(role);
          channel.send("**BUZZ ORDER:**");
          if (role == channel.guild.roles.everyone.name) {
            channel.send("1 — " + nickname);
          } else {
            channel.send("1 — " + nickname + " [" + role + "]");
          }
          if (voice[channelid] == "on") {
            const dispatcher = connection.play(
              fs.createReadStream("buzz2.webm"),
              { type: "webm/opus" }
            );
          }
          mute();
          setTimeout(unmute, 2000);
          nummessages[channelid]++;
        } else if (
          !nicknames[channelid].includes(nickname) &&
          !roles[channelid].includes(role)
        ) {
          nummessages[channelid]++;
          nicknames[channelid].push(nickname);
          roles[channelid].push(role);
          if (role == channel.guild.roles.everyone.name) {
            channel.send(nummessages[channelid] + " — " + nickname);
          } else {
            channel.send(
              nummessages[channelid] + " — " + nickname + " [" + role + "]"
            );
          }
          if (voice[channelid] == "on") {
            const dispatcher = connection.play(
              fs.createReadStream("buzz2.webm"),
              { type: "webm/opus" }
            );
          }
        }
        msg.delete();
      }

      if (initialized[channelid] == "on" && rolesinit[channelid] == "off") {
        if (nicknames[channelid].length == 0) {
          nicknames[channelid].push(nickname);
          channel.send("**BUZZ ORDER:**");
          channel.send("1 — " + nickname);
          if (voice[channelid] == "on") {
            const dispatcher = connection.play(
              fs.createReadStream("buzz2.webm"),
              { type: "webm/opus" }
            );
          }
          nummessages[channelid]++;
          mute();
          setTimeout(unmute, 2000);
        } else if (!nicknames[channelid].includes(nickname)) {
          nicknames[channelid].push(nickname);
          nummessages[channelid]++;
          channel.send(nummessages[channelid] + " — " + nickname);
          if (voice[channelid] == "on") {
            const dispatcher = connection.play(
              fs.createReadStream("buzz2.webm"),
              { type: "webm/opus" }
            );
          }
        }
        msg.delete();
      }
      break;
    default:
      if (content.includes("!modlist") && !msg.author.bot) {
        if (content.includes("remove")) {
          var prefix = "!modlist <@!";
          var suffix = ">  remove";
          var remove = msg.content.slice(prefix.length, -1 * suffix.length);
          if (modslist[channelid].includes(remove)) {
            var index = modslist[channelid].indexOf(remove);
            modslist[channelid].splice(index, 1);
            channel.send(
              msg.mentions.users.first().username + " is no longer a moderator."
            );
          } else {
            channel.send(
              msg.mentions.users.first().username +
                " is not a mod so you cannot remove them from this position."
            );
          }
        } else if (content.includes("add")) {
          var prefix = "!modlist <@!";
          var suffix = ">  add";
          var add = msg.content.slice(prefix.length, -1 * suffix.length);
          if (!modslist[channelid].includes(add)) {
            modslist[channelid].push(add);
            channel.send(
              msg.mentions.users.first().username + " is now a moderator."
            );
          } else {
            channel.send(
              msg.mentions.users.first().username +
                " is already a moderator for this channel."
            );
          }
        }
      }
      if (content.includes("!mods") && !msg.author.bot) {
        var prefix = "!mods ";
        var actualmessage = content.slice(prefix.length);
        if (actualmessage == "on") {
          mods[channelid] = "on";
          msg.reply(
            "only the moderators will be able to access and modify the score now. To add or remove a mod, use '!modlist {username} {add/remove}'."
          );
        } else if (actualmessage == "off") {
          mods[channelid] = "off";
          msg.reply(
            "everyone in the channel is now able to access and modify the score."
          );
        } else {
          msg.reply(
            "you didn't select a proper option. The options for '!mods' are {on} and {off}."
          );
        }
      }
      if (content.includes("!mute") && !msg.author.bot) {
        var prefix = "!mute ";
        var actualmessage = content.slice(prefix.length);
        if (actualmessage == "on") {
          mutechannel[channelid] = "on";
          msg.reply(
            "CertamenBot will now mute the active members in the voice channel during buzzes."
          );
        } else if (actualmessage == "off") {
          mutechannel[channelid] = "off";
          msg.reply("CertamenBot will not mute the voice channels.");
        } else {
          msg.reply(
            "you didn't select a proper option. The options for '!mute' are {on} and {off}."
          );
        }
      }
      if (content.includes("!roles") && !msg.author.bot) {
        var prefix = "!roles ";
        var actualmessage = content.slice(prefix.length);
        if (actualmessage == "on") {
          rolesinit[channelid] = "on";
          msg.reply(
            "you have now chosen for this channel to function with roles. To change this, use '!roles off'."
          );
        } else if (actualmessage == "off") {
          rolesinit[channelid] = "off";
          msg.reply(
            "this channel will now function without roles. To re-enable roles, type '!roles on'."
          );
        } else {
          msg.reply(
            "you didn't select a proper option. The options for '!roles' are {on} and {off}."
          );
        }
      }
      if (content.includes("clear") && !msg.author.bot) {
        if (initialized[channelid] == "on") {
          nicknames[channelid] = [];
          roles[channelid] = [];
          nummessages[channelid] = 0;
          msg.delete();
          channel.send(":herb: :amphora: — ***CLEAR*** — :amphora: :herb:");
        }
      } else {
      }
      if (content.includes("!add") && !msg.author.bot) {
        if (initialized[channelid] == "on") {
          if (mods[channelid] == "on") {
            if (modslist[channelid].includes(nickname)) {
              score("!add ", "add");
            } else {
              msg.reply("you do not have permission to modify the score.");
            }
          } else {
            score("!add ", "add");
          }
        }
      }
      if (content.includes("!subtract") && !msg.author.bot) {
        if (initialized[channelid] == "on") {
          if (mods[channelid] == "on") {
            if (modslist[channelid].includes(nickname)) {
              score("!subtract ", "subtract");
            } else {
              msg.reply("you do not have permission to modify the score.");
            }
          } else {
            score("!subtract ", "subtract");
          }
        }
      }
      if (msg.content.includes("!team") && !msg.author.bot) {
        var prefix = "!team ";
        if (content.includes(" add")) {
          var suffix = " add";
          var team = msg.content.slice(prefix.length);
          team = team.slice(0, -1 * suffix.length);
          if (!teams[channelid].includes(team)) {
            teams[channelid].push(team);
            scores[channelid].push(0);
            channel.send("*" + team + " has been added to the field.*");
          }
        } else if (content.includes(" remove")) {
          var suffix = " remove";
          var team = msg.content.slice(prefix.length);
          team = team.slice(0, -1 * suffix.length);
          if (teams[channelid].includes(team)) {
            var index = teams[channelid].indexOf(team);
            teams[channelid].splice(index, 1);
            scores[channelid].splice(index, 1);
            channel.send("*" + team + " has been removed from the field.*");
          }
        }
        msg.delete();
      }
      break;
  }

  function mute() {
    if (mutechannel[channelid] == "on") {
      if (msg.member.voice.channel) {
        let channel = msg.guild.channels.cache.get(msg.member.voice.channel.id);
        for (const [memberID, member] of channel.members) {
          if (member.id != client.user.id) {
            if (
              (mods[channelid] =
                "on" && modslist[channelid].includes(member.id))
            ) {
              member.voice.setMute(true);
            }
          }
        }
      }
    }
  }
  function unmute() {
    if (mutechannel[channelid] == "on") {
      if (msg.member.voice.channel) {
        let channel = msg.guild.channels.cache.get(msg.member.voice.channel.id);
        for (const [memberID, member] of channel.members) {
          if (member.id != client.user.id) {
            member.voice.setMute(false);
          }
        }
      }
    }
  }

  function score(prefix, type) {
    let value = msg.content.slice(prefix.length);
    teams[channelid].forEach((team) => {
      if (value.includes(team)) {
        var index = teams[channelid].indexOf(team);
        var teamlength = team + " ";
        let number = value.slice(teamlength.length);
        if (!isNaN(parseInt(number, 10))) {
          if (type == "add") {
            scores[channelid][index] += parseInt(number, 10);
            channel.send(
              "*" + parseInt(number, 10) + " points to " + team + ".*"
            );
          } else {
            scores[channelid][index] -= parseInt(number, 10);
            channel.send(
              "*" + parseInt(number, 10) + " points from " + team + ".*"
            );
          }
        } else {
          msg.reply("Your inputted value is not a number. Please try again.");
        }
      }
    });
    msg.delete();
  }

  function setAll(a, v) {
    var i,
      n = a.length;
    for (i = 0; i < n; ++i) {
      a[i] = v;
    }
  }
});

client.login(token);
