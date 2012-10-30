/*	jslint         browser : true, continue : true,
  	devel  : true, indent  : 2,    maxerr   : 50,
  	newcap : true, nomen   : true, plusplus : true,
	regexp : true, sloppy  : true, vars 	: true
  	white  : true
*/


/* global $, ChatSPA */

var ChatSPA = (function($) {
	
	// Public method
	initModule = function ($container) {
		ChatSPA.shell.initModule($container);
	}
	
	return {initModule : initModule};
	
})(jQuery);

