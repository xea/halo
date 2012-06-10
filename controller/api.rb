before "/api/*" do
	content_type "application/json"
end

# Return API info
get "/api/info" do
	response = {}
	response[:version] = "4.0"

	response.to_json
end

get "/api/transactions/:year/:month/:day" do |year, month, day|
	@query = Query.for_month current_user.id, year.to_i, month.to_i, day.to_i
	@subtotal = @query.opening_balance.to_i

	if render_mode == :static_fragments
		return { :year => year.to_i, :month => "%02d" % month.to_i, :content => haml(:'fragments/transaction_row', :layout => :empty) }.to_json
	elsif render_mode == :dynamic_fragments
		response = { :opening_balance => query.opening_balance, :transactions => query.transactions }
		return response.to_json
	end

end

get "/api/transactions/months" do
	return { :months => current_user.transaction_months }.to_json
end

post "/api/transaction/create" do
	transaction = current_user.transfer(params[:at], params[:category], params[:account], params[:amount], params[:peer], params[:comment])
	
	if transaction.nil?
	else
		year = transaction.at.year
		month = transaction.at.month
		day = 1
		@query = Query.for_month current_user.id, year.to_i, month.to_i, day.to_i
		@subtotal = @query.opening_balance.to_i
		
		return haml :'fragments/transaction_row', :layout => :empty
	end
end

post "/api/user/login" do
	user = authenticate(params[:username], params[:password])

	response = {}
	response[:success] = !user.nil?
	response[:name] = user.name unless user.nil?

	return response.to_json
end
