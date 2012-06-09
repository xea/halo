# Displays the current acocunt info
get "/accounts" do
	@accounts = current_user.accounts.to_a
	haml :"/account/index"
end

post "/account/new" do
	account = current_user.create_account params[:account_name]

	if account.valid?
	else
		logger.error "Account creation failed: #{account.errors.full_messages}"
		flash[:error] = account.errors.full_messages.join "<br />"
	end

	redirect to :"/accounts"
end
