Halo.UI = {

	Binding : {
		debugPanel : "#debug-panel",
		menuPanel : "#menu",
		transactionPanel : "#box-transaction",
		transaction : "#transaction-",
		btnEnableTransaction : ".enable-transaction",
		btnDisableTransaction : ".disable-transaction"
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

	Charts : {
		generate : function() {
			chart = new Highcharts.Chart({
				chart : {
					renderTo: 'charts'
				},

				xAxis : {
					categories : [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
				},

				yAxis : {
					min : 0
				},

				title : 'Finances',

				series : [
					{
						type : 'line',
						name : 'Regression line',
						data : [[0, 1], [1, 4], [2.4, 6], [3, 11], [4, 99], [5, 34]],
					},
					{
						type : 'scatter',
						name : 'Observations',
						data : [1, 4, 6, 11, 99, 34]
					}
				]
			});	
		}	
	},

	/**
	 * Represents the main module menu of the application where the user can launch the main activities
	 */
	MenuPanel : {
		
		/**
		 * Switches the currently selected menu tab to an other
		 */
		switchTab : function(index) {
			jQuery(Halo.UI.Binding.menuPanel + " ul li").removeClass("selected");
			jQuery(Halo.UI.Binding.menuPanel + " ul li:nth-child(" + (index + 1)  +")").addClass("selected");
		}	
	},

	TransactionPanel : {

		/**
		 * Redraws the given month part of the transaction panel
		 */
		refreshMonth : function(year, month, data) {
			var selector = "#tr-" + year + "-" + month + " tbody";
			jQuery(selector).html(data);

			Halo.Core.doBinding();
		},

		/**
		 * Marks the specified transaction enabled if it was disabled before
		 */
		toggle : function(id) {
			var selector = ".transactions tr[transaction-id='" + id + "']";
			var enabled = jQuery(selector).attr("transaction-enabled");

			if (enabled == 'true') {
				jQuery(selector).attr('transaction-enabled', "false");
			} else {
				jQuery(selector).attr('transaction-enabled', "true");
			}
		},

		remove : function(id) {
			var selector = ".transactions tr[transaction-id='" + id + "']";
			jQuery(selector).remove();
		}
	},

	pad : function(number, length) {
		var str = '' + number;

		while (str.length < length) {
			str = '0' + str;
		}

		return str;
	}
};

jQuery.fn.exists = function() {
	return (this.length > 0);
}

jQuery(document).ready(function() {
	Halo.Core.doBinding();
	Halo.Core.trace("Application is ready");
	Halo.Client.Transactions.populate();
});

