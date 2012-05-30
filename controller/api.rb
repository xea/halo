before "/api/*" do
  content_type "application/json"
end

# Return API info
get "/api/info" do
  response = {}
  response[:version] = "4.0"

  response.to_json
end

post "/api/user/login" do
  user = authenticate(params[:username], params[:password])

  response = {}
  response[:success] = !user.nil?
  response[:name] = user.name unless user.nil?

  response.to_json
end