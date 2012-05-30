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
require "#{Dir.pwd}/controller/status"
require "#{Dir.pwd}/controller/user"

# API controller
require "#{Dir.pwd}/controller/api"

DataMapper::Logger.new($stdout, :debug)
DataMapper::setup(:default, "sqlite3://#{Dir.pwd}/data.db")
DataMapper::finalize
DataMapper::auto_upgrade!

set :public_folder, File.dirname(__FILE__) + '/static'
# For keeping compatibility with older sinatra versions
set :public, File.dirname(__FILE__) + '/static'
set :logging, true
enable :logging
enable :sessions

use Rack::Flash, :sweep => true

# The main application class
module Sinatra
  module Halo

    def authenticate!(username, password)
      user = User.find_user(username, password)

      session[:user_id] = user.id unless user.nil?
      logger.info "asdfsad"
    end

    # Returns the user object assigned to the current session
    def current_user
      User.first(session[:user_id])
    end

  end

  helpers Halo
end

get '/' do
  haml :'/home/index'
end

get '/init' do
  user = User.new

  "done"
end
