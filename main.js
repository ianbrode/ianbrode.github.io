var app = new PIXI.Application(1260, 710);
document.body.appendChild(app.view);

// app.stop();

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

var Resource = PIXI.loaders.Resource;
Resource.setExtensionLoadType("wav", Resource.LOAD_TYPE.XHR);
Resource.setExtensionLoadType("mp3", Resource.LOAD_TYPE.XHR);
Resource.setExtensionLoadType("ogg", Resource.LOAD_TYPE.XHR);
Resource.setExtensionLoadType("webm", Resource.LOAD_TYPE.XHR);

PIXI.loader
  .add('./assets/start.png')
  .add('./assets/button.png')
  .add('./assets/lose.png')
  .add('./assets/win.png')
  .add('./assets/play.png')
  .add('./assets/rocket.png')
  .add('./assets/again.png')
  .add('./assets/health.png')
  .add('./assets/lost_health.png')
  .add('./assets/od.png')
  .add('./assets/vk.png')
  .add('./assets/fb.png')

  .add({name:"game", url:"./sounds/game.mp3"})
  .add({name:"win", url:"./sounds/win.mp3"})
  .add({name:"lose", url:"./sounds/lose.mp3"})
  .add({name:"gethit", url:"./sounds/gethit.mp3"})
  .add({name:"throw", url:"./sounds/throw.mp3"})
  .add({name:"throw2", url:"./sounds/throw2.mp3"})

  .add('spritesheet', './assets/mc.json')
  .load(setup);

var start = new PIXI.Container();
var play = new PIXI.Container();
var lose = new PIXI.Container();
var win = new PIXI.Container();

var icon = new PIXI.Container();
var healthBar = new PIXI.Container();

var gamePlayMusic;
var loseMusic;
var winMusic;
var throwMusic;
var throw2Music;
var getHitMusic;

var rockets = [];
var explosionTextures = [];
var speed = 3;
var id = 1;
var counter = 0;
var spawnRate = 99;
var healthAmount = 6;
var healtRockets = [];
var basicText;
var target = {x: 601, y: 390};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loseGame() {
  lose.visible = true;
  start.visible = false
  play.visible = false;
  win.visible = false;
  loseMusic.play();
}

function winGame() {
  lose.visible = false;
  start.visible = false
  play.visible = false;
  win.visible = true;
  winMusic.play();
}

function startGame() {
  start.visible = false;
  lose.visible = false;
  win.visible = false;
  play.visible = true;
  gamePlayMusic.play();
  makeRocket();
  gamePlayMusic.play();
}

function rocketExplode(e) {
  var explosion = new PIXI.extras.AnimatedSprite(explosionTextures);
   explosion.x = e.data.global.x;
   explosion.y = e.data.global.y;
   explosion.anchor.set(0.5);
   explosion.rotation = Math.random() * Math.PI;
   explosion.scale.set(0.75 + Math.random() * 0.5);
   explosion.loop = false;
   explosion.gotoAndPlay(1);
   explosion.onComplete = function() {
     play.removeChild(explosion);
   }
   play.addChild(explosion);
}

function makeRocket() {
  var rocket = new PIXI.Sprite(
    PIXI.loader.resources["./assets/rocket.png"].texture
  );

  rocket.x = Math.random() * app.renderer.width;
  rocket.y = 0;

  if(rocket.x < 200) {
    rocket.rotation = Math.PI * 2 * -0.18;
  } else if ((rocket.x > 200) && (rocket.x < 400)) {
    rocket.rotation = Math.PI * 2 * -0.09;
  } else if ((rocket.x > 800) && (rocket.x < 1000)) {
    rocket.rotation = Math.PI * 2 * 0.09;
  } else if ((rocket.x > 1000)) {
    rocket.rotation = Math.PI * 2 * 0.18;
  }

  var speed = 2;
  var dx = (rocket.x - target.x);
  var dy = (rocket.y - target.y);
  var mag = Math.sqrt(dx * dx + dy * dy);

  rocket.vx = (dx / mag) * -speed;
  rocket.vy = (dy / mag) * -speed;

  rocket.id = id++;
  rocket.anchor.set(1, 0.5);
  rocket.interactive = true;
  rocket.buttonMode = true;
  rocket.on('pointerdown', function(e) {
    play.removeChild(rocket);
    rocketExplode(e);
    rockets.forEach(function(r, i) {
      if (r.id === rocket.id) rockets.splice(i, 1);
    });
    if (counter === 54) playDead(true);
    Math.round(Math.random()) ? throwMusic.play() : throw2Music.play();
  });
  rockets.push(rocket);
  play.addChild(rocket);
  counter += 1;
  basicText.setText('' + counter + '/54');
}

