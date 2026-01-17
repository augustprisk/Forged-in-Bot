const { SlashCommandBuilder } = require('discord.js');
const { makeGuess } = require('../../utility/makeGuess.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('guess')
    .setDescription('Make your guess for this episodes forged in fire winner')
    .addStringOption((Option) => 
        Option
            .setName('user')
            .setDescription('August or Grace?')
            .setRequired(true)
            .addChoices(
                { name: 'August', value: 'August' },
                { name: 'Grace', value: 'Grace' }
            )
    )
    .addStringOption((Option) =>
        Option
            .setName('name')
            .setDescription('Name of contestant?')
            .setRequired(true)
    )
    .addStringOption((Option) =>
        Option
            .setName('season')
            .setDescription('What Season?')
            .setRequired(true)
    
    )
    .addStringOption((Option) =>
        Option
            .setName('episode')
            .setDescription('What episode?')
            .setRequired(true)
    ),
    async execute(interaction) {
        const season = interaction.options.getString('season', true)
        const episode = interaction.options.getString('episode', true)
        const contestantName = interaction.options.getString('name', true)
        const userName = interaction.options.getString('user', true)

        try {
            makeGuess(userName, contestantName, season, episode)
            await interaction.reply(
                `${userName} Made their guess for ${contestantName}, Season: ${season} Episode: ${episode}`
            )
        } catch (e) {
            await interaction.reply(
                `There was an error with this command: ${e.message}`
            )
        }
    }
}