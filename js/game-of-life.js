function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.isPopulated = false;
    this.wasPopulated = false;

    this.toggle = function() {
        return this.isPopulated = !this.isPopulated;
    }
}

function GameOfLife(canvas) {


    this.settings = {
        colors:  {
            alive:      "red",
            dead:       "white"
        }
    };

    var COLORS = {
        populated: {
            fill:       "orange",
            stroke:     "green"
        },
        unpopulated: {
            fill:       "white",
            stroke:     "black"
        },
        neighbor: {
            fill:       "##C1DDE6",
            stroke:     "black"
        }
    };

    var that = this;
    var grid = new Grid(this, canvas);
    
    // Moore's Neighborhood range r, (2r + 1)^2 - 1 cells
    var neighborhoodRange = 1;
    var timer;
    this.generation = 0;
    this.cells = [];


    for (var y = 0; y < grid.rows; y++) {
        this.cells[y] = [];
        for (var x = 0; x < grid.cols; x++) {
            this.cells[y][x] = new Cell(x, y);
        }
    }

    grid.draw();

    $(canvas).bind("mousedown", onMouseDown);


    function onMouseDown(e) {
        var localX = e.pageX - canvas.offsetLeft;
        var localY = e.pageY - canvas.offsetTop;

        var cell = grid.getCell(localX, localY);

        // Left mouse button
        if (e.which == 1) {
            if (cell != null)
                that.toggleCell(cell, true);
        }

        // Right mouse button
        else if (e.which == 3) {
            return false;
            // cell.isPopulated = false;
            // grid.draw(cell.x, cell.y, 
        }
    }


    function getNeighborCount(cell, currentState) {

        // if (populatedOnly == undefined)
        //     populatedOnly = true;

        var neighbors = [];
        var count = 0;

        // Iterate neighbors
        for (var y = cell.y - neighborhoodRange; y <= cell.y + neighborhoodRange; y++) {

            // if (y < 0 || y >= grid.rows)
            //     break;

            var yWrapped = ((y % grid.rows) + grid.rows) % grid.rows;

            for (var x = cell.x - neighborhoodRange; x <= cell.x + neighborhoodRange; x++) {

                // if (x < 0 || x >= grid.cols)
                //     break;

                var xWrapped = ((x % grid.cols) + grid.cols) % grid.cols;
                var neighbor = that.cells[yWrapped][xWrapped];

                // if (populatedOnly && !neighbor.wasPopulated)
                //     continue;


                var isPopulated = currentState ? neighbor.isPopulated : neighbor.wasPopulated;

                if (isPopulated && cell != neighbor)
                    count++;
            }
        }

        return count;
    }


    // private?
    this.toggleCell = function(cell, redraw) {
        var isPopulated = cell.toggle();

        if (redraw) {
            drawCell(cell);
        }
    };

    function drawCell(cell) {
        if (cell.isPopulated)
            grid.drawCell(cell, COLORS.populated.fill, COLORS.populated.stroke);
        else
            grid.drawCell(cell, COLORS.unpopulated.fill, COLORS.unpopulated.stroke);
    }

    this.step = function() {

        this.generation++;


        // Backup population states
        for (var y = 0; y < grid.rows; y++) {
            for (var x = 0; x < grid.cols; x++) {
                var cell = this.cells[y][x];
                cell.wasPopulated = cell.isPopulated;



            }
        }

        for (var y = 0; y < grid.rows; y++) {
            for (var x = 0; x < grid.cols; x++) {
                var cell = this.cells[y][x];
                var count = getNeighborCount(cell, false);

                // Starvation or overpopulation
                if (cell.isPopulated && (count < 2 || count > 3)) {
                    this.toggleCell(cell, false);
                    // console.log("clearing (%d, %d) => %d neighbours", cell.x, cell.y, count);
                }

                // Reproduction
                else if (!cell.isPopulated && count == 3) {
                    this.toggleCell(cell, false);
                     // console.log("filling (%d, %d) => %d neighbours", cell.x, cell.y, count);
                }
            }
        }

        for (var y = 0; y < grid.rows; y++) {
            for (var x = 0; x < grid.cols; x++) {

                var cell = this.cells[y][x];

                drawCell(cell);

                // if (cell.isPopulated) {
                //     grid.drawCell(cell.x, cell.y, "orange", "green");
                // }

                // else {

                //     var count = getNeighborCount(cell, true);

                //     // hasneighbors => only need count!
                //     if (count > 0)
                //         grid.drawCell(cell.x, cell.y, "#C1DDE6", "black");
                //     else
                //         grid.drawCell(cell.x, cell.y, "white", "black");

                // }
            }
        }
    }

    this.start = function() {
        that.step();
        setTimeout(that.start, 200);
    }
}

function Grid(game, canvas) {
    var cellSize = 20;
    var context = canvas.getContext("2d");

    this.rows = Math.floor((canvas.height - 0.5) / cellSize);
    this.cols = Math.floor((canvas.width - 0.5) / cellSize);

    // Grid dimension in cells
    var width = cellSize * this.cols;
    var height = cellSize * this.rows;

    // Calculate offsets (this will be used to center the grid)
    var yOffset = Math.floor((canvas.height - height - 1) / 2) + 0.5;
    var xOffset = Math.floor((canvas.width - width - 1) / 2) + 0.5;


    this.draw = function() {

        // Horizontal lines
        for (var y = 0; y <= this.rows; y++) {
            context.moveTo(xOffset, y * cellSize + yOffset);
            context.lineTo(width + xOffset, y * cellSize + yOffset);
            context.stroke();
        }

        // Vertical lines
        for (var x = 0; x <= this.cols; x++) {
            context.moveTo(x * cellSize + xOffset, yOffset);
            context.lineTo(x * cellSize + xOffset, height + yOffset);
            context.stroke();
        }
    };

    this.drawCell = function(cell, fillColor, strokeColor) {
        var x = cell.x * cellSize + xOffset;
        var y = cell.y * cellSize + yOffset;

        context.fillStyle = fillColor;
        context.fillRect(x, y, cellSize, cellSize);

        context.strokeStyle = strokeColor;
        context.strokeRect(x, y, cellSize, cellSize);
    };

    this.getCell = function(x, y) {

        x = (x - xOffset) / cellSize;
        y = (y - yOffset) / cellSize;

        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows)
            return null;

        return game.cells[Math.floor(y)][Math.floor(x)];
    }
}


