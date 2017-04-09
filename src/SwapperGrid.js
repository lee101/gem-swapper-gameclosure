import device;
import ui.View;
import ui.ImageView;
import ui.GridView;


exports = Class(ui.GridView, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
		});

		supr(this, 'init', [opts]);
	};

	this.initializeTiles = function() {
		
	};
});
