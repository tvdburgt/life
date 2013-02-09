function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.isPopulated = false;
}


function GameOfLife(canvas) {

    console.log(1);
    var grid = new Grid(canvas);
    console.log(2);


    grid.draw();
}


function Grid(canvas) {


    this.draw = function() {
        console.log("a");
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
