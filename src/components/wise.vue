<template>
  <div>
    <modal v-if="showError" @close="showError = false">
      <h3 slot="header">Error</h3>
      <p slot="body">{{errorText}}</p>
    </modal>
    <div class="settings-screen" v-if="gamePhase === 'welcome'">
        <img class="title" src="../assets/title.png">
        <p class="welcome">Welcome to 20wise!</p>
        <div class="input">
            <p>Number of players:</p>
            <input type="number" v-model.number="numPlayers"/>
        </div>
        <div class="input">
            <p>Random selection:</p>
            <input type="checkbox" v-model="randomSelection">
        </div>
        <div class="input" v-if="randomSelection">
            <p>Number of fighters:</p>
            <input type="number" v-model.number="numFighters"/>
        </div>
        <button @click="settingsDone" :disabled="areSettingsInvalid()">DONE</button>
    </div>
    <div class="picking-screen" v-if="gamePhase === 'picking'">
      <div class="block">
        <p class="welcome">Pick the fighters to be used</p>
        <button @click="startGame" :disabled="isPickingInvalid()">DONE</button>
      </div>
      <div class="single-fighter"
           v-for="fighter in picked_fighters"
           v-bind:key="fighter.name"
           v-bind:style="{opacity: fighter.picked ? 1 : 0.25}"
           @click="togglePickFighter(fighter.name)">
        <img :src="getFighterImgUrl(fighter.src)"/>
      </div>
    </div>
    <div class="choosing-screen" v-if="gamePhase === 'choosing'">
        <div class="block">
          <p class="welcome">Pick your name and your fighter!</p>
          <div class="player-summary">
              <p v-for="player in gameState.players" v-bind:key="player.name">Player {{player.name}} is ready!</p>
          </div>
          <div class="input">
              <p>Player Name</p>
              <input v-model="newPlayerName"/>
          </div>
        </div>
        <div class="choosing-roster">
            <div class="single-fighter"
                 v-for="fighter in gameState.fighters"
                 v-bind:key="fighter.name"
                 @click="addPlayer(fighter.name)">
                <img :src="getFighterImgUrl(fighter.src)"/>
            </div>
        </div>
    </div>
    <div class="roster-screen" v-if="gamePhase === 'playing'">
      <div class="player-summary">
          <p v-for="player in gameState.players" v-bind:key="player.name">Player {{player.name}} is {{isFighterAlive(player.fighter) ? "alive" : "dead"}}</p>
      </div>
      <div class="single-fighter"
           v-for="fighter in gameState.fighters"
           v-bind:key="fighter.name"
           v-bind:style="{opacity: fighter.alive ? 1 : 0.25}"
           @click="killFighter(fighter.name)">
        <img :src="getFighterImgUrl(fighter.src)"/>
      </div>
    </div>
    <div class="results-screen" v-if="gamePhase === 'results'">
        <div class="player-summary">
            <p v-for="player in gameState.players"
               v-bind:key="player.name"
               v-bind:style="{color: isFighterAlive(player.fighter) ? 'green' : 'red'}">
                {{player.name}} ({{player.fighter}}) {{isFighterAlive(player.fighter) ? "WON" : "LOST"}}
            </p>
        </div>
    </div>
  </div>
</template>

<script>
import fighter_list from '@/assets/fighters.json'
import modal from './modal'

