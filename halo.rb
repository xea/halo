require 'rubygems'
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
			user = User.find_user(username)

			if user.nil?
				logger.warn "Invalid authentication attempt with username: #{username}"
			elsif user.password? password
				user.update(:login_count => user.login_count + 1)
				session[:user_id] = user.id
				session[:render_mode] = :static_fragments
			else
				logger.info "Authenticated user with id: #{user.id}"
				user.update(:login_count => 0)
				session[:user_id] = user.id
				session[:render_mode] = :static_fragments
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
			user = User.first(:id => current_user_id)

			if user.nil?
				user = User.new
				user.name = ""
				user.display_name = "Anonymous"
				user.id = -1
			end

			return user
		end

		def current_user_id
			session[:user_id]
		end

		def render_mode
			session[:render_mode]
		end

		def number_format(n)
			n.to_s.reverse.gsub(/...(?=.)/,'\& ').reverse
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

get '/sitebuild' do
	haml :'/sitebuild/index', :layout => :layout_sb
end
