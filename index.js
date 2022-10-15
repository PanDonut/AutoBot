global.vote = {}
const Discord = require('discord.js');
const fs = require('node:fs');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { compare } = require('image-ssim');
const Pixelmatch = require('pixelmatch');
const XMLHttpRequest = require('xhr2');
const https = require("https");
const Rembrandt = require("rembrandt");
const client = new Discord.Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates] });
const { RegisterCommands, UnRegisterCommands } = require('./command');
const youtube = require('random-youtube-video-by-keyword');
const { SetVote, GetVote, AddVote, GetVoteD, GetClicked, AddClicked, SetClient, GetGlobal, Player, SetGlobal } = require('./commands');
const axios = require('axios');

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

axios.get("https://raw.githubusercontent.com/PanDonut/duckmusic/beta/src/data/songs.json").then(res => {
  SetGlobal("songs", res.data)
})
axios.get("https://raw.githubusercontent.com/PanDonut/duckmusic/beta/src/data/index.json").then(res => {
  SetGlobal("playlists", res.data)
})

client.on('ready', () => {
  SetClient(client)
  console.log(`Logged in as ${client.user.tag}!`);
  // client.user.setPresence({
  //   activities: [{ 
  //     name: "głupie małpy",
  //     type: "WATCHING"
  //   }],
  //   status: "online"
  // })
  client.user.setPresence({ activities: [{ name: 'głupie małpy', type: 3 }], status: "dnd" })
  RegisterCommands(client)
});

client.on("guildMemberAdd", member => {
  member.guild.channels.cache.get("1030211239550390496").send(member.id == "726874644916731947" ? "Cześć Piotruś, małpo" : `Cześć ${member.displayName}, ty małpo jedna`); 
});

client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
	console.log(interaction);
  if (interaction.customId == "vote_op_1" && !GetClicked(interaction.message.interaction.id).includes(interaction.user.id)) {
    AddVote(interaction.message.interaction.id, [GetVote()[interaction.message.interaction.id][0] + 1, GetVote()[interaction.message.interaction.id][1]])
  } else if (interaction.customId == "vote_op_2" && !GetClicked(interaction.message.interaction.id).includes(interaction.user.id)) {
    AddVote(interaction.message.interaction.id, [GetVote()[interaction.message.interaction.id][0], GetVote()[interaction.message.interaction.id][1] + 1])
  }
  if ((interaction.customId == "vote_op_1" || interaction.customId == "vote_op_2") && !GetClicked(interaction.message.interaction.id).includes(interaction.user.id)) {
    const row = new Discord.ActionRowBuilder()
			.addComponents(
				new Discord.ButtonBuilder()
					.setCustomId('vote_op_1')
					.setLabel(GetVoteD()[interaction.message.interaction.id][1])
					.setStyle(Discord.ButtonStyle.Success),
				new Discord.ButtonBuilder()
					.setCustomId('vote_op_2')
					.setLabel(GetVoteD()[interaction.message.interaction.id][2])
					.setStyle(Discord.ButtonStyle.Danger),
			);
      AddClicked(interaction.message.interaction.id, interaction.user.id)
      interaction.update({ content: `${GetVoteD()[interaction.message.interaction.id][3] ? `||${GetVoteD()[interaction.message.interaction.id][3]}|| \n` : ""} \n **${GetVoteD()[interaction.message.interaction.id][0]}** \n \n ${GetVoteD()[interaction.message.interaction.id][1]} - ${GetVote()[interaction.message.interaction.id] ? GetVote()[interaction.message.interaction.id][0] : 0} \n ${GetVoteD()[interaction.message.interaction.id][2]} - ${GetVote()[interaction.message.interaction.id] ? GetVote()[interaction.message.interaction.id][1] : 0} \n Kończy się za ${Date.now() - (GetVoteD()[interaction.message.interaction.id][5] + GetVoteD()[interaction.message.interaction.id][4]) < 60000 ? Math.abs(Math.round((Date.now() - (GetVoteD()[interaction.message.interaction.id][5] + GetVoteD()[interaction.message.interaction.id][4])) / 1000)) + "s" : (Date.now() - (GetVoteD()[interaction.message.interaction.id][5] + GetVoteD()[interaction.message.interaction.id][4])) / 60000 + "min"}`, components: [row] });
  }

  if (interaction.customId == "player_pause") {
    GetGlobal().player.pause();
    interaction.update(Player())
  }
  if (interaction.customId == "player_play") {
    GetGlobal().player.unpause();
    interaction.update(Player())
  }
  if (interaction.customId == "player_next") {
    if (GetGlobal()["queue"].length - 1 >= GetGlobal()["queue"].indexOf(GetGlobal()["track"]) + 1) {
      SetGlobal("track", GetGlobal()["queue"][GetGlobal()["queue"].indexOf(GetGlobal()["track"]) + 1])
      const res = createAudioResource(GetGlobal().track.link, {
        inlineVolume: true,
      })	
      GetGlobal().player.play(res);
      // GetGlobal().player.unpause();
      interaction.update(Player())
    }
  }
});