function playDead(win) {
  win ? winGame() : loseGame();
  gamePlayMusic.stop();
  app.ticker.stop();
  app.ticker.update();
}

function reStart() {
  loseMusic.stop();
  winMusic.stop();
  rockets.forEach(function(r){ play.removeChild(r) });
  healtRockets.forEach(function(r) {
    r.setTexture(PIXI.loader.resources["./assets/lost_health.png"].texture)
  })
  rockets = [];
  id = 1;
  counter = 0;
  healthAmount = 6;
  app.ticker.start();
  startGame();
}

function setHealth() {
  healtRockets.forEach(function(r, i) {
    if (i < (6 - healthAmount)) {
      r.setTexture(PIXI.loader.resources["./assets/health.png"].texture)
    }
  })
}

function moveRocket(r) {
  r.x += r.vx;
  r.y += r.vy;
}

function setup() {
  for (var i = 0; i < 26; i++) {
    var texture = PIXI.Texture.fromFrame('Explosion_Sequence_A ' + (i+1) + '.png');
    explosionTextures.push(texture);
  }

  gamePlayMusic = PIXI.audioManager.getAudio('game');
  loseMusic = PIXI.audioManager.getAudio('lose');
  winMusic = PIXI.audioManager.getAudio('win');
  throwMusic = PIXI.audioManager.getAudio('throw');
  throw2Music = PIXI.audioManager.getAudio('throw2');
  getHitMusic = PIXI.audioManager.getAudio('gethit');

  var startBackground = new PIXI.Sprite(
    PIXI.loader.resources["./assets/start.png"].texture
  );
  startBackground.width = app.renderer.width;
  startBackground.height = app.renderer.height;
  start.addChild(startBackground);

  var startButton = new PIXI.Sprite(
    PIXI.loader.resources["./assets/button.png"].texture
  );
  startButton.x = 714;
  startButton.y = 473;
  startButton.interactive = true;
  startButton.buttonMode = true;
  startButton.on('pointerdown', startGame);
  start.addChild(startButton);

  healthBar.x = 527;
  healthBar.y = 630;
  for (var j = 0; j < 6; j++) {
    var health = new PIXI.Sprite(
      PIXI.loader.resources['./assets/lost_health.png'].texture
    );
    health.x = j * 40;
    healtRockets.push(health);
    healthBar.addChild(health);
  }

  icon.x = 1100;
  icon.y = 62;
  var rocketIcon = new PIXI.Sprite(
    PIXI.loader.resources["./assets/health.png"].texture
  );
  var str = '' + counter + '/54';
  basicText = new PIXI.Text(str, new PIXI.TextStyle({fontSize: 36, fill: '#ffffff'}));
  basicText.x = 50;
  basicText.y = 10;
  icon.addChild(rocketIcon);
  icon.addChild(basicText);

  var playBackground = new PIXI.Sprite(
    PIXI.loader.resources['./assets/play.png'].texture
  );
  playBackground.width = app.renderer.width;
  playBackground.height = app.renderer.height;
  play.visible = false;
  play.addChild(playBackground);
  play.addChild(healthBar);
  play.addChild(icon);

  var loseBackground = new PIXI.Sprite(
    PIXI.loader.resources['./assets/lose.png'].texture
  );
  loseBackground.width = app.renderer.width;
  loseBackground.height = app.renderer.height;
  lose.visible = false;
  lose.addChild(loseBackground);

  var loseVk = new PIXI.Sprite(
    PIXI.loader.resources["./assets/vk.png"].texture
  );
  loseVk.x = 524;
  loseVk.y = 618;
  loseVk.interactive = true;
  loseVk.buttonMode = true;
  loseVk.on('pointerdown', function() {
    document.getElementById('vk_lose').click()
  });

  var loseFb = new PIXI.Sprite(
    PIXI.loader.resources["./assets/fb.png"].texture
  );
  loseFb.x = 614
  loseFb.y = 618
  loseFb.interactive = true;
  loseFb.buttonMode = true;
  loseFb.on('pointerdown', function() {
    document.getElementById('fb_lose').click()
  });

  var loseOk = new PIXI.Sprite(
    PIXI.loader.resources["./assets/od.png"].texture
  );
  loseOk.x = 704
  loseOk.y = 618
  loseOk.interactive = true;
  loseOk.buttonMode = true;
  loseOk.on('pointerdown', function() {
    document.getElementById('ok_lose').click()
  });

  var loseButton = new PIXI.Sprite(
    PIXI.loader.resources["./assets/again.png"].texture
  );
  loseButton.x = 443;
  loseButton.y = 528;
  loseButton.interactive = true;
  loseButton.buttonMode = true;
  loseButton.on('pointerdown', reStart);
  lose.addChild(loseButton);
  lose.addChild(loseVk);
  lose.addChild(loseFb);
  lose.addChild(loseOk);

  var winBackground = new PIXI.Sprite(
    PIXI.loader.resources['./assets/win.png'].texture
  );
  winBackground.width = app.renderer.width;
  winBackground.height = app.renderer.height;
  win.visible = false;
  win.addChild(winBackground);

  var winVk = new PIXI.Sprite(
    PIXI.loader.resources["./assets/vk.png"].texture
  );
  winVk.x = 524;
  winVk.y = 618;
  winVk.interactive = true;
  winVk.buttonMode = true;
  winVk.on('pointerdown', function() {
    document.getElementById('vk_win').click()
  });

  var winFb = new PIXI.Sprite(
    PIXI.loader.resources["./assets/fb.png"].texture
  );
  winFb.x = 614
  winFb.y = 618
  winFb.interactive = true;
  winFb.buttonMode = true;
  winFb.on('pointerdown', function() {
    document.getElementById('fb_win').click()
  });

  var winOk = new PIXI.Sprite(
    PIXI.loader.resources["./assets/od.png"].texture
  );
  winOk.x = 704
  winOk.y = 618
  winOk.interactive = true;
  winOk.buttonMode = true;
  winOk.on('pointerdown', function() {
    document.getElementById('ok_win').click()
  });

  var winButton = new PIXI.Sprite(
    PIXI.loader.resources["./assets/again.png"].texture
  );
  winButton.x = 443;
  winButton.y = 528;
  winButton.interactive = true;
  winButton.buttonMode = true;
  winButton.on('pointerdown', reStart);
  win.addChild(winButton);
  win.addChild(winOk);
  win.addChild(winFb);
  win.addChild(winVk);

  app.stage.addChild(start);
  app.stage.addChild(play);
  app.stage.addChild(lose);
  app.stage.addChild(win);

  app.ticker.add(function() {
    if ((getRandomInt(1, 100) > spawnRate) && counter <= 54) makeRocket();

    rockets.forEach(function(rocket, i) {
      if (rocket.y < 350) {
        moveRocket(rocket)
      } else {
        getHitMusic.play();
        rocketExplode({ data: { global: { x: rocket.x, y: rocket.y } } } );
        play.removeChild(rocket);
        rockets.splice(i, 1);
        healthAmount -= 1;
        setHealth();
        if (healthAmount < 0) playDead(false);
        if (counter === 54 && !(healthAmount < 0)) playDead(true);
      }
    });
  });
}
