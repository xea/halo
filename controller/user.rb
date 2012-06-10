# Display user registration form
get "/user/register" do
  haml :"user/register"
end

# Registers a new user
post "/user/register" do
	user = User.register(params[:username], params[:displayname], params[:password])

	flash[:error] = user.errors.full_messages.join('<br/>') unless user.valid?

	redirect to '/user/login' if user.valid?

	haml :'user/register'
end

# Displays the user page
get "/user/login" do
  haml :"user/login"
end

# Attempts to authenticate the current user and assign it to the current session
post "/user/login" do
  user = authenticate!(params[:username], params[:password])

  flash[:error] = "Authentication failed" unless authenticated?

  redirect to '/' if authenticated?

  haml :'/user/login'
end

# Logs out the current user
get "/user/logout" do
	invalidate_session

	flash[:notice] = "Successfully logged out"

	redirect to :"/user/login"
end

get "/user/info" do
  #LOG logger.debug "Fetching info for current user (##{session[:user_id]}"

  user = current_user

end
