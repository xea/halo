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

	if render_mode == :static_fragments
		return haml :'fragments/transaction_row', :layout => :empty
	elsif render_mode == :dynamic_fragments
		response = { :opening_balance => query.opening_balance, :transactions => query.transactions }
		return response.to_json
	end

end

post "/api/transaction/create" do |at, category, peer, comment, account, amount|
	response = {}
	response[:success] = true
	response[:transaction_id] = 1

	return response.to_json
end

post "/api/user/login" do
	user = authenticate(params[:username], params[:password])

	response = {}
	response[:success] = !user.nil?
	response[:name] = user.name unless user.nil?

	return response.to_json
end
