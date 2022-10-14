const { SlashCommandBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');
const Discord = require('discord.js');

var glob = {
    track: {
        "songName": "Niezdefiniowane",
        "ex": false,
        "songimg": "https://i.scdn.co/image/ab67616d00001e02a0b8a1ce10fddbba6879262e",
        "songArtist": "Niezdefiniowane",
        "album": "",
        "link": "https://drive.google.com/u/0/uc?id=1LU6lJRjZ7ZVfINHgC8hYjR0apdJYBGy5&export=download"
      }
}

var vote = {
}
var voteD = {
}

var clicked = {
}

var client;

function GetGlobal() {
    return glob
}

function SetGlobal(id, val) {
    glob[id] = val;
}

/**
 * 
 * @returns {Discord.Client}
 */

function GetClient() {
    return client
}

function SetClient(c) {
    client = c;
}

function GetVote() {
    console.log(vote)
    return vote
}

function SetVote(id, val) {
    vote[id] = val;
    console.log(vote)
}

function GetVoteD() {
    console.log(voteD)
    return voteD
}

function SetVoteD(id, val) {
    voteD[id] = val;
    console.log(voteD)
}

function AddVote(id, val) {
    vote[id] = val;
    console.log(vote)
}

function GetClicked(id) {
    if (clicked[id]){

    } else {
        clicked[id] = []
    }
    return clicked[id]
}

function AddClicked(id, val) {
    if (clicked[id]) {
        clicked[id].push(val);
    } else {
        clicked[id] = [];
        clicked[id].push(val);
    }
}

function Player(interaction) {
    const row = new ActionRowBuilder()
    .addComponents(
		new ButtonBuilder()
			.setCustomId('player_prev')
			.setEmoji("<:prev:1030541288078053376>")
			.setStyle(ButtonStyle.Secondary),
		new ButtonBuilder()
			.setCustomId( glob.player.state.status == "playing" || glob.player.state.status == "buffering" ? 'player_pause' : 'player_play')
			.setEmoji(glob.player.state.status == "playing" || glob.player.state.status == "buffering" ? "<:pause:1030551851826950154>" : "<:play:1030551853404008459>")
			.setStyle(ButtonStyle.Success),
		new ButtonBuilder()
			.setCustomId('player_next')
			.setEmoji("<:next:1030541289692864662>")
			.setStyle(ButtonStyle.Secondary),
		);
    const EndEmbed = {
		color: 0x0099ff,
		title: GetGlobal()["track"].songName,
		description: GetGlobal()["track"].songArtist,
		thumbnail: {
			url: GetGlobal()["track"].songimg,
		},
	};

	return ({content: " ", embeds: [EndEmbed], components: [row]})
}

module.exports = {
    GetGlobal,
    SetGlobal,
    GetVote,
    SetVote,
    AddVote,
    SetVoteD,
    GetVoteD,
    GetClicked,
    AddClicked,
    GetClient,
    SetClient,
    Player
}