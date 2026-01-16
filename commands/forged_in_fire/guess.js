const { SlashCommandBuilder } = require('discord.js');
const { makeGuess } = require('write.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('guess')
    .setDescription('Make your guess for this episodes forged in fire winner')
    .addStringOption((Option) =>
        Option
            .setName('Episode')
            .setDescription('What season and episode?')
            .setRequired(true)
    )
    .addStringOption((Option) =>
        Option
            .setName('Name')
            .setDescription('Name of contestant?')
            .setRequired(true)
    )
    .addStringOption((Option) => 
        Option
            .setName('User')
            .setDescription('August or Grace?')
            .setRequired('true')
            .addChoices(
                { name: 'August', value: 'August' },
                { name: 'Grace', value: 'Grace' }
            )
    ),
    async execute(interaction) {
        const episode = interaction.options.getString('Episode', true)
        const contestantName = interaction.options.getString('Name', true)
        const userName = interaction.options.getString('User', true)

        try {
            makeGuess(userName, contestantName, episode)
            await interaction.reply(
                `${userName} Made their guess for ${contestantName}, ${episode}`
            )

        } catch (e) {
            await interaction.reply(
                `There was an error with this command: ${e.message}`
            )
        }
    }
}