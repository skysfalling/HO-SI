class GizmoTesting extends Phaser.Scene {
    constructor() {
        super('GizmoTesting');

        // [[ MAIN GIZMOS OBJECT ]]
        this.Gizmos;
        this.speed = 1;

        this.infiniteRot = 0;

        this.infiniteMove = 0;
        this.moveFlip = false;

        this.lineRange = 100;
    }
  
    preload() {

        this.Gizmos = new Gizmos(this);

    }
  
    create() {
        // >> CREATE TEXT GIZMO :: [ scene , x, y, text, fontSize ]
        // this "created" instance will not move
        this.text = this.Gizmos.createText(this.infiniteRot, game.config.height/2, "text1", "50px");

        // >> TOGGLE DEBUG :: //
        const enableRectButton = document.querySelector("#enable-rect");
        // toggle squares
        enableRectButton.innerHTML = "squares: " + this.Gizmos.showRectGizmos;
        enableRectButton.addEventListener("click", () => { 
            this.Gizmos.showRectGizmos = !this.Gizmos.showRectGizmos; 
            enableRectButton.innerHTML = "squares: " + this.Gizmos.showRectGizmos;
        });

        const enableCircleButton = document.querySelector("#enable-circle");
        // toggle squares
        enableCircleButton.innerHTML = "circles: " + this.Gizmos.showCircleGizmos;
        enableCircleButton.addEventListener("click", () => { 
            this.Gizmos.showCircleGizmos = !this.Gizmos.showCircleGizmos; 
            enableCircleButton.innerHTML = "circles: " + this.Gizmos.showCircleGizmos;
        });

        const enableTextButton = document.querySelector("#enable-text");
        enableTextButton.innerHTML = "text: " + this.Gizmos.showTextGizmos;
        enableTextButton.addEventListener("click", () => {
        this.Gizmos.showTextGizmos = !this.Gizmos.showTextGizmos;
        enableTextButton.innerHTML = "text: " + this.Gizmos.showTextGizmos;
        });

        const enableLineRangeButton = document.querySelector("#enable-line-range");
        enableLineRangeButton.innerHTML = "line range: " + this.Gizmos.showLineRangeGizmos;
        enableLineRangeButton.addEventListener("click", () => {
        this.Gizmos.showLineRangeGizmos = !this.Gizmos.showLineRangeGizmos;
        enableLineRangeButton.innerHTML = "line range: " + this.Gizmos.showLineRangeGizmos;
        });

        

    }
  
    update() {

        // >> {{ ALWAYS CLEAR GRAPHICS FIRST }} //
        this.Gizmos.graphics.clear();

        // update infinite move
        if (!this.moveFlip && this.infiniteMove < 1) { this.infiniteMove += 0.01 * this.speed}
        else if (!this.moveFlip && this.infiniteMove >= 1) {this.moveFlip = true; this.infiniteMove = 1;}
        else if (this.moveFlip && this.infiniteMove > 0) {this.infiniteMove -= 0.01 * this.speed;}
        else if (this.moveFlip && this.infiniteMove <= 0) {this.moveFlip = false; this.infiniteMove = 0;}
        //console.log(this.move)

        // update infinite rotation
        if (this.infiniteRot < 360) { this.infiniteRot += this.speed; } else { this.infiniteRot = 0; }
        //console.log(this.rotation)

        // >> DEBUG SLIDER : : // 
        // Get slider percentage from HTML page (( range 0 - 100 ))
        let debugSpeedSlider = document.getElementById('speed-slider');
        this.speed = debugSpeedSlider.value / 10;  // turns slider into percentage
        // Set slider text
        let debugSpeed = document.getElementById('speed-info');
        debugSpeed.innerHTML = "speed " + this.speed;

        

        // ---------------------------------------------------------------------------------------------------

        if (this.Gizmos.showRectGizmos == true)
        {
            //console.log("show rect " + this.Gizmos.showRectGizmos);
            // >> RECT LINE GIZMO :: [ x , y, width, height, rotation , color ]
            this.Gizmos.drawRect(screen.center.x, screen.center.y, 200, 200, this.infiniteRot, color_pal.toInt("green"));

            // >> RECT FILL GIZMO :: [ x , y, width, height, rotation , color ]
            this.Gizmos.drawRectFill(screen.center.x, screen.center.y, 100, 100, -this.infiniteRot, color_pal.toInt("pink"));
        }

        if (this.Gizmos.showCircleGizmos == true)
        {
            this.Gizmos.drawCircle(screen.center.x, screen.center.y, 100, color_pal.toInt("pink"), this.infiniteRot);
        }

        if (this.Gizmos.showLineRangeGizmos)
        {
            // >> LINE RANGE GIZMO :: [ scene , startpoint, endpoint, width, height]
            this.Gizmos.horzlineRange(screen.leftMid.x, screen.rightMid.x, screen.leftMid.y, 50, color_pal.toInt("green"));
            this.Gizmos.vertlineRange(screen.topMid.x, screen.botMid.y, screen.topMid.y, 50, color_pal.toInt("blue"));

            // >> horz update line range
            this.Gizmos.diagonalLineRange(screen.topLeft.x + (this.infiniteMove * screen.width), screen.topLeft.y, screen.botRight.x - (this.infiniteMove * screen.width), screen.botRight.y);
            this.Gizmos.diagonalLineRange(screen.topRight.x - (this.infiniteMove * screen.width), screen.topRight.y, screen.botLeft.x + (this.infiniteMove * screen.width), screen.botLeft.y);

            // >> vert update line range
            this.Gizmos.diagonalLineRange(screen.topRight.x , screen.topRight.y + (this.infiniteMove * screen.height), screen.botLeft.x , screen.botLeft.y - (this.infiniteMove * screen.height), 100, color_pal.toInt("purple"));
            this.Gizmos.diagonalLineRange(screen.topLeft.x , screen.topLeft.y + (this.infiniteMove * screen.height), screen.botRight.x , screen.botRight.y - (this.infiniteMove * screen.height), 100, color_pal.toInt("purple"));

        }

        if (this.Gizmos.showTextGizmos)
        {
            // >> UPDATE TEXT : [ textObject, x, y, text, fontSize ]
            // create() text first, then call this function
            this.text.setVisible(true);
            this.Gizmos.updateText(this.text, this.infiniteRot + screen.center.x / 3, screen.center.y, "hello <3", "40px");
            this.text.depth = 2;
        } else { this.text.setVisible(false);}


    }
}


  