let config = {
    type: Phaser.CANVAS,
    width: 500,
    height: 500,
    parent: 'game-container',
    physics: {
      default: 'arcade',
      arcade: {
          debug: false,
          gravity: { y: 0 }
      }
    },  
    scene: [ GizmoTesting ],
    pixelArt: true
}
const game = new Phaser.Game(config);

let screen = {
    center: { 
      x: game.config.width/2, 
      y: game.config.height/2 
    },
    width: game.config.width,
    height: game.config.height,

    margin: 20,

    topLeft: {
      x: 0,
      y: 0
    },
    topMid: {
      x: game.config.width / 2,
      y: 0
    },
    topRight: {
      x: game.config.width,
      y: 0
    },
    rightMid: {
      x: game.config.width,
      y: game.config.height/2
    },
    botRight: { 
      x: game.config.width, 
      y: game.config.height 
    },
    botMid: {
      x: game.config.width/2,
      y: game.config.height
    },
    botLeft: { 
      x: 0, 
      y: game.config.height 
    },
    leftMid: {
      x: 0,
      y: game.config.height/2
    },
}

let color_pal = {
    pink: "#F6518A",
    orange: "#d45404",
    yellow: "#f9c22b",
    blue: "#4C86A8", 
    green: "#62C25B",
    purple: "#a884f3",
    teal: "#0eaf9b",
    white: "#FFFFFF",
    grey: "#3e3546",
    black: "#101119",
    toInt: function(colorName) {
      return parseInt(this[colorName].replace("#", "0x"));
    }
  };