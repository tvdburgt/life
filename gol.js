var grid,
    gridContext;

$(function() {

    $("#grid").click(function(e) {
        toggleCell(e);
    });

    //var grid = document.getElementById("grid");
    grid = $("#grid");
    gridContext = grid[0].getContext("2d");



    $("body").mousedown(function(e) {
        // attach mousemove
    });

    $("body").mouseup(function(e) {
        // detach mousemove
    });

    grid.attr("width", 600);
    grid.attr("height", 300);

    var cellSize = 25;

    var width = grid.width() - (grid.width() % 25) + 0.5;

    console.log(grid.width());
    console.log(width);

    // Vertical lines
    for (var x = 0.5; x < grid.width(); x += 25) {
        gridContext.moveTo(x, 0);
        gridContext.lineTo(x, grid.height());
        gridContext.stroke();        
    };

    // Horizontal lines
    for (var y = 0.5; y < grid.height(); y += 25) {
        gridContext.moveTo(0, y);
        gridContext.lineTo(grid.width(), y);
    };

    gridContext.stroke();

});


function toggleCell(e) {
    var x = e.pageX - grid[0].offsetLeft;
    var y = e.pageY - grid[0].offsetTop;
    
    console.log(x + ", " + y);

    gridContext.fillRect(Math.floor(x / 25) * 25,
                         Math.floor(y / 25) * 25,
                         25,
                         25);
}