// client.ws.on('INTERACTION_CREATE', async interaction => {
//   switch (interaction.commandName) {
//     case "monke":
//       youtube.getRandomVid("AIzaSyAOiPxJ8U77X51y2xqFdEgnLAo4T-QC-bU", "funny monkey", (err, data) => {
//         client.api.interactions(interaction.id, interaction.process.env.TOKEN).callback.post({data: {
//           type: 4,
//           data: {
//             content: `https://www.youtube.com/watch?v=${data.id.videoId}`
//           }
//         }})
//       })
//       break;

//     case "refresh_commands":
//       if (interaction.member.roles.includes('1030191979935580310')) {
//         client.api.interactions(interaction.id, interaction.process.env.TOKEN).callback.post({data: {
//           type: 4,
//           data: {
//             content: "Refreshing"
//           }
//         }})
//         UnRegisterCommands(client)
//       }
//       break;
//     case "refresh_commands":
//       if (interaction.member.roles.includes('1030191979935580310')) {
//         client.api.interactions(interaction.id, interaction.process.env.TOKEN).callback.post({data: {
//           type: 4,
//           data: {
//             content: "Refreshing"
//           }
//         }})
//         UnRegisterCommands(client)
//       }
//       break;
  
//     default:
//       client.channels.get(interaction.channel_id).send("ping")
//       break;
//   }
// })

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('message', async message => {
  let messageAttachment = message.attachments.size > 0 ? message.attachments.array()[0].url : null
  console.log(message.author.id)
  console.log(client.user.id)
  if (message.author.id != client.user.id && messageAttachment) {   
    let embed = new Discord.MessageEmbed();
    embed.setAuthor(message.author.tag, message.author.avatarURL())

    var one;
    https.get(message.attachments.array()[0].url, (response) => {
      one = response.read()
      // console.log("RESP", response.)
    });

    // const rembrandt = new Rembrandt({
    //   // `imageA` and `imageB` can be either Strings (file path on node.js,
    //   // public url on Browsers) or Buffers
    //   imageA: fs.readFileSync(message.attachments.array()[0].url),
    //   imageB: fs.readFileSync(message.attachments.array()[0].url),
    
    //   thresholdType: Rembrandt.THRESHOLD_PERCENT,
    
    //   // The maximum threshold (0...1 for THRESHOLD_PERCENT, pixel count for THRESHOLD_PIXELS
    //   maxThreshold: 0,
    
    //   // Maximum color delta (0...255):
    //   maxDelta: 0,
    
    //   // Maximum surrounding pixel offset
    //   maxOffset: 0,
    
    // })
    
    // // Run the comparison
    // rembrandt.compare()
    //   .then(function (result) {
    
    //     if(result.passed){
    //       // do what you want
    //       console.log(result)
    //     }
    //   })
    embed.setDescription("Ten obraz może zawierać ")
    // if (messageAttachment) embed.setImage(messageAttachment)
    embed.setColor(14680086)
    await message.channel.send(embed)
    message.delete()

    message.channel.send({
      files: [{
        attachment: messageAttachment,
        name: `SPOILER_${message.attachments.array()[0].name}`
      }]
    })
  }
});

client.login(process.env.TOKEN);