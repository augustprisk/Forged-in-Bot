const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('guess')
    .setDescription('Make your guess for this episodes forged in fire winner')
    .addStringOption((Option) =>
        Option
            .setName('episode')
            .setDescription('What season and episode?')
            .setRequired(true)
    )
    .addStringOption((Option) =>
        Option
            .setName('name')
            .setDescription('Name of contestant?')
            .setRequired(true)
        ),
    async execute(interaction) {
        const episode = interaction.options.getString('episode', true)
        const contestantName = interaction.options.getString('episode', true)
        const userName = interaction.user.username


    }
}