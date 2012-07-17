# Display user registration form
get "/user/register" do
  haml :"user/register", :layout => :layout_singlepanel
end

# Registers a new user
post "/user/register" do
	user = User.register(params[:username], params[:displayname], params[:password], params[:password_confirmation])

	if user.valid?
		flash[:notice] = "Registration successful"
	else
		flash[:error] = user.errors.full_messages.join('<br/>') 
	end

	redirect to '/user/login' if user.valid?

	haml :'user/register', :layout => :layout_singlepanel
end

# Displays the user page
get "/user/login" do
  haml :"user/login", :layout => :layout_singlepanel
end

# Attempts to authenticate the current user and assign it to the current session
post "/user/login" do
  user = authenticate!(params[:username], params[:password])

  if user.nil?
	  flash[:error] = "Authentication failed" 
  elsif authenticated?
	  redirect to '/' 
  else
	  flash[:error] = "Authentication failed" 
  end


  haml :'/user/login', :layout => :layout_singlepanel
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
