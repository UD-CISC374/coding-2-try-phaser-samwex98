export default class PreloadScene extends Phaser.Scene {
  background: Phaser.GameObjects.Image;
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.image("background", "assets/images/background_platformer.png");
    this.load.spritesheet("ship", "assets/spritesheets/ship.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("ship2", "assets/spritesheets/ship2.png", {
      frameWidth: 32,
      frameHeight: 16
    });
    this.load.spritesheet("ship3", "assets/spritesheets/ship3.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("explosion", "assets/spritesheets/explosion.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("player", "assets/spritesheets/running_man.png", {
      frameWidth: 104,
      frameHeight: 150
    });

    this.load.bitmapFont("pixelFont", "assets/font/font.png", "assets/font/font.xml");

    this.load.audio("audio_beam", ["assets/sounds/beam.ogg", "assets/sounds/beam.mp3"]);
    this.load.audio("audio_explosion", ["assets/sounds/explosion.ogg", "assets/sounds/explosion.mp3"]);
    this.load.audio("music", ["assets/sounds/sci-fi_platformer12.ogg", "assets/sounds/sci-fi_platformer12.mp3"]);
  }

  create() {
    this.background = this.add.image(this.scale.width, this.scale.height, "background");
    this.background.setOrigin(1, 1);
    this.add.text(30, 50, "Alien Invasion", {fontSize: '24px', fill: '0#ffffff'});
    this.add.text(22, 100, "Armed with only your jet boots and",{fontSize: '10px', fill: '0#ffffff'} );
    this.add.text(20, 110, "determination, try and survive the",{fontSize: '10px', fill: '0#ffffff'} );
    this.add.text(20, 120, "alien invasion for as long as you can!", {fontSize: '10px', fill: '0#ffffff'});
    this.add.text(60, 200, "Start Game!", {fill: '0#ffffff'}).setInteractive().on('pointerdown', () => this.scene.start('MainScene'));

    this.anims.create({
      key: "ship1_anim",
      frames: this.anims.generateFrameNumbers("ship", {start: 0, end: 1}),
      frameRate: 20,
      repeat: -1
    });    
    this.anims.create({
      key: "ship2_anim",
      frames: this.anims.generateFrameNumbers("ship2", {start: 0, end: 1}),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "ship3_anim",
      frames: this.anims.generateFrameNumbers("ship3", {start: 0, end: 1}),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion", {start: 0, end: 4}),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    });
    this.anims.create ({
      key: "run",
      frames: this.anims.generateFrameNumbers("player", {start: 0, end: 5}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("player", {start: 12, end: 13})
    });

  }
}
