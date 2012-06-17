Halo.Net = {

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

	toggleTransaction : function(transactionId, callback) {
		var url = Halo.Net.URL.toggleTransaction;

		var request = {
			transactionId : transactionId
		};

		Halo.Net.postJSON(url, request, callback);
	},

	removeTransaction : function(id, callback) {
		var url = Halo.Net.URL.removeTransaction;

		var request = {
			transactionId : id	
		};

		Halo.Net.postJSON(url, request, callback);
	},

	listMonths : function(callback) {
		var url = Halo.Net.URL.listMonths;

		Halo.Net.getJSON(url, {}, callback);
	},

	URL : {
		getTransactions : "/api/transactions",
		createTransaction : "/api/transaction/create",
		listMonths : "/api/transactions/months",
		toggleTransaction : "/api/transactions/toggle",
		removeTransaction : "/api/transactions/remove"
	}
};

