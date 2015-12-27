var GAMESTATE = {
    IDLE: 0,
    SELECT: 1,
    PLAYING: 2,
    WON: 3,
};

var MainCtrl = function(characters, $http, $scope, $uibModal) {
    this.characters = characters.array;
    this.modalService = $uibModal;
    this.randomRollCount = 20;
    this.resetGame();
};

MainCtrl.prototype.resetGame = function() {
    this.players = [];
    for(var i = 0; i < this.characters.length; ++i) {
        this.characters[i].active = false;
        this.characters[i].dead = false;
        this.characters[i].winner = false;
    }
    this.activeChars = 0;
    this.state = GAMESTATE.IDLE;
};

MainCtrl.prototype.randomChars = function() {
    if(this.characters.length < this.randomRollCount) return;
    if(!this.ensureState(GAMESTATE.IDLE)) return;
    for(var i = 0; i < this.randomRollCount; ++i) {
        var chosen = Math.floor(Math.random()*this.characters.length);
        if(this.characters[chosen].active) {
            i--;
            continue;
        }
        this.activeChars++;
        this.characters[chosen].active = true;
    }
};

MainCtrl.prototype.reroll = function() {
    this.resetGame();
    this.randomChars();
};

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

MainCtrl.prototype.incRandomRoll = function() {
    this.randomRollCount++;
};

MainCtrl.prototype.decRandomRoll = function() {
    this.randomRollCount--;
};

MainCtrl.prototype.canIncRandomRoll = function() {
    return this.randomRollCount < this.characters.length;
};

MainCtrl.prototype.canDecRandomRoll = function() {
    return this.randomRollCount > 1;
};

MainCtrl.prototype.canStartPlaying = function() {
    return (this.players.length > 1 && this.state == GAMESTATE.SELECT);
};

MainCtrl.prototype.canAddPlayers = function() {
	return (this.activeChars > 2 && this.state == GAMESTATE.IDLE);
};

MainCtrl.prototype.beginAddPlayers = function() {
   this.state = GAMESTATE.SELECT;
};

MainCtrl.prototype.beginGame = function() {
    if(!this.ensureState(GAMESTATE.SELECT)) return;
    this.state = GAMESTATE.PLAYING;
};

MainCtrl.prototype.clickPJ = function(i) {
    var self = this;
    if(this.state == GAMESTATE.IDLE) {
        if(this.characters[i].active) {
            this.activeChars--;
            this.characters[i].active = false;
        }
        else {
            this.activeChars++;
            this.characters[i].active = true;
        }
    }
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
        });
    }
    if(this.state == GAMESTATE.PLAYING && this.characters[i].active) {
	      var confirmModalHandle = this.modalService.open({
            animation: true,
            templateUrl: 'confirmModal.html',
            controller: 'ConfirmModalCtrl as confirmModalCtrl',
            size: 'sm',
            resolve: {
                selectedChar: function() {
                    return self.characters[i];
                }
            }
        });
        
        confirmModalHandle.result.then(function() {
            self.killPJ(i);
        });
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

MainCtrl.prototype.checkFinish = function() {
    var winners = [];
    for(var i = 0; i < this.players.length; ++i) {
        if(!this.characters[this.players[i].pj].dead) {
            winners[this.players[i].pj] = true;
        }
    }
    var survivors = 0;
    var winnerpj = -1;
    for(var i = 0; i < winners.length; ++i) {
        if(winners[i] === true) {
            ++survivors;
            winnerpj = i;
        }
    }
    if(survivors>1) {
        return;
    }
    if(survivors !== 0) {
        this.characters[winnerpj].winner = true;
        var winnersp = [];
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
    if(this.playerName === '') return;
    this.$uibModalInstance.close(this.playerName);
};

SelectModalCtrl.prototype.nope = function() {
    this.$uibModalInstance.dismiss('S\'ha cagat');
};

var ConfirmModalCtrl = function(selectedChar, $uibModalInstance) {
    this.selectedChar = selectedChar;
    console.log(selectedChar);
    this.$uibModalInstance = $uibModalInstance;
};

ConfirmModalCtrl.prototype.sure = function() {
    this.$uibModalInstance.close();
};

ConfirmModalCtrl.prototype.nope = function() {
    this.$uibModalInstance.dismiss();
};

var WinnerModalCtrl = function(winners) {
    this.players = winners;
};

angular.module('20wise')
.controller('MainCtrl', ['characters', '$http', '$scope', '$uibModal', MainCtrl])
.controller('SelectModalCtrl', ['playerIndex', 'selectedPJ', '$uibModalInstance', SelectModalCtrl])
.controller('ConfirmModalCtrl', ['selectedChar', '$uibModalInstance', ConfirmModalCtrl])
.controller('WinnerModalCtrl', ['winners', WinnerModalCtrl]);
