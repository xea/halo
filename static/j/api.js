var Halo = {

	/**
	 * Client API containing the business functions
	 */
	Client : {

		click : function() {
		},

		Transactions : {
		
			transfer : function(at, category, peer, comment, account, amount) {
				var result = Halo.Data.transfer(at, category, peer, comment, account, amount, function(data) {
					var date = new Date(at);

					Halo.UI.TransactionPanel.refreshMonth(date.getFullYear(), date.getMonth(), data);
				});

				Halo.Core.trace("Transaction completed");
			},

			refreshMonth : function(year, month) {
				var currentDate = new Date();

				if (year == null) {
					year = currentDate.getFullYear();
				}

				if (month == null) {
					month = currentDate.getMonth() + 1;
				}

				Halo.Data.fetchMonth(year, month, function(data) {
					Halo.UI.TransactionPanel.refreshMonth(year, month, data);
				});
			},

			populate : function() {
				Halo.Data.listMonths(function(months_result) {
					for (var idx in months_result.months) {
						var monthId = months_result.months[idx]

						var year = monthId.split("-")[0];
						var month = monthId.split("-")[1];
						
						Halo.Data.fetchMonth(year, month, function(data) {
							var year = data.year;
							var month = data.month;
							var content = data.content;

							Halo.Core.trace(year + "-" + month);
							Halo.UI.TransactionPanel.refreshMonth(year, month, content);
						});
					}
				});
			}
		}
	},

	/**
	 * Client configuration object, holding all the configuration parameters
	 */
	Configuration : {
		serverURL : "http://localhost:4567",
		minimumPollInterval : 2,
		renderMode : "fragments" // fragment, dynamic, static
	},

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
			debugPanel : "#debug-panel",
			transactionPanel : "#box-transaction"
		},
		
		Builder : {

			debugMessage : function(text) {
				return '<br /><span class="debug-message">' + text + '</span>';	
			},

			errorMessage : function(text) {
				return '<br /><span class="error-message">' + text + '</span>';
			}

		},

		Mapping : {
		},

		Messages : {
		},

		DebugPanel : {
			
			append : function(text) {
				jQuery(Halo.UI.Binding.debugPanel).append(text);
			},

			toggle : function() {
				jQuery(Halo.UI.Binding.debugPanel).toggle();
			}
		},

		TransactionPanel : {

			refreshMonth : function(year, month, data) {
				var selector = "#tr-" + year + "-" + month + " tbody";
				Halo.Core.trace(selector);
				jQuery(selector).html(data);
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
		
		transfer : function(at, category, peer, comment, account, amount, callback) {
			return Halo.Net.createTransaction(at, category, peer, comment, account, amount, callback);
		},

		listMonths : function(callback) {
			return Halo.Net.listMonths(callback);
		},

		fetchMonth : function(year, month, callback) {
			return Halo.Net.getTransactions(year, month, callback);
		}

	},

	Net : {

		ajax : function(url, type, dataType, parameters, callback) {
			Halo.Core.trace("Sending AJAX " + type + " request to " + url);


			var query = { 
				type : type,
				success : callback,
				dataType : dataType,
				data : parameters
			};

			var request = jQuery.ajax(url, query);
			
			request.done(Halo.Net.ajaxSuccessHandler);
			request.fail(Halo.Net.ajaxErrorHandler);
		},

		ajaxSuccessHandler : function(message) {
			Halo.Core.trace("AJAX Request: success");
		},

		ajaxErrorHandler : function(xhr, status) {
			Halo.Core.trace("AJAX Request: failure (" + status + ")");
		},

		getJSON : function(url, object, callback) {
			Halo.Net.ajax(Halo.Configuration.serverURL + url, "GET", "json", object, callback);
		},

		postJSON : function(url, object, callback) {
			Halo.Net.ajax(Halo.Configuration.serverURL + url, "POST", "json", object, callback);
		},


		getHTML : function(url, object, callback) {
			Halo.Net.ajax(Halo.Configuration.serverURL + url, "GET", "html", object, callback);
		},

		postHTML : function(url, object, callback) {
			Halo.Net.ajax(Halo.Configuration.serverURL + url, "POST", "html", object, callback);
		},

		getTransactions : function(year, month, callback) {
			var url = Halo.Net.URL.getTransactions + '/' + year + '/' + month + '/1';

			Halo.Net.getJSON(url, {}, callback);
		},

		createTransaction : function(at, category, peer, comment, account, amount, callback) {
			var url = Halo.Net.URL.createTransaction;

			var request = {
				at : at,
				category : category,
				peer : peer,
				comment : comment,
				account : account,
				amount : amount
			};
			
			Halo.Net.postHTML(url, request, callback);
		},

		listMonths : function(callback) {
			var url = Halo.Net.URL.listMonths;

			Halo.Net.getJSON(url, {}, callback);
		},

		URL : {
			getTransactions : "/api/transactions",
			createTransaction : "/api/transaction/create",
			listMonths : "/api/transactions/months"
		}
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
	Halo.Client.Transactions.populate();
});

