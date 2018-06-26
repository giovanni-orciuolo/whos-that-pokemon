// Load up Pokedex module
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class WTPManager {

  constructor() {
    this.state = {
      activeQuiz: false,
      pokemon: {}
    }
    this.resetState = this.resetState.bind(this);
    this.pickRandomPokemon = this.pickRandomPokemon.bind(this);
    this.checkPokemon = this.checkPokemon.bind(this);
  }

  resetState() {
    this.state = {
      activeQuiz: false,
      pokemon: {}
    }
  }

  pickPokemon(index) {
    return new Promise((resolve, reject) => {
      this.state.activeQuiz = true;
      P.resource('/api/v2/pokemon/' + index)
        .then(res => {
          // Get the Pokémon data I need
          const pokemon = {
            form: res.forms[0],
            sprite: res.sprites.front_default
          };
          console.log(pokemon); // Log it
          this.state.pokemon = pokemon; // Update the state accordingly
          resolve(pokemon); // Resolve the promise with the Pokémon I found
        })
        .catch(err => {
          // Something went wrong! I embaris
          console.error("[o_O pickPokemon] Something went wrong while picking a random Pokemon!");
          console.error(err);
          this.resetState();
          reject(err);
        })
    });
  }

  pickRandomPokemon() {
    return this.pickPokemon(getRandomInt(1, 802));
  }

  checkPokemon(name) {
    if (this.state.pokemon.form.name === name.toLowerCase()) {
      this.resetState();
      return true;
    }
    return false;
  }

}

module.exports = {
  WTPManager
};