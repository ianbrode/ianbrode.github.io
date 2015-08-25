(function($){
  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  var Encounter = function (num) {
    $.extend(true, this, Events[num]);
  };

  Encounter.prototype.useStim = function(){
    if(Person.stims > 0){
      Person.stims = Person.stims - 1;
      Person.cur_hp = Person.cur_hp + 8;
      Person.cur_hp = Person.cur_hp > Person.max_hp ? Person.max_hp : Person.cur_hp;
      Logger('Using stim')
    }else{
      Logger('Your out of stims!')
    }
  };

  Encounter.prototype._enemyAttack = function(){
    var encounter = Game.config.events[Game.config.cur_event];
    var encounterAttack  = encounter.att + getRandomInt(1,20);
    if(encounterAttack >= Person.def){
      var damageRoll = getRandomInt(1, encounter.inv.weapon.dmg)
      Person.cur_hp = Person.cur_hp  - damageRoll;
      Logger('You were hit for', damageRoll)
      if(Person.cur_hp <= 0){
        Logger('You were killed by', encounter.name);
        Controls.showFail();
      }
    }else{
      Logger('Attack evaded from', encounter.name)
    }    
  }

  Encounter.prototype.attack = function(){
    var encounter = Game.config.events[Game.config.cur_event];
    if(encounter.disposition != 'agressive') encounter.disposition = 'agressive';

    var personAttack  = Person.att + getRandomInt(1,20);
    if(personAttack >= encounter.def){
      var damageRoll = getRandomInt(1, Person.inv.weapon.dmg);
      encounter.cur_hp = encounter.cur_hp  - damageRoll;
      Logger('You hit', '' + encounter.name + ' for ' + damageRoll);
      if(encounter.cur_hp <= 0){
        Logger('You killed', encounter.name);
        Person.caps = Person.caps + encounter.loot;
        Game.countXp(encounter.xpVal);
        Controls.showRest();
        if (Game.config.cur_event == 7) {
          $('.success').modal('show');
        }
        return;
      }
    }else{
      Logger('You miss', encounter.name)
    }

    this._enemyAttack();
  };

  Encounter.prototype.buyStim = function(){
    var encounter = Game.config.events[Game.config.cur_event];
    if(encounter.disposition != 'agressive'){
      if(Person.caps > 0){
        Person.caps = Person.caps - 10;
        Person.stims = Person.stims + 1;        
      }else{
        Logger('You don\'t have enought caps');
      }
    }else{
      Logger('This person won\'t trade with you. His attitude is', encounter.disposition)
    }
  };

  Encounter.prototype.flee = function(){
    var encounter = Game.config.events[Game.config.cur_event];
    if(encounter.disposition == 'agressive'){
      this._enemyAttack();
    }
    Logger('Fleeing');
    Game.next();
    Controls.showEncounter();
  }

  var Weapons = [
    {
      name: 'brass',
      dmg: 3
    },
    {
      name: 'baton',
      dmg: 4
    },
    {
      name: 'sword',
      dmg: 6
    },
    {
      name: 'shocker',
      dmg: 6
    },
  ];

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
      getStatus();
    },
    next: function(){
      this.config.cur_event = this.config.cur_event + 1;
      this.config.daysLeft = this.config.daysLeft - 1;
      if(this.config.daysLeft < 0) Logger('You see rockets launching!');
      Logger(this.config.events[this.config.cur_event].desk + " He is armed with " + this.config.events[this.config.cur_event].inv.weapon.name)
    },

    generateEvents: function(){
      for (var i = 0; i < this.config.distance; i++) {
        var randomNum = getRandomInt(0, Events.length - 2);
        var randomEvent = new Encounter(randomNum);
        randomEvent.inv = {};
        randomEvent.inv.weapon = Weapons[getRandomInt(0, Weapons.length - 1)];
        randomEvent.loot = getRandomInt(1,10);
        this.config.events.push(randomEvent);
      };
      var lastEvent = new Encounter(Events.length-1);
      lastEvent.inv = {}
      lastEvent.inv.weapon = Weapons[Weapons.length - 1];
      this.config.events.push(lastEvent);
    },

    countXp: function (xp) {

      Person.xp = Person.xp + xp;
      Logger('You earned', xp);

      if (Math.floor(Person.xp/1000) >= Person.level){
        Person.att = Person.att + 1;
        Person.max_hp = Person.max_hp + 10;
        Person.cur_hp = Person.max_hp;
        Person.level = Person.level + 1; 
        Logger('Level up! Your level now is', Person.level);
      }

      getStatus();
    },
  };

  var Events = [
    {
      name: 'Bandit',
      disposition: 'agressive',
      cur_hp: 5,
      att: 1,
      def: 10,
      xpVal: 200,
      desk: 'You see wasteland scum, preying on innocent travelers. He is running towards you with a deadly intent.'
    },
    {
      name: 'Mutant',
      disposition: 'agressive',
      cur_hp: 7,
      att: 2,
      def: 12,
      xpVal: 300,
      desk: 'You stumble upon terribly malformed used-to-be-human being. It\'s empty eyes are full hunger.'
    },
    {
      name: 'Trader',
      disposition: 'friendly',
      cur_hp: 10,
      att: 2,
      def: 14,
      xpVal: 400,
      desk: 'A friendly trader on route to your home vault. You can trade with him.'
    },
    {
      name: 'Base Robot',
      disposition: 'agressive',
      cur_hp: 10,
      att: 3,
      def: 14,
      xpVal: 500,
      desk: 'Military robot is aproaching you trying to scan you ID.'
    },
  ];

  var Rest = {
    heal: function(){
        Game.config.daysLeft = Game.config.daysLeft - 1;
        Person.cur_hp = Person.cur_hp + 2;
        Person.cur_hp = Person.cur_hp > Person.max_hp ? Person.max_hp : Person.cur_hp;
        Logger('You feel a little better');

    },
    next: function(){
      Logger('Going forward');
      Game.next();
      Controls.showEncounter();
    },
  };

  var vaultDwellers = [{
    name: 'Plain Joe',
    max_hp: 10,
    cur_hp: 10,
    att: 1,
    def: 10,
    stims: 2,
    caps: 0,
    xp: 0,
    level: 1,
  }];

  var Person = {};

  var Logger = function(message, value){
    $('.js-log').prepend('<p>' + message + ' ' + (value || '') + '</p>');
    getStatus();
  }

  var getStatus = function() {
    var $status = $('.js-status');
    var result = '<p>Days left: ' + Game.config.daysLeft + '</p>' +
      '<p>Current heath: ' + Person.cur_hp + ' hp</p>' + 
      '<p>Attack bonus: ' + Person.att + '</p>' + 
      '<p>Armor class: ' + Person.def + '</p>' + 
      '<p>Stims: ' + Person.stims + '</p>' + 
      '<p>Money: ' + Person.caps + '</p>' + 
      '<p>XP: ' + Person.xp + '</p>' + 
      '<p>Armed with: ' + Person.inv.weapon.name + '</p>';
    $status.html(result)
  }

  var Controls = {
    init: function() {
      $('.js-attack').on('click', function(){
        Game.config.events[Game.config.cur_event].attack()
      });

      $('.js-use-stim').on('click', function(){
        Game.config.events[Game.config.cur_event].useStim();
      });

      $('.js-flee').on('click', function(){
        Game.config.events[Game.config.cur_event].flee();
      })

      $('.js-buy-stim').on('click', function(){
        Game.config.events[Game.config.cur_event].buyStim();
      })

      $('.js-next').on('click', function(){
        Rest.next();
      });

      $('.js-heal').on('click', function(){
        Rest.heal();
      })

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
      $('.js-encounter').hide();
      $('.js-rest').hide();
    },
    showSuccess: function(){
      $('.success').modal('show');
    }
  }

  $('.intro').modal('show').on('click', function(){
    $(this).modal('hide')
    $('.charChoose').modal('show');
  });

  $('.js-charChoose').on('click', function(){
    $('.charChoose').modal('hide');
    var id = $(this).data('char')
    Person = vaultDwellers[id];
    Person.inv = {};
    Person.inv.weapon = Weapons[2]; //sword
    Game.start();
  })


})(jQuery);