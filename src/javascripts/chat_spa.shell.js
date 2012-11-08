/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : true,
  white  : true
*/

/*global $, ChatSPA */

ChatSPA.shell = (function (){
  
	//----------------- BEGIN MODULE SCOPE VARIABLES ---------------
	var
	  	configMap = {
		anchor_schema_map : {
			chat : { open:true, close:true }
		},
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
		stateMap  = {
		anchor_map		 	: {},
		is_chat_retracted	: true
		},
		jqueryMap = {},
		copyAnchorMap, setJqueryMap, toggleChat,
		changeAnchorPort, onChangeAddress, 
		onClickChat, initModule;
	//----------------- END MODULE SCOPE VARIABLES ---------------
	
	//------------------- BEGIN UTILITY METHODS ------------------
	// Returns copy of stored anchor map; minimizes overhead
	copyAnchorMap = function () {
		return $.extend( true, {}, stateMap.anchor_map );
	};
	//-------------------- END UTILITY METHODS -------------------
	
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
	
	// Begin DOM method /changeAnchorPart/ - Changes part of the URI anchor component
	changeAnchorPart = function(arg_map){
		var
			anchor_map_revise = copyAnchorMap(),
			bool_return = true,
			key_name, key_name_dep;
			
		// Begin merge changes into anchor map
		KEYVAL:
		for (key_name in arg_map){
			if(arg_map.hasOwnProperty(key_name)){
				
				// skip dependent keys during iteration
				if(key_name.indexOf('_') === 0 ) { continue KEYVAL; }
				
				// update independent key value
				anchor_map_revise[key_name] = arg_map[key_name];
				
				// update matching dependent key
				key_name_dep = '_' + key_name;
				if(arg_map[key_name_dep]){
					anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
				} else {
					delete anchor_map_revise[key_name_dep];
					delete anchor_map_revise['_s' + key_name_dep];
				}
				
			}
		}
		// End merge changes into anchor map
		
		// Begin attempt to update URI; revert if not successful
		try {
			$.uriAnchor.setAnchor( anchor_map_revise );
		} catch ( error ) {
			// replace URI with existing state
			$.uriAnchor.setAnchor( stateMap.anchor_map,null,true );
			bool_return = false;
		}
			// End attempt to update URI...
		  	return bool_return;
	};
	// End DOM method /changeAnchorPart/
	// ------------------- End DOM Method ------------------- 
	
	
	// ------------------- Begin Event Handlers ------------------- 
	onChangeAddress = function(event){
		var
			anchor_map_previous = copyAnchorMap(),
			anchor_map_proposed,
			_s_chat_previous, s_chat_proposed,
			_s_chat_proposed;
		
		// attempt to parse anchor
		try { 
			anchor_map_proposed = $.uriAnchor.makeAnchorMap(); 
		} catch ( error ) {
			$.uriAnchor.setAnchor( anchor_map_previous, null, true );
			return false;
		}
		stateMap.anchor_map = anchor_map_proposed;
		
		// convenience vars
		_s_chat_previous = anchor_map_previous._s_chat;
		_s_chat_proposed = anchor_map_proposed._s_chat;
		
		// Begin adjust chat component if changed
		if ( ! anchor_map_previous || _s_chat_previous !== _s_chat_proposed ){
			s_chat_proposed = anchor_map_proposed.chat;
			switch ( s_chat_proposed ) {
				case 'open'   :
				toggleChat( true );
				break;
			case 'closed' :
				toggleChat( false );
				break;
			default  :
				toggleChat( false );
				delete anchor_map_proposed.chat;
				$.uriAnchor.setAnchor( anchor_map_proposed, null, true );

			} 
		}
		// End adjust chat component if changed
			
		return false
	}
	// End Event handler /onChangeAddress/
	
	onClickChat = function ( event) {
		changeAnchorPart({
			chat: ( stateMap.is_chat_retracted ? 'open' : 'closed' )
		});
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
	
		// configure uriAnchor to use our schema
		$.uriAnchor.configModule({
			schema_map : configMap.anchor_schema_map
		});
		
		// configure and initialize feature modules
	    ChatSPA.chat.configModule( {} );
	    ChatSPA.chat.initModule( jqueryMap.$chat_window );
		
		// bind address change events
		// requires the address plugin
		$.address.change( onChangeAddress );
	};
	// End PUBLIC method /initModule/
	
	return { initModule : initModule };
	
	// ------------------- End Public Method ------------------- 
	
}());