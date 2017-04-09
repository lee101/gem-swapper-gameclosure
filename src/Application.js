import device;
import ui.StackView as StackView;

import ui.TextView as TextView;

import ui.ImageView;
import ui.widget.GridView as GridView;
import animate;
import src.fixtures as fixtures;


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


    var level = {}
    var grid_padding = 20;
    level.gridWidth = baseWidth - (grid_padding * 2);
    level.gridHeight = 520;
    level.num_rows = 8;
    level.num_cols = 8;

    var num_gems = 5;
    var gridview = new GridView({
      superview: background,
      x: grid_padding,
      y: 320,
      width: level.gridWidth,
      height: level.gridHeight,
      cols: level.num_cols,
      rows: level.num_rows,
    });

    function isNeighboringTile(tile1, tile2) {
      var xDifference = Math.abs(tile1._opts.row - tile2._opts.row);
      var yDifference = Math.abs(tile1._opts.col - tile2._opts.col);
      return (xDifference == 1 && yDifference == 0) || (xDifference == 0 && yDifference == 1);
    }

    function find_three_or_more_vertical_from(tile) {
      var foundTiles = [tile];
      for (var i = tile._opts.col - 1; i >= 0; i--) {
        var currentTile = tileViews[i][tile._opts.row];
        if (currentTile._opts.tileType == tile._opts.tileType) {
          foundTiles.push(currentTile)
        }
        else {
          break;
        }
      }
      for (var i = tile._opts.col + 1; i < level.num_cols; i++) {
        var currentTile = tileViews[i][tile._opts.row];
        if (currentTile._opts.tileType == tile._opts.tileType) {
          foundTiles.push(currentTile)
        }
        else {
          break;
        }
      }
      if (foundTiles.length >= 3) {
        return foundTiles;
      }
      return [];
    }
    function find_three_or_more_horizontal_from(tile) {
      var foundTiles = [tile];
      for (var i = tile._opts.row - 1; i >= 0; i--) {
        var currentTile = tileViews[tile._opts.col][i];
        if (currentTile._opts.tileType == tile._opts.tileType) {
          foundTiles.push(currentTile)
        }
        else {
          break;
        }
      }
      for (var i = tile._opts.row + 1; i < level.num_rows; i++) {
        var currentTile = tileViews[tile._opts.col][i];
        if (currentTile._opts.tileType == tile._opts.tileType) {
          foundTiles.push(currentTile)
        }
        else {
          break;
        }
      }
      if (foundTiles.length >= 3) {
        return foundTiles;
      }
      return []
    }

    function find_three_or_more_from(tile) {
      var foundTiles = find_three_or_more_horizontal_from(tile).concat(find_three_or_more_vertical_from(tile))
      return foundTiles;
    }

    function swap_tile_data(tile1, tile2) {
      var tile1Row = tile1._opts.row;
      var tile1Col = tile1._opts.col;

      var tile2Row = tile2._opts.row;
      var tile2Col = tile2._opts.col;

      tileViews[tile1Col][tile1Row] = tile2;
      tileViews[tile2Col][tile2Row] = tile1;

      tile1._opts.row = tile2Row;
      tile1._opts.col = tile2Col;

      tile2._opts.row = tile1Row;
      tile2._opts.col = tile1Col;
    }

    function swapTiles(tile1, tile2) {
      var tile1Pos = {x: tile1._opts.x, y: tile1._opts.y};
      var tile2Pos = {x: tile2._opts.x, y: tile2._opts.y};
      swap_tile_data(tile1, tile2)

      var foundTiles = find_three_or_more_from(tile1);
      var foundTiles2 = find_three_or_more_from(tile2);
      if (foundTiles.length || foundTiles2.length) {
        animate(tile1).now(tile2Pos, 300, animate.easeIn).then(function(){
          tile1._opts.x = tile2Pos.x;
          tile1._opts.y = tile2Pos.y;
        });
        animate(tile2).now(tile1Pos, 300, animate.easeIn).then(function () {
          tile2._opts.x = tile1Pos.x;
          tile2._opts.y = tile1Pos.y;
        });
      }
      else {
        animate(tile1).now(tile2Pos, 150, animate.easeIn).then(tile1Pos, 150, animate.easeOut);
        animate(tile2).now(tile1Pos, 150, animate.easeIn).then(tile2Pos, 150, animate.easeOut);
        swap_tile_data(tile1, tile2)
      }
    }

    var tileViews = [];
    var currentSelectedTile = null;
    for (var col_idx = 0; col_idx < level.num_cols; col_idx++) {
      var views = []
      for (var row_idx = 0; row_idx < level.num_rows; row_idx++) {
        var tileType = Math.floor((Math.random() * num_gems) + 1);
        var tileWidth = (level.gridWidth / level.num_cols) - 2;
        var tileHeight = (level.gridHeight / level.num_rows) - 2;
        var tileImageView = new ui.ImageView({
          superview: gridview,
          row: row_idx,
          col: col_idx,
          image: 'resources/images/gems/gem_0' + tileType + '.png',
          tileType: tileType,
          tileColor: fixtures.tileColors[tileType],
          width: tileWidth,
          height: tileHeight,
          x: (tileWidth + 2) * row_idx,
          y: (tileHeight + 2) * col_idx,
          opacity: .7,
          transition: 'opacity 4s',
        });

        tileImageView.on('InputSelect', function () {
          if(!currentSelectedTile) {
            currentSelectedTile = this;
            this.style.opacity = 1;
          }
          else {
            currentSelectedTile.style.opacity = .7;
            if (isNeighboringTile(this, currentSelectedTile)) {
              swapTiles(this, currentSelectedTile)

            }
            else {
            }
            currentSelectedTile = null;
          }
        });

        views.push(tileImageView)
      }
      tileViews.push(views)
    }


  };

  this.launchUI = function () {

  };

});
