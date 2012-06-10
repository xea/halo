
# Displays the transaction list
get "/transactions" do
	@user = current_user
	@months = @user.transactions.collect { |t| t.at.to_s[0..6] }.uniq { |d| d[0..6] }.sort
	haml :"transaction/index"
end


# Register a new transaction
post "/transaction/new" do
	transaction = current_user.transfer(params[:at], params[:category], params[:account], params[:amount], params[:vendor], params[:comment])

	if transaction.valid?
		logger.debug "Transaction saved with id: #{transaction.id}"
	else
		logger.error "Could not save transaction"
		logger.error transaction.errors.full_messages
		flash[:error] = transaction.errors.full_messages.join("<br />")
	end

	redirect "/transactions"
end
