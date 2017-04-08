import device;
import ui.StackView as StackView;

import ui.TextView as TextView;

import ui.ImageView;
import ui.widget.GridView as GridView;
import src.TitleScreen as TitleScreen;


var boundsWidth = 576;
var boundsHeight = 1024;
var baseWidth = boundsWidth;
var baseHeight = device.screen.height * (boundsWidth / device.screen.width); //864
var scale = device.screen.width / baseWidth;
exports = Class(GC.Application, function () {

  this.initUI = function () {
    //scale the root view
    this.view.style.scale = scale;

    var background = new ui.ImageView({
      superview: this.view,
      x: 0,
      y: 0,
      width: baseWidth,
      height: baseHeight,
      image: "resources/images/ui/background.png",
      zIndex: 0
    });

    var grid_padding = 20;
    var gridWidth = baseWidth - (grid_padding * 2);
    var gridHeight = 520;
    var num_rows = 8;
    var num_cols = 8;

    var num_gems = 5;
    var gridview = new GridView({
      superview: background,
      backgroundColor: '#ff0000',
      x: grid_padding,
      y: 320,
      width: gridWidth,
      height: gridHeight,
      cols: num_cols,
      rows: num_rows,
      horizontalGutter: 2,
      verticalGutter: 2,
      autoCellSize: true,
      // hideOutOfRange: true, //Hide any cells outside of the grid
      // showInRange: true     //Make cells in the grid range visible
    });

    var tileViews = []
    for (var col_idx = 0; col_idx < num_cols; col_idx++) {
      for (var row_idx = 0; row_idx < num_rows; row_idx++) {
        var tileType = Math.floor((Math.random() * num_gems) + 1);
        var tileWidth = (gridWidth / num_cols) - 2;
        var tileHeight = (gridHeight / num_rows) - 2;
        tileViews.push(new ui.ImageView({
          superview: gridview,
          row: row_idx,
          col: col_idx,
          image: 'resources/images/gems/gem_0' + tileType + '.png',
          width: tileWidth,
          height: tileHeight,
          x: (tileWidth + 2) * row_idx,
          y: (tileHeight + 2) * col_idx,
        }))
      }
    }


  };

  this.launchUI = function () {

  };

});
