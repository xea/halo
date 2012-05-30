# Display user registration form
get "/user/register" do
  haml :"user/register"
end

# Displays the user page
get "/user/login" do
  haml :"user/login"
end

# Attempts to authenticate the current user and assign it to the current session
post "/user/login" do
  user = authenticate!(params[:username], params[:password])

end

get "/user/info" do
  #LOG logger.debug "Fetching info for current user (##{session[:user_id]}"

  user = current_user

end