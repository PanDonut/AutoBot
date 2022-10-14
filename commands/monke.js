const { SlashCommandBuilder } = require('discord.js');
const youtube = require('random-youtube-video-by-keyword');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('monke')
		.setDescription("Znajduje jakiś filmik z YouTube'a (Małpa 🐒)"),
	async execute(interaction) {
		youtube.getRandomVid("AIzaSyAOiPxJ8U77X51y2xqFdEgnLAo4T-QC-bU", "funny monkey", async (err, data) => {
			await interaction.reply(`https://www.youtube.com/watch?v=${data.id.videoId}`);
		})
	},
};