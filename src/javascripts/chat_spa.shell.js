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
			+ '<div class="chat-spa-shell-modal"></div>',
			chat_extend_time	: 1000,
			chat_retract_time	: 300,
			chat_extend_height	: 450,
			chat_retract_height	: 15
	},
	stateMap  = {},
	jqueryMap = {},
	setJqueryMap, initModule;
	
	// ------------------- Begin DOM Method ------------------- 
	
	// Begin DOM method /setJqueryMap/
	setJqueryMap = function (){
		var $container = stateMap.$container;
		jqueryMap = { 
			$container : $container, 
			$chat : $container.find('.chat-spa-shell-chat')
		};
	};
	
	// Extends or retracts Chat Slider
	toggleChat = function(do_extend, callback){
		var
			px_chat_ht = jqueryMap.$chat.height(),
			is_sliding = (
				px_chat_ht !== configMap.chat_retract_height
			 && px_chat_ht !== configMap.chat_extend_height
			)
		
		if(is_sliding) { return false; }
		
		// Begin extend Chat Slider
		if(do_extend){
			jqueryMap.$chat.animate(
				{ height: configMap.chat_extend_height},
				configMap.chat_extend_time,
				function(){
					if(callback){ callback(jqueryMap.$chat); }
				}
			);
			return true;
		}
		// End extend Chat Slider
		
		// Begin retract Chat Slider
		jqueryMap.$chat.animate(
			{ height: configMap.chat_retract_height},
			configMap.chat_retract_time,
			function(){
				if(callback){ callback(jqueryMap.$chat); }
			}
		);
		// End retract Chat Slider
	};
	// End toggleChat
	
	// ------------------- End DOM Method ------------------- 
	
	
	// ------------------- Begin Event Handlers ------------------- 
	// ------------------- End Event Handlers ------------------- 
	

	// ------------------- Begin Public Method ------------------- 
	
	// Begin Public method /initModule/
	initModule = function ( $container ){
		$container.html( configMap.main_html );
		stateMap.$container = $container;
		setJqueryMap();
		
		// test toggle
		setTimeout( function (){toggleChat( true ); }, 3000 );
		setTimeout( function (){toggleChat( false );}, 8000 );
	};
	// End PUBLIC method /initModule/
	
	return { initModule : initModule };
	
	// ------------------- End Public Method ------------------- 
	
}());