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
			chat_extend_time	: 250,
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
			$chat_window : $container.find('.chat-spa-shell-chat')
		};
	};
	
	// Extends or retracts Chat Slider
	toggleChat = function(do_extend, callback){
		var
			px_chat_ht = jqueryMap.$chat_window.height(),
			is_open    = px_chat_ht == configMap.chat_extend_height,
			is_closed  = px_chat_ht == configMap.chat_retract_height,
			is_sliding = !is_open && !is_closed;
		
		if(is_sliding) { return false; }
		
		// Begin extend Chat Slider
		if(do_extend){
			jqueryMap.$chat_window.animate(
				{ height: configMap.chat_extend_height},
				configMap.chat_extend_time,
				function (){
					jqueryMap.$chat_window.attr(
						'title', configMap.chat_extended_title
					);
					stateMap.is_chat_retracted = false;
					if ( callback ) { callback( jqueryMap.$chat_window ); }
				}
			);
			return true;
		}
		// End extend Chat Slider
		
		// Begin retract Chat Slider
		jqueryMap.$chat_window.animate(
			{ height: configMap.chat_retract_height},
			configMap.chat_retract_time,
			function (){
				jqueryMap.$chat_window.attr(
					'title', configMap.chat_retracted_title
				);
				stateMap.is_chat_retracted = true;
				if ( callback ) { callback( jqueryMap.$chat_window ); }
			}
		);
		return true;
		// End retract Chat Slider
	};
	// End toggleChat
	// ------------------- End DOM Method ------------------- 
	
	
	// ------------------- Begin Event Handlers ------------------- 
	onClickChat = function ( event) {
		 if ( toggleChat( stateMap.is_chat_retracted ) ) {
		    $.uriAnchor.setAnchor({
		      chat: ( stateMap.is_chat_retracted ? 'open' : 'closed' )
		    });
		}
		return false;
	};
	// ------------------- End Event Handlers ------------------- 
	

	// ------------------- Begin Public Method ------------------- 
	
	// Begin Public method /initModule/
	initModule = function ( $container ){
		// load HTML and map jQuery collections
		$container.html( configMap.main_html );
		stateMap.$container = $container;
		setJqueryMap();
		
		// initialize chat slider and bind click handler
	    stateMap.is_chat_retracted = true;
	    jqueryMap.$chat_window
	      .attr( 'title', configMap.chat_retracted_title )
	      .click( onClickChat );
	};
	// End PUBLIC method /initModule/
	
	return { initModule : initModule };
	
	// ------------------- End Public Method ------------------- 
	
}());