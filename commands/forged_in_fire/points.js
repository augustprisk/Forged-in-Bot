const { SlashCommandBuilder } = require('discord.js');
const { getPoints } = require('../../utility/getPoints.js')

module.exports = {
  data: new SlashCommandBuilder()
  .setName('points')
  .setDescription('Get points')
  .addStringOption((Option) => 
    Option
      .setName('player')
      .setDescription('Player name')
      .setRequired(true)
      .addChoices(
        { name: "August", value: "August" },
        { name: "Grace", value: "Grace"}
      )
  ),
  async execute(interaction) {
    const userName = interaction.options.getString('player', true)

    try {
      const points = await getPoints(userName)
      await interaction.reply(
        `${userName}, your points are: ${points}`
      )
    } catch(err) {
      await interaction.reply(
        `There was an error with this command: ${err}`
      )
    }
  }
}