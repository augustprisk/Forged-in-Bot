const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { pagination } = require('../../utility/pagination')
const { getWins } = require('getWins.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('wins')
  .setDescription('get wins')
  .addStringOption((Option) => 
    Option
      .setName('player')
      .setDescription('August or Grace?')
      .setRequired(true)
      .addChoices(
        { name: 'August', value: 'August' },
        { name: 'Grace', value: 'Grace' }
      )
  ),
  async execute(interaction) {
    const userName = interaction.options.getString('player', true);

    try{
      const wins = await getWins(userName);
      await interaction.reply(
        `${userName} here are your wins:`
      )
    } catch(err) {
      await interaction.reply(
        `There was an error with this command: ${err.message}`
      )
    }
  }
}