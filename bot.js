var Discord = require('discord.js')
var auth = require('./auth.json');
var winston = require('winston')
var format =  winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
)
var logger = new winston.createLogger({
    transports: [
        new winston.transports.Console({
            json: false,
            format: winston.format.combine(winston.format.colorize(), format)
        }),
        new winston.transports.File({
            filename: './log-'+Date.now()+'.log',
            format: format
        })
    ]
})
// Initialize Discord Bot
const bot = new Discord.Client()

require('death')((signal, err) => {
    logger.info('Program exiting')
    bot.destroy()
    logger.info('Logged out')
})


bot.on('ready', function() {
    logger.info('Logged in as ' + bot.user.tag);
})

bot.on('voiceStateUpdate', (oldMember, newMember) => {
  // Check if user has moved to a new voice channel.
  if(newMember.voiceChannel && oldMember.voiceChannel && (newMember.voiceChannel != oldMember.voiceChannel)){
    user = newMember.user.username
    channel = newMember.voiceChannel.name
    logger.info(user + ' joined ' + channel)
    // Get Username based on PartyBeast's "Username's Channel" format
    var owner = channel.split("'")[0]
    // If user is the one the channel was created for
    if(owner === user) {
      logger.info('Adding perms for '+user);
      // Give some perms
      newMember.voiceChannel.overwritePermissions(newMember.id, {'MANAGE_CHANNELS': true, 'MANAGE_ROLES': true})
    }
  }
})

bot.login(auth.token)
