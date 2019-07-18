var Discord = require('discord.js');
var auth = require('./auth.json');
console.log('Init');
// Initialize Discord Bot
const bot = new Discord.Client();

bot.on('ready', function() {
    console.log('Logged in as %s\n', bot.user.tag);
});

bot.on('voiceStateUpdate', (oldMember, newMember) => {
  // Check if user has moved to a new voice channel.
  if(newMember.voiceChannel){
    // Get Username based on PartyBeast's "Username's Channel" format
    var owner = newMember.voiceChannel.name.split("'")[0];
    console.log('owner: '+owner);
    // Get User's name
    var name = newMember.displayName;
    console.log('name: '+name);
    // If user is the one the channel was created for
    if(owner === name) {
      console.log('Owner, adding perms: '+name);
      // Give some perms
      newMember.voiceChannel.overwritePermissions(newMember.id, {'MANAGE_CHANNELS': true, 'MANAGE_ROLES': true});
    }
  }
})

bot.login(auth.token);
