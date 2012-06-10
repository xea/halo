require 'sinatra'
require 'haml'
require 'sass'
require 'rack-flash'
require 'data_mapper'
require 'json'

require "#{Dir.pwd}/model/user"
require "#{Dir.pwd}/model/account"
require "#{Dir.pwd}/model/category"
require "#{Dir.pwd}/model/transaction"
require "#{Dir.pwd}/model/query"
require "#{Dir.pwd}/controller/status"
require "#{Dir.pwd}/controller/user"
require "#{Dir.pwd}/controller/transaction"
require "#{Dir.pwd}/controller/account"
require "#{Dir.pwd}/controller/category"

# API controller
require "#{Dir.pwd}/controller/api"

DataMapper::Logger.new($stdout, :debug)
DataMapper::setup(:default, "sqlite3://#{Dir.pwd}/data.db")
DataMapper::finalize
DataMapper::auto_upgrade!

use Rack::Flash, :sweep => true

set :public_folder, File.dirname(__FILE__) + '/static'
# For keeping compatibility with older sinatra versions
#set :public, File.dirname(__FILE__) + '/static'
enable :sessions


# The main application class
module Sinatra
	module Halo

		# Makes an attempt to authenticate the current user with the given credentials
		def authenticate!(username, password)
			user = User.find_user(username, password)

			if user.nil?
				flash[:error] = "User not found!"
				logger.warn "Invalid authentication attempt with username: #{username}"
			else
				logger.info "Authenticated user with id: #{user.id}"
				session[:user_id] = user.id
			end

			return user
		end

		# Indicated if the current session has a valid authentication
		def authenticated?
			!session[:user_id].nil?
		end

		def invalidate_session
			session[:user_id] = nil
			session.clear
		end

		# Returns the user object assigned to the current session
		def current_user
			User.first(:id => current_user_id)
		end

		def current_user_id
			session[:user_id]
		end

	end

	helpers Halo
end

# Those URL patterns that does not need authentication 
unauthenticated_pages = [
	"/user/login",
	"/user/register",
	/\/c\/.*/,
	/\/j\/.*/,
	/\/f\/.*/,
	/\/g\/.*/
]

before do
	may_access = false

	if authenticated?
		may_access = true
	else
		unauthenticated_pages.each do |page|
			if page.kind_of? Regexp and request.path =~ page
				may_access = true
			elsif page.kind_of? String and request.path == page
				may_access = true
			end
		end
	end

	redirect to '/user/login' unless may_access
end

get '/' do
	@user = current_user
	haml :'/home/index'
end

get '/c/*' do |stylesheet|
	sass stylesheet.to_sym
end

get '/init' do
	user = User.new

end

