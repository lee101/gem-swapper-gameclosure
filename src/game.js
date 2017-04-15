import device;
import ui.StackView as StackView;

import ui.TextView as TextView;

import ui.ImageView;
import ui.widget.GridView as GridView;
import animate;
import src.fixtures as fixtures;
import src.game as game;

exports = (function () {
  "use strict";
  var game = {};
  game.Game = function (level, background) {

    var gridview = new GridView({
      superview: background,
      x: level.grid_padding,
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
      var foundTiles = find_three_or_more_horizontal_from(tile).concat(find_three_or_more_vertical_from(tile));
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

    function set_tile_to(tile1, tile2) {
      var tile1Row = tile1._opts.row;
      var tile1Col = tile1._opts.col;

      var tile2Row = tile2._opts.row;
      var tile2Col = tile2._opts.col;

      tileViews[tile1Col][tile1Row] = tile2;

      tile1._opts.row = tile2Row;
      tile1._opts.col = tile2Col;
    }

    function removeTiles(tiles) {
      for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        var tileRow = tile._opts.row;
        var tileCol = tile._opts.col;
        var tileView = tileViews[tileCol][tileRow];
        tileView.removeFromSuperview();
        tileViews[tileCol][tileRow]._opts.deleted = true;
      }
    }

    function sparkle(tiles) {
      for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        var x = tile._opts.x;
        var y = tile._opts.y;
        var height = tile._opts.height;
        var width = tile._opts.width;
        var num_gleams = 3;
        for (var gleam_num = 0; gleam_num < num_gleams; gleam_num++) {
          var colorNum = Math.floor(Math.random() * fixtures.gleamColors.length);
          var color = fixtures.gleamColors[colorNum];
          var xPos = x + (Math.random() * width);
          var yPos = y + (Math.random() * height);
          var sparkleImageView = new ui.ImageView({
            superview: gridview,
            image: 'resources/images/particles/gleam_' + color + '.png',
            width: 0,
            height: 0,
            x: xPos,
            y: yPos,
            opacity: .6,
          });
          animate(sparkleImageView).now({
              x: xPos - 100,
              y: yPos - 100,
              width: 200,
              height: 200
            },
            500, animate.easeIn
          ).then((function () {
            this.removeFromSuperview();
          }).bind(sparkleImageView));
          animate(sparkleImageView).wait(250).then({opacity: 0}, 250, animate.easeIn)
        }

      }
    }

    function addScore(score) {
      level.score += score;
      level.scoreTextView.setText(level.score);
    }

    function useMove() {
      level.numMoves--;
      level.movesTextView.setText('Moves: ' + level.numMoves);
    }


    function falldownAnimateTo(tileView, tileToAnimateTo, numDeleted) {
      animate(tileView).now({y: tileToAnimateTo._opts.y}, 300 * numDeleted, animate.easeIn).then(function () {
        tileView._opts.y = tileToAnimateTo._opts.y;
        set_tile_to(tileView, tileToAnimateTo);
      })
    }

    function falldown(tiles, callback) {
      for (var row = 0; row < level.num_rows; row++) {
        var numDeleted = 0;
        for (var col = level.num_cols - 1; col >= 0; col--) {
          var tileView = tileViews[col][row];
          if (tileView._opts.deleted) {
            numDeleted++;
          } else {
            if (numDeleted == 0) {
              continue;
            }
            var tileToAnimateTo = tileViews[col + numDeleted][row];

            falldownAnimateTo(tileView, tileToAnimateTo, numDeleted);
          }

        }
        for (var col = 0; col < numDeleted; col++) {
          var tileImageView = createTile(col, row);
          tileImageView._opts.y = tileImageView._opts.y - (numDeleted * tileImageView._opts.height);
          var tileToAnimateTo = tileViews[col][row];
          falldownAnimateTo(tileView, tileToAnimateTo, numDeleted);
        }
      }
    }

    function turnEnd(tiles) {
      addScore(tiles.length + tiles.length);

      sparkle(tiles);
      removeTiles(tiles);
      // should generate different tiles
      falldown(tiles);
    }

    function swapTiles(tile1, tile2) {
      var tile1Pos = {x: tile1._opts.x, y: tile1._opts.y};
      var tile2Pos = {x: tile2._opts.x, y: tile2._opts.y};
      swap_tile_data(tile1, tile2);

      var foundTiles = find_three_or_more_from(tile1);
      var foundTiles2 = find_three_or_more_from(tile2);
      if (foundTiles.length || foundTiles2.length) {
        useMove();

        var calledTimes = 0;

        function whenCalledTwice(fn) {
          calledTimes++;
          if (calledTimes == 2) {
            fn();
          }
        }

        var animationFinish = function () {
          turnEnd(foundTiles.concat(foundTiles2))
        };
        animate(tile1).now(tile2Pos, 300, animate.easeIn).then(function () {
          tile1._opts.x = tile2Pos.x;
          tile1._opts.y = tile2Pos.y;

          whenCalledTwice(animationFinish);
        });
        animate(tile2).now(tile1Pos, 300, animate.easeIn).then(function () {
          tile2._opts.x = tile1Pos.x;
          tile2._opts.y = tile1Pos.y;
          whenCalledTwice(animationFinish);
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

    function createTile(col_idx, row_idx) {
      var tileType = Math.floor((Math.random() * level.num_gems) + 1);
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
      });

      tileImageView.on('InputSelect', function () {
        if (!currentSelectedTile) {
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
      return tileImageView;
    }

    for (var col_idx = 0; col_idx < level.num_cols; col_idx++) {
      var views = [];
      for (var row_idx = 0; row_idx < level.num_rows; row_idx++) {
        var tileImageView = createTile(col_idx, row_idx);

        views.push(tileImageView)
      }
      tileViews.push(views)
    }
  };

  return game;
}());
