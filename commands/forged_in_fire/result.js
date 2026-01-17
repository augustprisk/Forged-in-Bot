const { SlashCommandBuilder } = require('discord.js');
const { writeResult } = require('../../utility/writeResult')

module.exports = {
  data: new SlashCommandBuilder()
  .setName('result')
  .setDescription('Was your guess right or wrong?')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('win')
      .setDescription('Your guess was correct!!!')
      .addStringOption((option) => option.setName('weapon').setDescription('What was the final weapon?'))
  )
  .addSubcommand((subcommand) => 
    subcommand
      .setName('loss')
      .setDescription('Your guess was wrong!!!')
      .addStringOption((option) => option.setName('weapon').setDescription('What was the final weapon?'))
  ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'win') {
      const result = 'win';
      const weapon = interaction.options.getStringOption('weapon');
      const point = 1;


    } else if (interaction.options.getSubcommand() === 'win') {
      const result = 'lose';
      const weapon = interaction.options.getStringOption('weapon');
      const point = 0

      try {
        writeResult(result, weapon, point)
        await interaction.reply(
          `${interaction.user.username}, your loss has been recorded`
        )
      } catch(err) {
        await interaction.reply(
          `There was an error with this command: ${err}`
        )
      }
    }
  }
}