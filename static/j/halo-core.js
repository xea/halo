var Halo = {

	Client : {},

	Core : {

		trace : function(message) {
			var date = Halo.Core.getTime();
			var timestamp = '[' + date + '] ';
			var text = timestamp + message;
			var debugMessage = Halo.UI.Builder.debugMessage(text);
			Halo.UI.DebugPanel.append(debugMessage);
		},

		error : function(message) {
			var date = Halo.Core.getTime();
			var timestamp = '[' + date + '] ';
			var text = timestamp + message;
			var errorMessage = Halo.UI.Builder.errorMessage(text);
			Halo.UI.DebugPanel.append(errorMessage);
		},

		getTime : function() {
			var date = new Date();

			var sHour = Halo.UI.pad(date.getHours(), 2);
			var sMin = Halo.UI.pad(date.getMinutes(), 2);
			var sSec = Halo.UI.pad(date.getSeconds(), 2);

			var output = [ sHour, sMin, sSec ].join(":");

			return output;
		},

		doBinding : function(providedMapping) {
			var mapping = Halo.Mapping;

			if (providedMapping != null) {
				mapping = providedMapping;
			}

			try {
				Halo.Core.trace("Starting UI Binding");

				for (var selector in mapping) {
					jQuery(selector).unbind();

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
	
	Data : {
		
		transfer : function(at, category, peer, comment, account, amount, callback) {
			return Halo.Net.createTransaction(at, category, peer, comment, account, amount, callback);
		},

		listMonths : function(callback) {
			return Halo.Net.listMonths(callback);
		},

		fetchMonth : function(year, month, callback) {
			return Halo.Net.getTransactions(year, month, callback);
		},

		toggleTransaction : function(id, callback) {
			return Halo.Net.toggleTransaction(id, callback);
		},

		removeTransaction : function(id, callback) {
			return Halo.Net.removeTransaction(id, callback);
		}

	}

};

