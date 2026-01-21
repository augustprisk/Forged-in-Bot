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
      .addStringOption((option) => option.setName('weapon').setDescription('What was the final weapon?').setRequired(true))
  )
  .addSubcommand((subcommand) => 
    subcommand
      .setName('loss')
      .setDescription('Your guess was wrong!!!')
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
      .addStringOption((option) => option.setName('weapon').setDescription('What was the final weapon?').setRequired(true))
  ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'win') {
      const result = 'win';
      const userName = interaction.options.getString('user', true);
      const weapon = interaction.options.getString('weapon', true);
      const point = 1;

      try {
        writeResult(userName, result, weapon, point)
        await interaction.reply(
          `${interaction.user.username}, your win has been recorded`
        )
      } catch(err) {
        await interaction.reply(
          `There was an error with this command: ${err}`
        )
      }
    } else if (interaction.options.getSubcommand() === 'loss') {
      const result = 'lose';
      const userName = interaction.options.getString('user', true);
      const weapon = interaction.options.getString('weapon', true);
      const point = 0

      try {
        writeResult(userName, result, weapon, point)
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