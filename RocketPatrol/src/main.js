/*
Sky Casey
tecasye@ucsc.edu

MOD TITLE : RocketPatrol{UNLEASHED}
Total project time: 25 hours

Mods:
  Speed Increase (5): Every 30 seconds, the level increases and all spaceships move twice as fast.
  Player Control (5): The player can now control the Rocket after firing, using LeftArrow & RightArrow.
  New Title Screen (10): Created a new title screen with original typography & color.
  Animated Spaceship (10): Used a texture atlas to create an animated spaceship enemy with new artwork.
  Time Remaining (10): Added a timer that displays the remaining time (in seconds) on the screen.
  New Spaceship Type (15): Created a new enemy spaceship that is smaller, moves faster, and is worth more points.
  Scoring Mechanism (15): Successfully hitting a spaceship now adds time to the clock.
  Gizmos (15): Implemented gizmos to help with development and debugging.
  World Editor (15): Created a custom tool to visually edit the game world.
    - To use this tool, press the UPARROW when at the main menu.
    - You can fire the rocket with F and move with LEFTARROW and RIGHTARROW.
    - At any point, you can press 'E' to enter edit mode.
        - In edit mode, use LEFTARROW & RIGHTARROW to move the camera, and use 'Z' and 'X' to zoom in/out
        - Press 'E' again to exit edit mode and return to play.
*/


let config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 500,
    resolution: 0.5, // set to 0.5 for half resolution
    parent: 'game-container',
    physics: {
      default: 'arcade',
      arcade: {
          debug: false,
          gravity: { y: 0 }
      }
    },  
    scene: [ Menu, Play, Editor ],
    pixelArt: true
}
const game = new Phaser.Game(config);

// reserve keyboard variables
let keyE, keyF, keyR, keyLEFT, keyRIGHT, keyUP;

// -----  GAME FORMAT ----------------------------------------------------------
// screen points
let screen = {
  center: { 
    x: game.config.width/2, 
    y: game.config.height/2 
  },
  width: game.config.width,
  height: game.config.height,

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

// formatting
let format = {
  margin: 50
}



// border size
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// >> Color Palette
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

let neon_color_pal = {
  pink: "#EF45F5",
  purple: "#7C3CD6"
}

// header config
let headerConfig = {
  fontFamily: 'Courier New',
  fontSize: '30px',
  backgroundColor: color_pal.black,
  color: color_pal.white,
  align: 'center',
  padding: {
      top: 5,
      bottom: 5,
      left: 5,
      right: 5
  },
  fixedWidth: 100
}
