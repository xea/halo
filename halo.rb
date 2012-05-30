require 'sinatra'
require 'haml'
require 'sass'
require 'rack-flash'
require 'data_mapper'

require "#{Dir.pwd}/model/user"
require "#{Dir.pwd}/model/account"
require "#{Dir.pwd}/model/category"
require "#{Dir.pwd}/model/transaction"
require "#{Dir.pwd}/controller/status"

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
class Halo < Sinatra::Base
end

get '/' do
  haml :'/home/index'
end

get '/init' do
  user = User.new

  "done"
end
