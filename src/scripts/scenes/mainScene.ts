import ExampleObject from '../objects/exampleObject';
import { GameObjects } from 'phaser';

export default class MainScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  background: Phaser.GameObjects.TileSprite;
  ship1: Phaser.Physics.Arcade.Sprite;
  ship2: Phaser.Physics.Arcade.Sprite;
  ship3: Phaser.Physics.Arcade.Sprite;
  player: Phaser.Physics.Arcade.Sprite;
  cursorKeys: any;
  scoreLabel: Phaser.GameObjects.BitmapText;
  score: number;
  explosion: Phaser.GameObjects.Sprite;
  explosionSound: Phaser.Sound.BaseSound;
  music: Phaser.Sound.BaseSound;
  jumpSound: Phaser.Sound.BaseSound;
  game_Over: boolean;
  lastScore: number;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.game_Over = false
    this.background = this.add.tileSprite(0, 0, this.sys.game.canvas.width,
      this.sys.game.canvas.height, "background");
    this.background.setOrigin(0, 0);

    this.explosion = this.add.sprite(this.scale.width, this.scale.height, "explosion");
    this.explosion.visible = false;
    this.ship1 = this.physics.add.sprite(this.scale.width, this.scale.height / 3, "ship");
    this.ship2 = this.physics.add.sprite(this.scale.width, this.scale.height / 2, "ship2");
    this.ship3 = this.physics.add.sprite(this.scale.width, this.scale.height / 4, "ship3")

    this.ship1.setGravityY(-400);
    this.ship2.setGravityY(-400);
    this.ship3.setGravityY(-400);

    this.ship1.play("ship1_anim");
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");

    this.ship1.rotation = 1.56;
    this.ship2.rotation = 1.56;
    this.ship3.rotation = 1.56;

    this.score = 0;
    this.scoreLabel = this.add.bitmapText(this.scale.width - 100 , 5, "pixelFont", "SCORE", 16);

    this.jumpSound = this.sound.add("audio_beam");
    this.explosionSound = this.sound.add("audio_explosion");
    this.music = this.sound.add("music");

    var musicConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    }
    this.music.play(musicConfig);


    this.exampleObject = new ExampleObject(this, 0, 0);

    this.player = this.physics.add.sprite(this.scale.width / 2 - 8, this.scale.height - 64, "player");
    this.player.setScale(0.25);
    this.player.play("run");

    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);

  }

  gameOver() {
    this.explosion.x = this.player.x;
    this.explosion.y = this.player.y;
    this.player.y = 10;
    this.player.setGravityY(-400);
    this.player.alpha=0;
    this.explosion.visible = true;
    this.explosion.play("explode");
    this.explosionSound.play();
    let gameoverText = this.add.text(this.scale.width/2, this.scale.height/2, 'Game Over');
    gameoverText.setDepth(1);
    this.game_Over = true;
    this.lastScore = this.score;
  }



  moveShip(ship, speed) {
    ship.x -= speed;
    if (ship.x < 0) {
      this.resetShipPos(ship);
    }
  }

  moveShip3(ship, speed) {
    ship.x -= speed;
    if (ship.x > this.sys.game.canvas.width - 7) {
      ship.visible = false;
    }
    else {
      ship.visible = true;
    }
    if (ship.x < 0) {
      this.time.addEvent({
        delay: 5000,
        callback: () =>
          this.resetShipPos(ship)
      });
    }
  }

  resetShipPos(ship) {
    ship.x = this.sys.game.canvas.width;
    var randomy = Phaser.Math.Between(this.sys.game.canvas.height / 1.5, this.sys.game.canvas.height - 20);
    ship.y = randomy;
  }

  updateScore(score) {
    this.scoreLabel.text = String("SCORE " + score);
  }


  movePlayerManager() {
    if (this.cursorKeys.left.isDown) {
      this.player.setVelocityX(-200);
    }
    else if (this.cursorKeys.right.isDown) {
      this.player.setVelocityX(200);
    }
    else {
      this.player.setVelocityX(0);
    }

    if (this.cursorKeys.up.isDown && this.player.y == 253.25) {
      this.player.setVelocityY(-250);
      this.jumpSound.play();
    }
    if (this.cursorKeys.down.isDown) {
      this.player.setVelocityY(200);
    }
  }

  update() {
    this.moveShip(this.ship1, 1);
    this.moveShip(this.ship2, 2);
    this.moveShip3(this.ship3, 3);

    this.background.tilePositionX += 0.5;
    this.movePlayerManager();
    
    this.physics.overlap(this.player, this.ship1, this.gameOver, undefined, this);
    this.physics.overlap(this.player, this.ship2, this.gameOver, undefined, this);
    this.physics.overlap(this.player, this.ship3, this.gameOver, undefined, this);
    this.updateScore(this.score++);

    if(this.game_Over){
      this.updateScore(this.lastScore);
      this.time.addEvent({
        delay: 2300,
        callback: () =>
        this.scene.start('PreloadScene'),
      });
    }
  }
}
