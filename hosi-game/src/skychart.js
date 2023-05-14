class SkyChart {
    constructor(scene, x, y, width, height, gridSize = 64) {
        this.scene = scene;
        this.gizmos = new Gizmos(scene);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        this.center = {
            x: this.x + width / 2,
            y: this.y + height / 2
        }

        // #region << CREATE SPAWN POINT GRID >>
        this.rect = this.gizmos.createRect(this.x, this.y, width, height);
        this.points = this.createRectPoints(this.rect, gridSize);

        if (gizmosActive)
        {
            // draw center point
            //this.gizmos.createText(this.x, this.y, "skychart");

            // draw points
            this.drawRectGridPoints(this.points);

            // draw index text
            this.createPointIndexText(this.points.top, 0, -20);
            this.createPointIndexText(this.points.bottom, 0, 20);
            this.createPointIndexText(this.points.right, 20, 0);
            this.createPointIndexText(this.points.left, -20, 0); 
        }

        
    }

    createRectPoints(rect, gridSize = 64) 
    {        
        const rectPoints = {
            allPoints: [],
            top: [],
            bottom: [],
            left: [],
            right: [],
            corners: []
        };

        // left / right
        for (let y = rect.y; y <= rect.y + rect.height; y += gridSize) {
            rectPoints.allPoints.push(new Phaser.Geom.Point(rect.x, y));
            rectPoints.allPoints.push(new Phaser.Geom.Point(rect.x + rect.width, y));
        }

        // top / bottom
        for (let x = rect.x; x <= rect.x + rect.width; x += gridSize) {
            rectPoints.allPoints.push(new Phaser.Geom.Point(x, rect.y));
            rectPoints.allPoints.push(new Phaser.Geom.Point(x, rect.y + rect.height));
        }
        
        // check position of point , and store accordingly
        for (let i = 0; i < rectPoints.allPoints.length; i++) {
            const point = rectPoints.allPoints[i];
        
            // store corners
            if ((point.x === rect.left && point.y === rect.top) ||
                (point.x === rect.right && point.y === rect.top) ||
                (point.x === rect.left && point.y === rect.bottom) ||
                (point.x === rect.right && point.y === rect.bottom)) 
            {
                rectPoints.corners.push(point);
            }
            // store points
            else {
                if (point.y === rect.top) {
                    rectPoints.top.push(point);
                } 
                else if (point.y === rect.bottom) {
                    rectPoints.bottom.push(point);
                }
            
                if (point.x === rect.left) {
                    rectPoints.left.push(point);
                } 
                else if (point.x === rect.right) {
                    rectPoints.right.push(point);
                }  
            }
        }

        // sort the sides
        rectPoints.top.sort((a, b) => a.x - b.x);
        rectPoints.bottom.sort((a, b) => a.x - b.x);
        rectPoints.left.sort((a, b) => a.y - b.y);
        rectPoints.right.sort((a, b) => a.y - b.y);

        return rectPoints;
    }

    drawRectGridPoints(rectPointArrays, pointSize = 10) {
        rectPointArrays.top.forEach(p => this.gizmos.drawCircleFill(p.x, p.y, pointSize, color_pal.toInt("pink")));
        rectPointArrays.bottom.forEach(p => this.gizmos.drawCircleFill(p.x, p.y, pointSize, color_pal.toInt("pink")));
        rectPointArrays.left.forEach(p => this.gizmos.drawCircleFill(p.x, p.y, pointSize, color_pal.toInt("green")));
        rectPointArrays.right.forEach(p => this.gizmos.drawCircleFill(p.x, p.y, pointSize, color_pal.toInt("green")));
        rectPointArrays.corners.forEach(p => this.gizmos.drawCircleFill(p.x, p.y, pointSize, color_pal.toInt("black")));
    }
      
    createPointIndexText(pointsArray, posOffsetX, posOffsetY ) {
        // Loop through the points array and create a text object for each point
        for (let i = 0; i < pointsArray.length; i++) {
          let point = pointsArray[i];
      
          // Create the text object at the position of the point
          this.gizmos.createText(point.x + posOffsetX, point.y + posOffsetY, i.toString());
        }
    }

    drawLineBetweenPoints(startPoint, endPoint, color = 0xffffff, lineWidth = 2, opacity = 1) {
        this.gizmos.drawLine(start, end, color, lineWidth, opacity);
    }
}