import ExampleObject from '../objects/exampleObject';

export default class MainScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  background: Phaser.GameObjects.TileSprite;
  ship1: Phaser.GameObjects.Sprite;
  ship2: Phaser.GameObjects.Sprite;
  ship3: Phaser.GameObjects.Sprite;
  player: Phaser.Physics.Arcade.Sprite;
  cursorKeys: any;
  scoreLabel: Phaser.GameObjects.BitmapText;
  score: number;
  explosionSound: Phaser.Sound.BaseSound;
  music: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.background = this.add.tileSprite(0, 0, this.sys.game.canvas.width, 
      this.sys.game.canvas.height, "background");
      this.background.setOrigin(0, 0);

    this.ship1 = this.add.sprite(this.scale.width, this.scale.height/3, "ship");
    this.ship2 = this.add.sprite(this.scale.width, this.scale.height/2, "ship2");
    this.ship3 = this.add.sprite(this.scale.width, this.scale.height/4, "ship3")



    

    this.ship1.play("ship1_anim");
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");

    this.ship1.rotation = 1.56;
    this.ship2.rotation = 1.56;
    this.ship3.rotation = 1.56;

    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    this.input.on('gameobjectdown', this.destroyShip, this);

    this.score = 0;
    this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE", 16);

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

    this.player = this.physics.add.sprite(this.scale.width/2 - 8, this.scale.height - 64, "player");
    this.player.setScale(0.25);
    this.player.play("run");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);

    this.physics.overlap(this.player, this.ship1, this.checker);

  }

  checker() {
    console.log("overlap");
  }

  zeroPad(number, size) {
    var stringNumber = String(number);
    while(stringNumber.length , (size || 2)) {
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }




  hitEnemy(projectile, enemy) {


    projectile.destroy();
    this.resetShipPos(enemy);
    this.score += 15;
    var scoreFormated = this.zeroPad(this.score, 6);
    this.scoreLabel.text = "SCORE " + scoreFormated;
    this.explosionSound.play();
  }

  moveShip(ship, speed) {
    ship.x -= speed;
    if(ship.x < 0) {
      this.resetShipPos(ship);
    }
  }

  moveShip3(ship, speed){
    ship.x -= speed;
    if(ship.x > this.sys.game.canvas.width-7){
      ship.visible = false;
    }
    else{
      ship.visible = true;
    }
    if(ship.x < 0){
      this.time.addEvent({
        delay: 5000,
        callback: () =>
        this.resetShipPos(ship)
      });
    }
  }

  resetShipPos(ship) {
    ship.x = this.sys.game.canvas.width;
    var randomy = Phaser.Math.Between(this.sys.game.canvas.height/2, this.sys.game.canvas.height - 20);
    ship.y = randomy;
  }

  endJump() {
    this.player.setVelocityY(100);
  }

  destroyShip(pointer, gameObject) {
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }

  movePlayerManager() {
    if(this.cursorKeys.left.isDown) {
      this.player.setVelocityX(-200);
    }
    else if(this.cursorKeys.right.isDown) {
      this.player.setVelocityX(200);
    }
    else {
      this.player.setVelocityX(0);
    }

    if(this.cursorKeys.up.isDown && this.player.y == 253.25){
      this.player.setVelocityY(-250);
    }
    if(this.cursorKeys.down.isDown) {
      this.player.setVelocityY(200);
    }
  }

  update() {
    this.moveShip(this.ship1, 1);
    this.moveShip(this.ship2, 2);
    this.moveShip3(this.ship3, 3);

    this.background.tilePositionX += 0.5;
    this.movePlayerManager();

  }
}
