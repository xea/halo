post "/transaction/new" do
	transaction = current_user.transfer(params[:at], params[:category], params[:account], params[:amount], params[:vendor], params[:comment])

	if transaction.valid?
		logger.debug "Transaction saved with id: #{transaction.id}"
	else
		logger.error "Could not save transaction"
		logger.error transaction.errors.full_messages
		flash[:error] = transaction.errors.full_messages.join("<br />")
	end

	redirect "/"
end
