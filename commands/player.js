const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
const { SlashCommandBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder, CommandInteraction } = require('discord.js');
const { GetClient, SetGlobal, Player, GetGlobal } = require('../commands');
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('player')
		.setDescription('Opcje odtwarzacza')
		.addStringOption(option =>
			option.setName('argument')
				.setDescription('Akcja')
				.setRequired(true)
				.addChoices(
					{ name: 'Utwórz odtwarzacz', value: 'make' },
					{ name: 'Dołącz do kanału głosowego', value: 'join' },
					{ name: 'Music', value: 'duckmusic' },
					{ name: 'Playlista Music', value: 'duckmusic_playlist' },
				))
		.addStringOption(option =>
			option.setName('option')
				.setDescription('Opcja')
				.setRequired(false)
			),

	/**
	 * 
	 * @param {CommandInteraction} interaction 
	 */
	async execute(interaction) {
		switch (interaction.options._hoistedOptions[0].value) {
			case "join":
				// interaction.reply("🐒 Dołączam 🐒");
				const connection = joinVoiceChannel({
					channelId: "1027817871449002029",
					guildId: interaction.guildId,
					adapterCreator: GetClient().guilds.cache.get(interaction.guildId).voiceAdapterCreator,
				});				
				const resource = createAudioResource("https://drive.google.com/u/0/uc?id=1k7Sq_NU8vqtrrWblH9m0mC8Bihr1W_tu&export=download", {
					inlineVolume: true,
				})				
				resource.volume.setVolume(1)
				const player = createAudioPlayer({
					behaviors: {
						noSubscriber: NoSubscriberBehavior.Play,
					},
				});
				connection.subscribe(player)
				player.play(resource)			
				SetGlobal("player", player)		
				break;

			case "make":
				interaction.reply(Player())			
				break;
		
			case "duckmusic":
				SetGlobal("queue", [GetGlobal()["songs"][parseInt(interaction.options._hoistedOptions[1].value)]])
				SetGlobal("track", GetGlobal()["queue"][0])
				interaction.reply(Player())	
				const res = createAudioResource(GetGlobal().track.link, {
					inlineVolume: true,
				})		
				GetGlobal().player.play(res)
				break;

			case "duckmusic_playlist":
				var queue = [];
				GetGlobal()["playlists"][parseInt(interaction.options._hoistedOptions[1].value)].playlistData.forEach(element => {
					queue.push(GetGlobal()["songs"][element.songindex])
				});
				SetGlobal("queue", queue)
				SetGlobal("track", GetGlobal()["queue"][0])
				interaction.reply(Player())	
				const resP = createAudioResource(GetGlobal().track.link, {
					inlineVolume: true,
				})		
				GetGlobal().player.play(resP)
				break;
		
			default:
				break;
		}
	},
};