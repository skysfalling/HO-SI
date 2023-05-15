class UI {
    constructor(scene, waves) {
      this.scene = scene;
      this.camera = scene.cameras.main;
      this.graphics = scene.add.graphics();
      this.graphics.setDepth(depthLayers.ui);
      this.scene.events.on('update', this.update, this);
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
        fontSize: 40,
        color: color_pal.white,
        align: 'right',
        padding: 5,
        fixedWidth: 0,
      }



      this.create();
      this.scene.events.on('update', this.update, this);
    }
  // create all UI elements & sprites
  create() {

    // Start loading the assets
    this.scene.load.start();

    this.scoreText = this.createText(0, 0, "Score " , this.headerConfig);

    // Create text elements for each ship type count
    this.greenShipCount = this.createText(0, format.margin * 2, "Snakeship: ", this.defaultTextStyle);
    this.orangeShipCount = this.createText(0, format.margin * 3, "Spaceship: ", this.defaultTextStyle);
    this.purpleShipCount = this.createText(0, format.margin * 4, "Asteroid: ", this.defaultTextStyle);

  }

  // update specific text based on game values
  update() {
    this.graphics.clear();
    this.updateText(this.scoreText, screen.width - format.margin*2, format.margin, "Score: " + this.waves.score, this.headerConfig);

    this.updateText(this.greenShipCount, format.margin, format.margin * 2, `${this.waves.greenShips.count}`, this.defaultTextStyle);
    this.updateText(this.orangeShipCount, format.margin*2, format.margin * 2, `${this.waves.orangeShips.count}`, this.defaultTextStyle);
    this.updateText(this.purpleShipCount, format.margin*3, format.margin * 2, `${this.waves.purpleShips.count}`, this.defaultTextStyle);

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
  
  updateText(textObject, x, y, text = "gizmos", textConfig = {}) {            
    if (!textObject) {
      console.error("No text object");
      return;
    }
  
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
  
    textObject.x = x;
    textObject.y = y;
    textObject.text = text;
    textObject.setStyle(finalConfig);
    textObject.setVisible(this.visible);
  }
  
//#endregion

  }