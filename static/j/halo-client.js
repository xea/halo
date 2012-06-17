
/**
 * Client API containing the business functions
 */
Halo.Client = {

	click : function() {
	},

	toggleTransaction : function(event) {
		var eventId = jQuery(event.target).attr("target");
		Halo.Client.Transactions.toggle(eventId);
	},

	deleteTransaction : function(event) {
		var eventId = jQuery(event.target).attr("target");
		Halo.Client.Transactions.remove(eventId);
	},

	Transactions : {
		
		/**
		 * Enables a specific transaction identified by its ID if it was disabled before or enables otherwise
		 */
		toggle : function(id) {
			var result = Halo.Data.toggleTransaction(id, function(data) {
				Halo.UI.TransactionPanel.toggle(id);
			});
		},
		
		remove : function(id) {
			var result = Halo.Data.removeTransaction(id, function(data) {
				Halo.UI.TransactionPanel.remove(id);
			});
		},
	
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

						Halo.UI.TransactionPanel.refreshMonth(year, month, content);
					});
				}
			});
		}
	}
};

/**
 * Client configuration object, holding all the configuration parameters
 */
Halo.Configuration = {
	serverURL : "http://localhost:4567",
	minimumPollInterval : 2,
	renderMode : "fragments" // fragment, dynamic, static
};

Halo.Mapping = {
	"#debug-panel" : {
		"click" : Halo.Client.click
	},

	".toggle-transaction" : {
		"click" : Halo.Client.toggleTransaction
	},

	".delete-transaction" : {
		"click" : Halo.Client.deleteTransaction
	}
}

