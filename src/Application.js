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
