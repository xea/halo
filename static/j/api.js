var Halo = {

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
		}

	}

	
};

Halo.Mapping = {
	"#debug-panel" : {
		"click" : Halo.Client.click
	},

	".enable-transaction" : {
		"click" : Halo.Client.Transactions.enable
	},

	".disable-transaction" : {
		"click" : Halo.Client.Transactions.disable
	},

	".delete-transaction" : {
		"click" : Halo.Client.Transactions.remove
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

