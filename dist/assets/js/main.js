angular.module('20wise', ['ui.bootstrap']);

var CharacterService = function() {
    this.array = [
        {img:'bowser-jr.png', name:'Bowser Jr.'},
        {img:'bowser.png', name:'Bowser'},
        {img:'captain-falcon.png', name:'Captain Falcon'},
        {img:'charizard.png', name:'Charizard'},
        {img:'dark-pit.png', name:'Dark Pit'},
        {img:'dedede.png', name:'King Dedede'},
        {img:'diddy.png', name:'Diddy Kong'},
        {img:'donkey.png', name:'Donkey Kong'},
        {img:'dr-mario.png', name:'Dr. Mario'},
        {img:'duck-hunt.png', name:'Duo Duck Hunt'},
        {img:'falco.png', name:'Falco'},
        {img:'fox.png', name:'Fox'},
        {img:'game-watch.png', name:'Game&Watch'},
        {img:'ganondorf.png', name:'Ganondorf'},
        {img:'greninja.png', name:'Greninja'},
        {img:'ike.png', name:'Ike'},
        {img:'jigglypuff.png', name:'Jigglypuff'},
        {img:'kirby.png', name:'Kirby'},
        {img:'link.png', name:'Link'},
        {img:'little-mac.png', name:'Little Mac'},
        {img:'lucario.png', name:'Lucario'},
        {img:'lucas.png', name:'Lucas'},
        {img:'lucina.png', name:'Lucina'},
        {img:'luigi.png', name:'Luigi'},
        {img:'mario.png', name:'Mario'},
        {img:'marth.png', name:'Marth'},
        {img:'mega-man.png', name:'Mega Man'},
        {img:'meta-knight.png', name:'Meta Knight'},
        {img:'mewtwo.png', name:'Mewtwo'},
        {img:'mii-brawler.png', name:'Mii Brawler'},
        {img:'mii-gunner.png', name:'Mii Gunner'},
        {img:'mii-swordfighter.png', name:'Mii Swordfighter'},
        {img:'ness.png', name:'Ness'},
        {img:'olimar.png', name:'Olimar'},
        {img:'pac-man.png', name:'Pac-Man'},
        {img:'palutena.png', name:'Palutena'},
        {img:'peach.png', name:'Peach'},
        {img:'pikachu.png', name:'Pikachu'},
        {img:'pit.png', name:'Pit'},
        {img:'robin.png', name:'Robin'},
        {img:'rob.png', name:'Rob'},
        {img:'rosalina.png', name:'Rosalina'},
        {img:'roy.png', name:'Roy'},
        {img:'ryu.png', name:'Ryu'},
        {img:'samus.png', name:'Samus'},
        {img:'sheik.png', name:'Sheik'},
        {img:'shulk.png', name:'Shulk'},
        {img:'sonic.png', name:'Sonic'},
        {img:'toon-link.png', name:'Toon Link'},
        {img:'villager.png', name:'Villager'},
        {img:'wario.png', name:'Wario'},
        {img:'wii-fit-trainer.png', name:'Wii Fit Trainer'},
        {img:'yoshi.png', name:'Yoshi'},
        {img:'zelda.png', name:'Zelda'},
        {img:'zero-suit-samus.png', name:'Zero Suit Samus'}
    ];
};

angular.module('20wise')
.service('characters', [CharacterService]);



var GAMESTATE = {
    IDLE: 0,
    SELECT: 1,
    PLAYING: 2,
    WON: 3,
};

var MainCtrl = function(characters, $http, $scope, $uibModal) {
    this.characters = characters.array;
    this.modalService = $uibModal;
    this.resetGame();
};

MainCtrl.prototype.resetGame = function() {
    this.players = [];
    for(var i = 0; i < this.characters.length; ++i) {
        this.characters[i].active = false;
        this.characters[i].dead = false;
        this.characters[i].winner = false;
    }
    this.state = GAMESTATE.IDLE;
};

MainCtrl.prototype.randomChars = function() {
    if(this.characters.length < 20) return;
    if(!this.ensureState(GAMESTATE.IDLE)) return;
    for(var i = 0; i < 20; ++i) {
        var chosen = Math.floor(Math.random()*this.characters.length);
        if(this.characters[chosen].active) {
            i--;
            continue;
        }
        this.characters[chosen].active = true;
    }
    this.state = GAMESTATE.SELECT;
};

