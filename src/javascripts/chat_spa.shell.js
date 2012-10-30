/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : true,
  white  : true
*/

/*global $, ChatSPA */

ChatSPA.shell = (function (){

  var
    configMap = {
	main_html :
		'<div class="chat-spa-shell-head">'
		+ '<div class="chat-spa-shell-head-logo"></div>'
		+ '<div class="chat-spa-shell-head-acct"></div>'
		+ '<div class="chat-spa-shell-head-search"></div>'
		+ '</div>'
		+ '<div class="chat-spa-shell-main">'
		+ '<div class="chat-spa-shell-main-nav"></div>'
		+ '<div class="chat-spa-shell-main-content"></div>'
		+ '</div>'
		+ '<div class="chat-spa-shell-foot"></div>'
		+ '<div class="chat-spa-shell-chat"></div>'
		+ '<div class="chat-spa-shell-modal"></div>'
	},
	stateMap  = {},
	jqueryMap = {},
	setJqueryMap, initModule;

	// Begin DOM method /setJqueryMap/
	setJqueryMap = function ( $container ){
		jqueryMap = { $container : $container };
	};
	
	// Begin Event Handlers
	

	// Begin Public methods 
	initModule = function ( $container ){
		$container.html( configMap.main_html );
		setJqueryMap( $container );
	};
	
	return { initModule : initModule };
}());