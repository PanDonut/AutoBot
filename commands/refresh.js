const { SlashCommandBuilder } = require('discord.js');
const { RegisterCommands } = require('../command');
const { GetVote, SetVote, GetVoteD, SetVoteD } = require('../commands');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('refresh')
		.setDescription('Odśwież'),
	async execute(interaction) {
		await interaction.reply('Odświeżam  <a:loader:1030497384339349504>');
		Object.keys(GetVote()).forEach(element => {
			SetVote(element, [0,0])
		});
		Object.keys(GetVoteD()).forEach(element => {
			SetVoteD(element, [0,0])
		});
		RegisterCommands()
	},
};