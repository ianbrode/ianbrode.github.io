(function($){

  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  var Encounter = function (num) {
    $.extend(true, this, Events[num]);
  };

  Encounter.prototype.useStim = function(){
    if(Person.stats.stims > 0){
      Person.stats.stims = Person.stats.stims - 1;
      Person.stats.cur_hp = Person.stats.cur_hp + 10;
      Person.stats.cur_hp = Person.stats.cur_hp > Person.stats.max_hp ? Person.stats.max_hp : Person.stats.cur_hp;
    }else{
      Logger('Your out of stims!')
    }
  };

  Encounter.prototype.attack = function(){
    var encounter = Game.config.events[Game.config.cur_event];
    if(encounter.disposition != 'agressive') encounter.disposition = 'agressive';
    var personAttack  = Person.stats.att + getRandomInt(1,20);
    Logger('personAttack', personAttack)
    if(personAttack >= encounter.stats.def){
      encounter.stats.cur_hp = encounter.stats.cur_hp  - Person.inv.weapon.dmg;
      Logger('encounter.stats.cur_hp', encounter.stats.cur_hp)
      if(encounter.stats.cur_hp <= 0){
        Logger('You killed', encounter.name);
        Controls.showRest();
        return;
      }
    }
    var encounterAttack  = encounter.stats.att + getRandomInt(1,20);
    Logger('encounterAttack', encounterAttack)
    if(encounterAttack >= Person.stats.def){
      Person.stats.cur_hp = Person.stats.cur_hp  - encounter.inv.weapon.dmg;
      Logger('Person.stats.cur_hp', Person.stats.cur_hp)
      if(Person.stats.cur_hp <= 0){
        Logger('You were killed by', encounter.name);
        Controls.showFail();
      }
    }
  };

  Encounter.prototype.buyStim = function(){
    var encounter = Game.config.events[Game.config.cur_event];
    if(encounter.disposition != 'agressive'){
      Person.stats.caps = Person.stats.caps - 10;
      Person.stats.stims = Person.stats.stims + 1;
    }else{
      Logger('This person won\'t trade with you. His attitude is', encounter.disposition)
    }
  };


  var Game = {
    config: {
      daysLeft: 10,
      distance: 7,
      events: [],
      cur_event: -1,
    },
    start: function(){
      this.generateEvents();
      this.next();
      Controls.init();
      Controls.showEncounter();
    },
    next: function(){
      this.config.cur_event = this.config.cur_event + 1;
    },
    generateEvents: function(){
      for (var i = 0; i < this.config.distance; i++) {
        var randomNum = getRandomInt(0, Events.length - 2);

        var randomEvent = new Encounter(randomNum);

        randomEvent.loot = getRandomInt(1,10);
        this.config.events.push(randomEvent);
      };
      this.config.events.push(new Encounter(Events.length-1))
    }
  };

  var Events = [
    {
      name: 'Bandit',
      disposition: 'agressive',
      stats: {
        cur_hp: 5,
        att: 1,
        def: 10
      },
      inv: {
        weapon: {
          name: 'brass',
          dmg: 3
        }
      }
    },
    {
      name: 'Mutant',
      disposition: 'agressive',
      stats: {
        cur_hp: 7,
        att: 2,
        def: 12
      },
      inv: {
        weapon: {
          name: 'baton',
          dmg: 4
        }
      }
    },
    {
      name: 'Base Robot',
      disposition: 'agressive',
      stats: {
        cur_hp: 10,
        att: 3,
        def: 15
      },
      inv: {
        weapon: {
          name: 'shocker',
          dmg: 6
        }
      }
    },
  ];


  var Rest = {
    heal: function(){
        Game.config.daysLeft = Game.config.daysLeft - 1;
        Person.stats.cur_hp = Person.stats.cur_hp + 10;
        Person.stats.cur_hp = Person.stats.cur_hp > Person.stats.max_hp ? Person.stats.max_hp : Person.stats.cur_hp;

    },
    next: function(){
      Game.next();
      Controls.showEncounter();
    },
  };

  var Person = {
    stats: {
      max_hp: 10,
      cur_hp: 10,
      att: 1,
      def: 10,
      stims: 0,
      caps: 0,
      xp: 0,
    },
    inv: {
      weapon: {
        name: 'sword',
        dmg: 6
      }
    },
  }

  var Logger = function(message, value){
    console.log(message + ': ' + (value || ''));
    $('.js-log').prepend('<p>' + message + ': ' + (value || '') + '</p>');
  }

  var Controls = {
    init: function() {
      $('.js-attack').on('click', function(){
        Game.config.events[Game.config.cur_event].attack()
      });

      $('.js-use-stim').on('click', function(){
        Game.config.events[Game.config.cur_event].useStim();
      });

      $('.js-next').on('click', function(){
        Rest.next();
      });

    },
    showRest: function(){
      $('.js-encounter').hide();
      $('.js-rest').show();
    },
    showEncounter: function(){
      $('.js-encounter').show();
      $('.js-rest').hide();
    },
    showFail: function(){

    },
    showSucces: function(){

    }
  }

  Game.start();

})(jQuery);