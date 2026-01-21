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
      const embeds = [];
      
      for (const win of wins) {
        embeds.push(new EmbedBuilder().setColor("Blurple").setDescription(`Season: ${win.season} Episode: ${win.episode}, Contestant: ${win.contestant}, Winning Weapon: ${win.finalWeapon}`))
      }

      if (wins.length === 0){
        await interaction.reply('You have no wins lmao :sob:')
      } else {
        await pagination(interaction, embeds)
      }

    } catch(err) {
      await interaction.reply(
        `There was an error with this command: ${err.message}`
      )
    }
  }
}