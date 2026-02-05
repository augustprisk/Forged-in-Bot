const { SlashCommandBuilder } = require('discord.js');
const { writeResult } = require('../../utility/writeResult')

module.exports = {
  data: new SlashCommandBuilder()
  .setName('result')
  .setDescription('Enter the winner and final weapon')
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
      .addStringOption((option) => option.setName('winner').setDescription('who won?').setRequired(true))
      .addStringOption((option) => option.setName('weapon').setDescription('What was the final weapon?').setRequired(true)),
  async execute(interaction) {
    const userName = interaction.options.getString('user', true);
    const winner = interaction.options.getString('winner', true);
    const weapon = interaction.options.getString('weapon', true);
    const point = 1;

    try {
      writeResult(userName, winner, weapon, point)
      await interaction.reply(
        `${userName}, your result has been recorded`
      )
    } catch(err) {
      await interaction.reply(
        `There was an error with this command: ${err}`
      )
    }
  }
}