export default {
  name: 'wise',
  components: {
      modal
  },
  props: {},
  data: function() {
    return {
        all_fighters: [...fighter_list],
        picked_fighters: [...fighter_list],
        gamePhase: 'welcome',
        numPlayers: 2,
        numFighters: 2,
        randomSelection: false,
        newPlayerName: '',
        showError: false,
        gameState: {
          fighters: [],
          players: [],
        },
      };
    },
  methods: {
    bringUpModal(modalText) {
        this.errorText = modalText;
        this.showError = true;
    },
    killFighter(fighterName) {
        this.gameState.fighters.forEach(f => f.alive = f.name === fighterName? false : f.alive);
        this.$forceUpdate();
        this.checkWinCondition();
    },
    isFighterAlive(fighterName) {
        return Boolean(this.gameState.fighters.find(f => f.name === fighterName && f.alive));
    },
    checkWinCondition() {
      let alivePlayers = this.gameState.players.filter(p => this.isFighterAlive(p.fighter));
      if (alivePlayers.length < 2 || alivePlayers.every(p => p.fighter === alivePlayers[0].fighter)) {
          this.gamePhase = 'results';
      }
      return false;
    },
    getRandomSubarray(arr, size) {
      let arr2 = JSON.parse(JSON.stringify(arr));
      let shuffled = arr2.slice(0), i = arr2.length, temp, index;
      while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp
      }
      return shuffled.slice(0, size)
    },
    getFighterImgUrl(src) {
      return require('../assets/fighters/' + src)
    },
    settingsDone() {
        if(this.areSettingsInvalid()) {
            this.bringUpModal("Invalid settings. Number of players must be > 1, number of fighters too if chosen at random");
            return
        }
        if(this.randomSelection) {
            this.gameState.fighters = this.getRandomSubarray(this.all_fighters, this.numFighters);
            this.gameState.fighters.forEach(f => f.alive = true);
            this.gamePhase = 'choosing'
        }
        else {
            this.picked_fighters.forEach(f => f.picked = false);
            this.gamePhase = 'picking'
        }
    },
    startGame() {
      if(this.isPickingInvalid()) {
          this.bringUpModal("Not enough fighters picked");
          return
      }
      this.gameState.fighters = this.picked_fighters.filter(f => f.picked === true);
      this.gameState.fighters.forEach(f => f.alive = true);
      this.gamePhase = 'choosing'
    },
    togglePickFighter(fighterName) {
      this.picked_fighters.forEach(f => f.picked = f.name === fighterName? !f.picked : f.picked);
      this.$forceUpdate();
    },
    addPlayer(fighterName) {
      if (this.newPlayerName.length === 0 || this.gameState.players.find(player => player.name === this.newPlayerName)) {
          this.bringUpModal("Can't add a player without name or a player that already exists")
          return
      }
      this.gameState.players.push({name: this.newPlayerName, fighter: fighterName});
      if(this.numPlayers === this.gameState.players.length) {
          this.gamePhase = 'playing';
          this.checkWinCondition();
      }
    },
    areSettingsInvalid() {
        return !(this.numPlayers > 1 && (!this.randomSelection || this.numFighters > 1 && this.numFighters <= this.all_fighters.length));
    },
    isPickingInvalid() {
        let totalPicked = this.picked_fighters.filter(f => f.picked === true).length;
        return !(totalPicked >= 2 && totalPicked <= this.all_fighters.length);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    html {
        min-height: 100%;
    }
    /* GLOBAL STUFF */
    * {
        font-family: sans-serif;
    }
    div.roster-screen, div.picking-screen, div.choosing-screen, div.settings-screen, div.results-screen {
        text-align: center;
    }
    div.roster-screen, div.picking-screen {
        line-height: 0;
    }
    div.input p, div.input input {
        display:inline-block;
    }
    div.input p {
        margin: 10px;
    }
    div.input input {
        border: 1px solid darkgrey;
        border-radius: 3px;
        text-indent: 5px;
    }
    button {
        background-color: lightskyblue;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        margin: 20px;
    }
    button:disabled {
        background-color: lightgray;
    }
    div.block {
        display: block;
    }

    /* SETTINGS SCREEN */
    img.title {
        max-width: 40%;
    }
    p.welcome {
        font-size: 25px;
        margin-bottom: 20px;
    }

    /* ROSTER SCREEN */
    div.single-fighter {
      display: inline-block;
    }
    div.single-fighter {
        max-width: 25%;
    }
    div.single-fighter img {
        max-width: 100%;
    }

    div.choosing-roster {
        line-height: 0;
    }

    /* SUMMARY SCREEN */
    div.results-screen {
        padding-top: 10vh;
    }
    div.player-summary {
        font-size: 25px;
        text-align: center;
    }
</style>
