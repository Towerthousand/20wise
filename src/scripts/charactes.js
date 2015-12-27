var CharacterService = function() {
    this.array = [
	//{img:'bayonetta.png', name:'Bayonetta'},
        {img:'bowser-jr.png', name:'Bowser Jr.'},
        {img:'bowser.png', name:'Bowser'},
        {img:'captain-falcon.png', name:'Captain Falcon'},
        {img:'charizard.png', name:'Charizard'},
	{img:'cloud.png', name:'Cloud'},
	//{img:'corrin.png', name:'Corrin'},
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