MainCtrl.prototype.reroll = function() {
    this.resetGame();
    this.randomChars();
}

MainCtrl.prototype.ensureState = function(state) {
    if(this.state != state) {
        console.log('subnormal');
        return false;
    }
    return true;
};

MainCtrl.prototype.isIdle = function() {
    return this.state == GAMESTATE.IDLE;
};

MainCtrl.prototype.isSelect = function() {
    return this.state == GAMESTATE.SELECT;
};

MainCtrl.prototype.isPlaying = function() {
    return this.state == GAMESTATE.PLAYING;
};

MainCtrl.prototype.isWon = function() {
    return this.state == GAMESTATE.WON;
};

MainCtrl.prototype.canStartPlaying = function() {
    return (this.players.length > 1 && this.state == GAMESTATE.SELECT);
};

MainCtrl.prototype.beginGame = function() {
    if(!this.ensureState(GAMESTATE.SELECT)) return;
    this.state = GAMESTATE.PLAYING;
};

MainCtrl.prototype.clickPJ = function(i) {
    var self = this;
    if(this.state == GAMESTATE.SELECT && this.characters[i].active && this.players.length < 8) {
        var modalHandle = this.modalService.open({
            animation: true,
            templateUrl: 'selectModal.html',
            controller: 'SelectModalCtrl as modalCtrl',
            size: 'sm',
            resolve: {
                selectedPJ: function() {
                    return i;
                },
                playerIndex: function() {
                    return self.players.length + 1;
                }
            }
        });
        modalHandle.result.then(function(name) {
            self.addPlayer(i, name);
        })
    }
    if(this.state == GAMESTATE.PLAYING) {
        this.killPJ(i);
    }
};

MainCtrl.prototype.killPJ = function(i) {
    if(!this.ensureState(GAMESTATE.PLAYING)) return;
    if(i < 0 || i > this.characters.length) return;
    var c = this.characters[i];
    if(!c.active) return;
    c.dead = true;
    this.checkFinish();
};

MainCtrl.prototype.checkFinish = function(i) {
    var winners = [];
    for(var i = 0; i < this.players.length; ++i) {
        if(!this.characters[this.players[i].pj].dead) {
            winners[this.players[i].pj] = true;
        }
    }
    var survivors = 0;
    var winnerpj = -1;
    for(var i = 0; i < winners.length; ++i) {
        if(winners[i] == true) {
            ++survivors;
            winnerpj = i;
        }
    }
    if(survivors>1) {
        return;
    }
    if(survivors != 0) {
        this.characters[winnerpj].winner = true;
        winnersp = [];
        for(var i = 0; i < this.players.length; ++i) {
            if(this.players[i].pj == winnerpj) {
                winnersp[winnersp.length] = this.players[i].name;
            }
        }
        var modalHandle = this.modalService.open({
            animation: true,
            templateUrl: 'winnerModal.html',
            controller: 'WinnerModalCtrl as winnerModalCtrl',
            size: 'sm',
            resolve: {
                winners: function() {
                    return winnersp;
                }
            }
        });

    }
    this.state = GAMESTATE.WON;
};

MainCtrl.prototype.addPlayer = function(pj, name) {
    this.players[this.players.length] = {
        pj: pj,
        name: name
    };
};

var SelectModalCtrl = function(playerIndex, selectedPJ, $uibModalInstance) {
    this.playerIndex = playerIndex;
    this.selectedPJ = selectedPJ;
    this.$uibModalInstance = $uibModalInstance;
    this.playerName = '';
};

SelectModalCtrl.prototype.sure = function() {
    if(this.playerName == '') return;
    this.$uibModalInstance.close(this.playerName);
};

SelectModalCtrl.prototype.nope = function() {
    this.$uibModalInstance.dismiss('S\'ha cagat');
};

var WinnerModalCtrl = function(winners) {
    this.players = winners;
};

angular.module('20wise')
.controller('MainCtrl', ['characters', '$http', '$scope', '$uibModal', MainCtrl])
.controller('SelectModalCtrl', ['playerIndex', 'selectedPJ', '$uibModalInstance', SelectModalCtrl])
.controller('WinnerModalCtrl', ['winners', WinnerModalCtrl]);
