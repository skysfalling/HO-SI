class UI {
    constructor(scene, waves) {
      this.scene = scene;
      this.camera = scene.cameras.main;
      this.graphics = scene.add.graphics();
      this.graphics.setDepth(depthLayers.ui);
      this.scene.events.on('update', this.staggeredUpdate, this);
      this.visible = true;

      this.waves = waves;

      this.headerConfig = {
        fontFamily: 'Courier New',
        fontSize: '30px',
        backgroundColor: color_pal.black,
        color: color_pal.white,
        align: 'center',
        padding: {
            top: 5,
            bottom: 5,
            left: 5,
            right: 20
        },
        fixedHeight: 0,
        fixedWidth: 0
      }
      
      // menu text configuration
      this.defaultTextStyle = {
        fontFamily: 'Courier New',
        fontSize: 25,
        color: color_pal.white,
        align: 'right',
        padding: 5,
        fixedWidth: 0,
      }

      this.create();
    }
  // create all UI elements & sprites
  create() {

    // Start loading the assets
    this.scene.load.start();

    this.scoreText = this.createText(0, 0, "Score " , this.headerConfig);
    this.waveText = this.createText(0, 0, "Wave " , this.headerConfig);

    this.tip = this.createText(screen.width - format.margin*3, format.margin * 2, "F to fire Rocket " , this.defaultTextStyle);

    this.tip2 = this.createText(screen.width - format.margin*3, format.margin * 3, "D to dodge " , this.defaultTextStyle);



    // Create text elements for each ship type count
    this.greenShipCount = this.createText(0, format.margin * 2, "0: ", this.defaultTextStyle);
    //this.orangeShipCount = this.createText(0, format.margin * 3, "0: ", this.defaultTextStyle);
    //this.purpleShipCount = this.createText(0, format.margin * 4, "0: ", this.defaultTextStyle);


    // 
      this.scene.time.addEvent({
        delay: 1000,
        callback: () => {
          this.staggeredUpdate();
        },
        loop: true
    });

  }

  // update specific text based on game values
  staggeredUpdate() {

    if (this.scene && this.scene.waveState && this.scene.currWaveState == this.scene.waveState.UPDATE)
    {
      this.scoreText.setText("Score: " + this.waves.score);
      this.scoreText.setPosition(screen.width / 2, format.margin);
  
      this.waveText.setText("Wave: " + this.waves.level);
      this.waveText.setPosition(screen.width - format.margin*2, format.margin);
  
      if (this.greenShipCount != null)
      {
        this.updateText(this.greenShipCount, format.margin, format.margin * 2, `${this.scene.greenShipsConfig.currLifeCount}`);
      }
      //this.updateText(this.orangeShipCount, format.margin*2, format.margin * 2, `${this.scene.orangeShipsConfig.currCount}`);
      //this.updateText(this.purpleShipCount, format.margin*3, format.margin * 2, `${this.scene.purpleShipsConfig.currCount}`);
    }

  }

    //#region [[ TEXT ]]
  // create or update a text object
  createText(x, y, text = "gizmos", textConfig = {}) {        
    if (!this.visible) return;
  
    const defaultConfig = {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff',
      align: 'left',
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      fixedWidth: 0
    };

    const finalConfig = { ...defaultConfig, ...textConfig };
  
    const textObject = this.scene.add.text(x, y, text, finalConfig);
    textObject.setOrigin(0.5, 0.5);
    textObject.setVisible(this.visible);
    textObject.setScrollFactor(0);
    this.scene.add.existing(textObject);
    return textObject;
  }
  
  updateText(textObject, x, y, text = "gizmos") {            
    if (!textObject || !text) {
      console.error("No text object");
      return;
    }
  
    const defaultConfig = {
      fontFamily: 'Arial',
      fontSize: '30px',
      color: '#ffffff',
      align: 'left',
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      fixedWidth: 0
    };
  
  
    textObject.x = x;
    textObject.y = y;
    textObject.text = text;
    textObject.setVisible(this.visible);
  }
  
//#endregion

  }