function Grid_(canvas) {

    // Represents cells by using a 2D bool array
    var cells = [];
    var that = this;
    var cellSize = 25;
    var neighborhoodRange = 1;
    var context = canvas.getContext("2d");
    var timerId;

    var cellColor = "black";
    var neighborhoodColor = "";

    var currentCell;

    this.tickCount = 0;
    this.delay = 500;


    context.fillStyle = cellColor;
    context.strokeStyle = "#8C8C8C";


    $(document).mousedown(function(e) {
        onMouseMove(e);
        $(this).bind("mousemove", onMouseMove);
    });

    $(document).mouseup(function(e) {
        $(this).unbind("mousemove", onMouseMove);
    });

    function onMouseMove(e) {
        if (e.target != canvas)
            return;

        console.count();

        var x = Math.floor((e.pageX - canvas.offsetLeft) / cellSize);
        var y = Math.floor((e.pageY - canvas.offsetTop) / cellSize);

        if (x != currentCell.x || y != currentCell.y) {
            currentCell = { x: x, y: y };
            that.toggle(x, y);
        }
    }

    function isPopulated(x, y) {
        return cells[y, x];
    }

    this.init = function() {
        var xCellCount = Math.floor(canvas.width / cellSize);
        var yCellCount = Math.floor(canvas.height / cellSize);

        // + 2 margin adden!!
        for (var y = 0; y < yCellCount; y++) {
            cells[y] = [];
            for (var x = 0; x < xCellCount; x++) {
                cells[y][x] = false;
            }
        }
    }

    this.draw = function() {
        var width = cellSize * cells[0].length;
        var height = cellSize * cells.length;

        // Horizontal lines
        for (var y = 0; y <= cells.length; y++) {
            context.moveTo(0, y * cellSize + 0.5);
            context.lineTo(width, y * cellSize + 0.5);
            context.stroke();
        };

        // Vertical lines
        for (var x = 0; x <= cells[0].length; x++) {
            context.moveTo(x * cellSize + 0.5, 0);
            context.lineTo(x * cellSize + 0.5, height);
        };

        context.stroke();
    }

    // Toggles a cell, optionally takes a 2D array of cells as parameter
    this.toggle = function(x, y, cells_) {
        if (cells_ !== undefined) {
            var isPopulated = !cells_[y][x];
            cells_[y][x] = isPopulated;
        }
        else {
            var isPopulated = !cells[y][x];
            cells[y][x] = isPopulated;
        }

        console.log("(%d, %d) => %b", x, y, isPopulated);

        if (isPopulated)
            context.fillRect(cellSize * x + 1,
                             cellSize * y + 1,
                             cellSize - 1,
                             cellSize - 1);
        else
            context.clearRect(cellSize * x + 1,
                              cellSize * y + 1,
                              cellSize - 1,
                              cellSize - 1);
    }

    this.getNeighbourCount = function(x, y) {
        var count = 0;

        // Iterate over all neighbours
        for (var x_ = x - neighborhoodRange; x_ >= 0 && x_ < cells[0].length && x_ <= x + neighborhoodRange; x_++) {
            for (var y_ = y - neighborhoodRange; y_ >= 0 && y_ < cells.length && y_ <= y + neighborhoodRange; y_++) {
                //console.log("(%d, %d)", x_, y_);
                // Skip current cell
                if (x_ == x && y_ == y)
                    continue;

                if (cells[y_][x_])
                    count++;
            }
        }

        return count;
    }

    this.tick = function() {
        // Make deep copy of cells
        var cells_ = $.extend(true, [], cells);


        for (var y = 0; y < cells.length; y++) {
            for (var x = 0; x < cells[y].length; x++) {

                
                //console.log("(%d, %d) => %b", x, y, cells[y][x]);
                var count = that.getNeighbourCount(x, y);

                // Cell is underpopulated or overpopulated, kill it!
                if (cells[y][x] && (count < 2 || count > 3)) {
                    that.toggle(x, y, cells_);
                    console.log("clearing (%d, %d) => %d neighbours", x, y, count);
                }

                else if (!cells[y][x] && count == 3) {
                    that.toggle(x, y, cells_);
                    console.log("filling (%d, %d) => %d neighbours", x, y, count);
                }

            };
        };

        // Reassign cells
        cells = cells_;
        //console.log(that.toString());
    }

    this.start = function() {
        that.tick();
        timerId = setTimeout(that.start, that.delay);
    }

    this.stop = function() {
        clearTimeout(timerId);
    }

    this.toString = function() {
        var log = "";

        for (var y = 0; y < cells.length; y++) {
            for (var x = 0; x < cells[y].length; x++) {
                log += cells[y][x] ? "[x]" : "[ ]";
            };
            log += "\n";
        };

        return log;
    }

    this.getPopulation = function() {
        var population = 0;

        for (var y = 0; y < cells.length; y++) {
            for (var x = 0; x < cells[y].length; x++) {
                if (cells[y][x])
                    population++;
            };
        };

        return population;
    }
}
