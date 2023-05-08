class Gizmos {
    constructor(scene, graphics) {
        this.scene = scene;

        // setup graphics
        if (graphics === undefined) {
            this.graphics = scene.add.graphics();
        }
        else {
            this.graphics = graphics;
        }

        this.showRectGizmos = true;
        this.showCircleGizmos = true;
        this.showTextGizmos = true;
        this.showLineRangeGizmos = true;
    }
  
    // [[ LINE ]]
    line (startpoint, endpoint, color = 0xffffff, lineWidth = 2, opacity = 1) {
        const graphics = this.graphics;
        graphics.lineStyle(lineWidth, color);
        graphics.beginPath();
        graphics.moveTo(startpoint.x, startpoint.y);
        graphics.lineTo(endpoint.x, endpoint.y);
        graphics.closePath();
        graphics.strokePath();
        graphics.depth = 1;
    }

    //#region  [[ CIRCLE ]]
    drawCircle(x, y, radius, color = 0xffffff, rotation = 0, lineWidth = 2, depth = 1) {
        this.circleLayer = this.graphics;

        this.circleLayer.lineStyle(lineWidth, color, lineWidth);
        var circleConfig = new Phaser.Geom.Circle(x, y, radius);
        this.circleLayer.strokeCircleShape(circleConfig);
        this.circleLayer.depth = depth; // ensure circle layer is on top

        let center = { x: x, y: y };
        let radiusPoint = { x: x + radius, y: y };

        const radians = Phaser.Math.DegToRad(rotation);
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        
        radiusPoint.x = x + radius * cos;
        radiusPoint.y = y + radius * sin;
        this.line(center, radiusPoint, color, lineWidth);
    }

    drawCircleFill(x, y, radius, color) {
        this.graphics.fillStyle(color);
        this.graphics.fillCircle(x, y, radius);
    }
    //#endregion

    //#region  [[ RECT ]]
    drawRect(x, y, width, height, rotation = 0, color = 0xffffff, lineWidth = 2) {
        this.graphics.lineStyle(lineWidth, color, 1);

        // [[ SET ORIGIN ( 0.5 , 0.5 ) ]]
        const rectX = x - width / 2;
        const rectY = y - height / 2;

        // calculate rotation angle
        const topLeft = this.rotatePoint(rectX, rectY, x, y, rotation);
        const topRight = this.rotatePoint(rectX + width, rectY, x, y, rotation);
        const bottomRight = this.rotatePoint(rectX + width, rectY + height, x, y, rotation);
        const bottomLeft = this.rotatePoint(rectX, rectY + height, x, y, rotation);


        // console.log("rect center:", rectX, rectY, "\ncorners: ", topLeft, topRight, bottomRight, bottomLeft);

        // draw rect
        this.graphics.beginPath();
        this.graphics.moveTo(topLeft.x, topLeft.y);
        this.graphics.lineTo(topRight.x, topRight.y);
        this.graphics.lineTo(bottomRight.x, bottomRight.y);
        this.graphics.lineTo(bottomLeft.x, bottomLeft.y);
        this.graphics.closePath();
        this.graphics.stroke();
        this.graphics.depth = 1;
    }

    drawRectFill(x, y, width, height, rotation = 0, color = 0xffffff, lineWidth = 2) {
        this.graphics.fillStyle(color, 1);
        this.graphics.lineStyle(lineWidth, color);
        
        // [[ SET ORIGIN ( 0.5 , 0.5 ) ]]
        const rectX = x - width / 2;
        const rectY = y - height / 2;

        // calculate rotation angle
        const topLeft = this.rotatePoint(rectX, rectY, x, y, rotation);
        const topRight = this.rotatePoint(rectX + width, rectY, x, y, rotation);
        const bottomRight = this.rotatePoint(rectX + width, rectY + height, x, y, rotation);
        const bottomLeft = this.rotatePoint(rectX, rectY + height, x, y, rotation);
        
        // draw the rectangle
        this.graphics.beginPath();
        this.graphics.moveTo(topLeft.x, topLeft.y);
        this.graphics.lineTo(topRight.x, topRight.y);
        this.graphics.lineTo(bottomRight.x, bottomRight.y);
        this.graphics.lineTo(bottomLeft.x, bottomLeft.y);
        this.graphics.closePath();
        this.graphics.fill();
        this.graphics.stroke();
    }
    //#endregion

    //#region  [[ LINE RANGE ]] : line from start - end ,  colored lines show height
    horzlineRange(startX, endX, y, heightRange = 50, outerColor = 0xff0000, innerColor = 0xffffff) {
        // [[ MAIN LINE]] 
        this.line({x: startX, y: y}, {x: endX, y: y}, innerColor, 1);

        // [[ RANGE WIDTH ]]
        // draw rect at center point
        let rectX = (startX + endX) / 2;
        this.drawRect(rectX, y, (startX + endX), heightRange, 0, outerColor, 1);

        //console.log("HORZ LINERANGE: " + rectX + " , " + y);
        
        // [[ MID POINT ]]
        // white crossline >>
        const midpointStart = {
            x: (startX + endX) / 2,
            y: y + (heightRange / 2)
        };
        const midpointEnd = {
            x: (startX + endX) / 2,
            y: y - (heightRange / 2)
        };
        this.line(midpointStart, midpointEnd, innerColor, 1);
    }

    vertlineRange(x, startY, endY, widthRange = 50, outerColor = 0xff0000, innerColor = 0xffffff) {
        // [[ MAIN LINE]]
        this.line({x: x, y: startY}, {x: x, y: endY}, innerColor, 1);
    
        // [[ RANGE WIDTH ]]
        // draw rect at center point
        let rectY = (startY + endY) / 2;
        this.drawRect(x, rectY, widthRange, (startY + endY), 0, outerColor, 1);
    
        //console.log("VERT LINERANGE: " + x + " , " + rectY);
    
        // [[ MID POINT ]]
        // white crossline >>
        const midpointStart = {
            x: x + (widthRange / 2),
            y: (startY + endY) / 2
        };
        const midpointEnd = {
            x: x - (widthRange / 2),
            y: (startY + endY) / 2
        };
        this.line(midpointStart, midpointEnd, innerColor, 1);
    }

    diagonalLineRange(startX, startY, endX, endY, widthRange = 50, outerColor = 0xff0000, innerColor = 0xffffff) {
        
        // [[ MAIN LINE]] 
        this.line({x: startX, y: startY}, {x: endX, y: endY}, innerColor, 1);

        // calculate the angle of the main line
        const dx = endX - startX;
        const dy = endY - startY;
        const angle = Math.atan2(dy, dx);

        // calculate the offset for the width lines
        const offset = {
            x: (widthRange / 2) * Math.sin(angle),
            y: (widthRange / 2) * Math.cos(angle)
        };

        // [[ WIDTH LINES]]
        this.line({x: startX + offset.x, y: startY - offset.y}, {x: endX + offset.x, y: endY - offset.y}, outerColor, 1);
        this.line({x: startX - offset.x, y: startY + offset.y}, {x: endX - offset.x, y: endY + offset.y}, outerColor, 1);

        // [[ MID POINT ]]
        const midPoint = {
            x: startX + ((endX - startX) / 2),
            y: startY + ((endY - startY) / 2)
        };
        
        // white crossline >>
        const midLineStart = {
            x: startX + (((endX - startX) / 2) + (widthRange / 2) * Math.sin(angle)),
            y: startY + (((endY - startY) / 2) - (widthRange / 2) * Math.cos(angle))
        };
        const midLineEnd = {
            x: endX - (((endX - startX) / 2) + (widthRange / 2) * Math.sin(angle)),
            y: endY - (((endY - startY) / 2) - (widthRange / 2) * Math.cos(angle)),
        };
        this.line(midLineStart, midLineEnd, innerColor, 1);
        
    }
    //#endregion

    //#region [[ TEXT ]]
    // create or update a text object
    createText(x, y, text = "gizmos", fontSize = 20, angle = 0) {
        var textObject = this.scene.add.text(x, y, text);
        textObject.setOrigin(0.5, 0.5);
        textObject.setVisible(true);
        textObject.setFont(fontSize);
        textObject.setAngle(angle);
        this.scene.add.existing(textObject);
        return textObject;
    }

    // create or update a text object
    updateText(textObject, x, y, text = "gizmos", fontSize = 20, angle = 0) {
        textObject.x = x;
        textObject.y = y;
        textObject.text = text;
        textObject.setAngle(angle);
        textObject.setFont(fontSize);
    }
    //#endregion

    //#region  [[ HELPER ]]
    // rotate point
    rotatePoint(x, y, cx, cy, angle) {
        const radians = angle * (Math.PI / 180);
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
        const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return { x: nx, y: ny };
    }
    //#endregion
}   
