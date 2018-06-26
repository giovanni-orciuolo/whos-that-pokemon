// Load up the Discord library
const Discord = require('discord.js');
// Load up WTP class
const WTPManager = require('./WTP').WTPManager;
const wtp = new WTPManager();

// This is the actual bot
const bot = new Discord.Client();

// Load config.json file
const config = require('./config.json');
// config.token contains the bot's token
// config.prefix contains the message prefix

//
// BOT LISTENERS
// 

bot.on('ready', () => {
  // Set the bot's activity
  bot.user.setActivity("Type !wtp to play");
});

const TIME_TO_ANSWER = 20; // In seconds

let currentPokemon = "";
let timeout = null;
const clearGlobals = function() {
  currentPokemon = "";
  if (timeout !== null)
    clearTimeout(timeout);
}

bot.on('message', async message => {
  // It's good practice to ignore other bots
  if (message.author.bot) return;

  // See if the message contains the bot's prefix
  if (message.content.indexOf(config.prefix) !== 0) return;

  // Get the arguments of the command
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Execute different behaviours based on the command
  switch (command)
  {
    case 'wtp': {
      if (wtp.state.activeQuiz) {
        break;
      }
      console.log("[!wtp] Picking a random Pokemon!");
      wtp.pickRandomPokemon()
        .then(poke => {
          //message.reply("I picked " + poke.form.name + "!");
          message.channel.send("**WHO'S THAT POKEMON?** (*20 seconds to answer*)");
          message.channel.send("", {
            file: poke.sprite
          });
          currentPokemon = poke.form.name;
          message.delete().catch(O_o=>{});
          // Set a timeout to guess this random pokémon
          timeout = setTimeout(() => {
            wtp.resetState();
            message.channel.send("**IT'S " + currentPokemon.toUpperCase() + "!**");
            clearGlobals();
          }, TIME_TO_ANSWER * 1000);
        })
        .catch(o_O => {
          message.reply("Couldn't pick a random Pokémon :(")
        });
    }
    break;
    case 'wtp-its': {
      if (!wtp.state.activeQuiz) {
        message.reply("No active quiz. Start one by typing !wtp");
        break;
      }
      if (args.length === 0) {
        message.reply("Please specify a Pokémon to answer the quiz.");
        break;
      }
      console.log("Someone guessed " + args[0]);
      if (wtp.checkPokemon(args[0])) {
        message.reply("**YOU WON!** It was " + currentPokemon + "!");
        message.channel.send("Type !wtp to start a new quiz!");
        clearGlobals();
      } else {
        message.reply("Wrong Pokémon!");
      }
    }
    break;
  }
});

//
// BOT LOGIN
//

bot.login(config.token);