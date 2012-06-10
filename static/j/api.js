var Halo = {

	Client : {

		click : function() {
		}
	},

	Configuration : {
		serverURL : "http://localhost:4567",
		minimumPollInterval : 2
	},

	Core : {
		log : function(message) {
		},

		trace : function(message) {
			var date = new Date().toISOString();
			var timestamp = '[' + date + '] ';
			var text = timestamp + message;
			var debugMessage = Halo.UI.Builder.debugMessage(text);
			Halo.UI.DebugPanel.append(debugMessage);
		},

		error : function(message) {
			Halo.Core.trace(message);
		},

		doBinding : function(providedMapping) {
			var mapping = Halo.Mapping;

			if (providedMapping != null) {
				mapping = providedMapping;
			}

			try {
				Halo.Core.trace("Starting UI Binding");

				for (var selector in mapping) {
					for (var eventName in mapping[selector]) {
						var eventHandler = mapping[selector][eventName];

						jQuery(selector).on(eventName, eventHandler);
						Halo.Core.trace("Bound handler on " + selector + "@" + eventName);
					}
				}

				Halo.Core.trace("UI Binding findished");
			} catch (error) {
				Halo.Core.error("Binding failed: " + error);
			}
		},

		startPolling : function(intervalInSeconds) {
			if (Halo.State.pollId == null) {
				if (intervalInSeconds == null || intervalInSeconds < Halo.Configuration.minimumPollInterval) {
					intervalInSeconds = Halo.Configuration.minimumPollInterval;
				}

				var pollId = setInterval(function() {
					Halo.Core.trace("Polling now");
				}, intervalInSeconds * 1000);

				Halo.State.pollId = pollId;

				Halo.Core.trace("Started event polling (id: " + pollId + ") with interval of " + intervalInSeconds + " second(s)");
			} else {
				Halo.Core.trace("Event polling is already running! (id : " + Halo.State.pollId + ")");
			}
		},

		stopPolling : function() {
			if (Halo.State.pollId == null) {
				Halo.Core.trace("No running poll was found");
			} else {
				clearInterval(Halo.State.pollId);
				Halo.Core.trace("Stopped event polling (id: " + Halo.State.pollId + ")");
				Halo.State.pollId = null;
			}
		}
	},

	State : {

		pollId : null
	},

	UI : {

		Binding : {
			debugPanel : "#debug-panel"
		},
		
		Builder : {

			debugMessage : function(text) {
				return '<br /><span class="debug-message">' + text + '</span>';	
			}
		},

		Mapping : {
		},

		Messages : {
		},

		DebugPanel : {
			
			append : function(text) {
				jQuery(Halo.UI.Binding.debugPanel).append(text);
			}
		},

		pad : function(number, length) {
			var str = '' + number;

			while (str.length < length) {
				str = '0' + str;
			}

			return str;
		}
	},

	Data : {

		fetchMonth : function(year, month) {
		}

	},

	Net : {

		ajax : function(url, type, dataType, parameters, callback) {
			Halo.Core.trace("Sending AJAX " + type + " request to " + url);

			var request = jQuery.ajay({ success : callback });

			request.done(Halo.Net.ajaxSuccessHandler);
			request.fail(Halo.Net.ajaxErrorHandler);
		},

		ajaxSuccessHandler : function(message) {
			Halo.Core.trace("AJAX Request: success");
		},

		ajaxErrorHandler : function(xhr, status) {
			Halo.Core.trace("AJAX Request: failure");
		},

		getJSON : function(url, object, callback) {
			Halo.Net.ajax(Halo.configuration.serverURL + url, "GET", "json", object, callback);
		},

		postJSON : function(url, object, callback) {
			Halo.Net.ajax(Halo.Configuration.serverURL + url, "POST", "json", object, callback);
		},

		getTransactions : function(year, month) {
			
		},

	}
};

Halo.Mapping = {
	"#debug-panel" : {
		"click" : Halo.Client.click
	}
}

jQuery.fn.exists = function() {
	return (this.length > 0);
}

jQuery(document).ready(function() {
	Halo.Core.doBinding();
	Halo.Core.trace("Application is ready");
});

