import device;
import ui.StackView as StackView;

import ui.TextView as TextView;
import src.TitleScreen as TitleScreen;


exports = Class(GC.Application, function () {

  this.initUI = function () {
    var titlescreen = new TitleScreen();
    // Create a stackview of size 320x480, then scale it to fit horizontally
    // Add a new StackView to the root of the scene graph
    var rootView = new StackView({
      superview: this,
      // x: device.width / 2 - 160,
      // y: device.height / 2 - 240,
      x: 0,
      y: 0,
      width: 320,
      height: 480,
      clip: true,
      scale: device.width / 320
    });

    rootView.push(titlescreen);

  };

  this.launchUI = function () {

  };

});
