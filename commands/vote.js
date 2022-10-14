const { SlashCommandBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const youtube = require('random-youtube-video-by-keyword');
const { GetVote, SetVote, SetVoteD, GetVoteD } = require('../commands');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vote')
		.setDescription("Rozpocznij głosowanie")
		.addStringOption(option =>
			option.setName('question')
				.setDescription('Pytanie')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('1')
				.setDescription('Opcja 1')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('2')
				.setDescription('Opcja 2')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('mention')
				.setDescription('Wzmianka')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('to')
				.setDescription('Kiedy głosowanie ma się zakończyć')
				.setRequired(true)),
	async execute(interaction) {
		console.log(interaction)
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('vote_op_1')
					.setLabel(interaction.options._hoistedOptions[1].value)
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('vote_op_2')
					.setLabel(interaction.options._hoistedOptions[2].value)
					.setStyle(ButtonStyle.Danger),
			);
		var to = parseFloat(interaction.options._hoistedOptions[4].value);
		SetVote(interaction.id, [0,0])
		SetVoteD(interaction.id, [interaction.options._hoistedOptions[0].value, interaction.options._hoistedOptions[1].value, interaction.options._hoistedOptions[2].value, interaction.options._hoistedOptions[3].value, to, Date.now()])
		await interaction.reply({ content: `${interaction.options._hoistedOptions[3].value ? `||${interaction.options._hoistedOptions[3].value}|| \n` : ""} \n **${interaction.options._hoistedOptions[0].value}** \n \n ${interaction.options._hoistedOptions[1].value} - ${GetVote()[interaction.id] ? GetVote()[interaction.id][0] : 0} \n ${interaction.options._hoistedOptions[2].value} - ${GetVote()[interaction.id] ? GetVote()[interaction.id][1] : 0} \n Kończy się za ${to < 60000 ? to / 1000 + "s" : to / 60000 + "min"}`, components: [row] });
		setTimeout(async () => {
			await interaction.deleteReply()
			
			const EndEmbed = {
				color: 0x0099ff,
				title: `**${GetVoteD()[interaction.id][0]}**`,
				fields: [
					{
						name: GetVoteD()[interaction.id][1],
						value: GetVote()[interaction.id][0].toString(),
						inline: true,
					},
					{
						name: GetVoteD()[interaction.id][2],
						value: GetVote()[interaction.id][1].toString(),
						inline: true,
					}
				],
				timestamp: new Date().toISOString(),
				footer: {
					text: `Głosowanie zakończone (id: ${Math.random().toString(36).substring(2, 15)}) AutoBot`,
				},
			};
			interaction.channel.send({ embeds: [EndEmbed] })
		}, to)
	},
};