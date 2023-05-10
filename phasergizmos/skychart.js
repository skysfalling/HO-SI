class SkyChart {
    constructor(scene, x, y, width, height, gridSize = 64) {
        this.scene = scene;
        this.graphics = scene.add.graphics();
        this.graphics.setDepth(2);
        this.gizmos = new Gizmos(scene, this.graphics);


        this.showPoints = true;
        this.showLines = true;
        this.showPointIndex = true;
        
        // #region << CREATE SPAWN POINT GRID >>
        this.rect = new Phaser.Geom.Rectangle(x - width / 2, y - height / 2, width, height);
        this.spawnGridPoints = this.createRectPoints(this.rect, gridSize);

        this.drawRectGridPoints(this.spawnGridPoints);

        this.createPointIndexText(this.spawnGridPoints.top, 0, -20);
        this.createPointIndexText(this.spawnGridPoints.bottom, 0, 20);
        this.createPointIndexText(this.spawnGridPoints.right, 20, 0);
        this.createPointIndexText(this.spawnGridPoints.left, -20, 0);

    }

    createRectPoints(rect, gridSize = 64) 
    {
        const points = Phaser.Geom.Rectangle.GetPoints(rect, gridSize);
        const pointArrays = {
            allPoints: points,
            top: [],
            bottom: [],
            left: [],
            right: [],
            corners: []
        };

        // check position of point , and store accordingly
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
        
            if (point.y === rect.top) {
                pointArrays.top.push(point);
            } 
            else if (point.y === rect.bottom) {
                pointArrays.bottom.push(point);
            }
        
            if (point.x === rect.left) {
                pointArrays.left.push(point);
            } 
            else if (point.x === rect.right) {
                pointArrays.right.push(point);
            }
        
            if ((point.x === rect.left && point.y === rect.top) ||
                (point.x === rect.right && point.y === rect.top) ||
                (point.x === rect.left && point.y === rect.bottom) ||
                (point.x === rect.right && point.y === rect.bottom)) {
                pointArrays.corners.push(point);
            }
        }

        // sort the sides
        pointArrays.top.sort((a, b) => a.x - b.x);
        pointArrays.bottom.sort((a, b) => b.x - a.x);
        pointArrays.left.sort((a, b) => b.y - a.y);
        pointArrays.right.sort((a, b) => a.y - b.y);

        return pointArrays;
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

    

    drawRectGridLines(x, y, width, height, color = 0xffffff, lineWidth = 2, opacity = 1, gridSize = 64) {
        const rect = new Phaser.Geom.Rectangle(x - width / 2, y - height / 2, width, height);
    
        if (gridSize > 0) {

            // get points
            const points = Phaser.Geom.Rectangle.GetPoints(rect, gridSize);
            const midX = x - width / 2 + width / 2;
            const midY = y - height / 2 + height / 2;
    
            // Draw horizontal lines
            for (let i = 0; i < points.length; i++) {
                const start = points[i];
                const end = new Phaser.Geom.Point(start.x + width, start.y);
    
                if (start.y == midY) {
                    this.drawLine(start, end, color, lineWidth, opacity);
                }
            }
    
            // Draw vertical lines
            for (let i = 0; i < points.length; i++) {
                const start = points[i];
                const end = new Phaser.Geom.Point(start.x, start.y + height);
    
                if (start.x == midX) {
                    this.drawLine(start, end, color, lineWidth, opacity);
                }
            }
        }
    }
    
}