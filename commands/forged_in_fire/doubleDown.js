const { SlashCommandBuilder } = require('discord.js');
const { doubleDownGuess } = require('../../utility/doubleDownGuess')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('double_down')
    .setDescription("Champions edition only, select a new contestant, if you're wrong again, you lose a point")
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
        .setName('contestant')
        .setDescription('Name of new contestant?')
        .setRequired(true)
    ),
  async execute(interaction) {
    const userName = interaction.options.getString('user', true);
    const contestant = interaction.options.getString('contestant', true);

    try{
      await doubleDownGuess(userName, contestant);

      await interaction.reply(
        `${userName} doubled down with ${contestant} :smiling_imp:`
      );
    } catch (err) {
      await interaction.reply(
          `There was an error with this command: ${err}`
        )
    }
  }
}