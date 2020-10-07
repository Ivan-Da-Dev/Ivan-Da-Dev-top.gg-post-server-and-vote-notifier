const config = require("./botconfig.json")
const DBL = require('dblapi.js');
const Discord = require("discord.js")
const client = new Discord.Client()

const botToken = config.token
const token = config.dblToken
const password = config.password

const dbl = new DBL(token, { webhookPort: 5000, webhookAuth: password });

dbl.webhook.on('ready', hook => {

  if(config.logEverything === true){
    console.log(`✅ Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
  } else {
    return;
  }

});

dbl.webhook.on('vote', vote => {
  if(config.sendToChannel === false || !client.channels.cache.get(config.channelId)){
    console.log(`User with ID ${vote.user} just voted!`)

    /* Gets username */
    dbl.getBot(vote.user).then(bot => {
      console.log(bot.username)
  });
  } else {
    let channel = client.channels.cache.get(config.channelId)
      /* Gets username */
      dbl.getBot(vote.user).then(bot => {
        channel.send(`User with ID ${bot.username} just voted!`)
      });
  }
});

dbl.on('error', e => {
 console.log(`Oops! ${e}`);
})

/* Posts your bot's server size onto your top.gg bot card */
client.on('ready', () => {

  if(config.logEverything === true){
    console.log(`✅ Logged in as ${client.user.username}`)
  }

  setInterval(() => {
      dbl.postStats(client.guilds.cache.size, client.ws.shards.first().id, client.ws.shards.size);
      if(config.logEverything === true) return console.log(`✅ Posted ${client.guilds.cache.size} servers onto top.gg`)
  }, 1800000);
});

client.login(botToken)