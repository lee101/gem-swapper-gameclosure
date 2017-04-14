import device;
import ui.StackView as StackView;

import ui.TextView as TextView;

import ui.ImageView;
import ui.widget.GridView as GridView;
import animate;
import src.fixtures as fixtures;
import src.game as game;


var boundsWidth = 576;
var boundsHeight = 1024;
var baseWidth = boundsWidth;
var baseHeight = device.screen.height * (boundsWidth / device.screen.width); //864
var scale = device.screen.width / baseWidth;
exports = Class(GC.Application, function () {

  this.initUI = function () {
    //scale the root view
    this.view.style.scale = scale;
    var level = {};
    level.numMoves = 50;

    var background = new ui.ImageView({
      superview: this.view,
      x: 0,
      y: 0,
      width: baseWidth,
      height: baseHeight,
      image: "resources/images/ui/background.png",
      zIndex: 0
    });
    var backgroundHeaderWidth = 249;
    var backgroundHeader = new ui.ImageView({
      superview: this.view,
      x: (baseWidth / 2) - (backgroundHeaderWidth/2),
      y: 0,
      width: backgroundHeaderWidth,
      height: 166,
      image: "resources/images/ui/header.png",
      zIndex: 0
    });

    var scoreTextView = new TextView({
      superview: backgroundHeader,
      x: 0,
      y: 65,
      width: backgroundHeaderWidth,
      height: 70,
      autoSize: false,
      size: 52,
      verticalAlign: 'middle',
      horizontalAlign: 'center',
      wrap: false,
      color: '#FFFFFF',
      text: '0'
    });
    var movesTextView = new TextView({
      superview: background,
      x: 0,
      y: baseHeight - 100,
      width: baseWidth,
      height: 70,
      autoSize: false,
      size: 52,
      verticalAlign: 'middle',
      horizontalAlign: 'center',
      wrap: false,
      color: '#FFFFFF',
      text: 'Moves: ' + level.numMoves,
    });



    level.grid_padding = 20;
    level.gridWidth = baseWidth - (level.grid_padding * 2);
    level.gridHeight = 520;
    level.num_rows = 8;
    level.num_cols = 8;

    level.num_gems = 5;
    game.Game(level, background)


  };

  this.launchUI = function () {

  };

});
