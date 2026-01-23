const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const pagination = require('../../utility/pagination')
const { getWins } = require('../../utility/getWins');

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

      if (wins.length === 0){
        await interaction.reply('You have no wins lmao :sob:')
      } else {
        await pagination(interaction, wins,  {
          itemsPerPage: 3,
          formatPage: (pageWins) => {
            const description = pageWins.map(win => 
              `**Season ${win.season} Episode ${win.episode}**\nContestant: ${win.contestant}\nWinning Weapon: ${win.winningWeapon}`
            ).join('\n\n');
            return new EmbedBuilder().setColor("Blurple").setDescription(description);
          }
        });
      }

    } catch(err) {
      await interaction.reply(
        `There was an error with this command: ${err.message}`
      )
    }
  }
}