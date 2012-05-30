require 'data_mapper'

require "#{Dir.pwd}/model/user"
require "#{Dir.pwd}/model/account"
require "#{Dir.pwd}/model/category"
require "#{Dir.pwd}/model/transaction"

DataMapper::Logger.new($stdout, :debug)
DataMapper::setup(:default, "sqlite3://#{Dir.pwd}/data.db")
DataMapper::finalize
DataMapper::auto_upgrade!

class Console

  # Starts a new console session
  def start
    puts "[Console] Starting console"

    while true do
      catch (:unauthorized) do
        print "> "
        input = gets

        dispatch input
      end
    end
  end

  # Takes the input string and decides if it contains a valid command or not and if it does then it executes the
  # corresponding command.
  def dispatch(input)
    case input
      when /^exit$/
        exit
    end
  end
end

c = Console.new
c.start