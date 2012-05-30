require 'digest/sha2'

# Defines a User of this system
class User

  include DataMapper::Resource

  property :id, Serial

  property :name, String
  property :display_name, String
  property :password_hash, String

  has n, :accounts
  has n, :transactions

  # Returns the first user which matches to the given username and password arguments
  def self.find_user(username, password)
    User.first(:name => username, :password_hash => User.calculate_hash(password))
  end

  # calculates the hash for the given input and return it in hexadecimal string format
  def self.calculate_hash(input)
    Digest::SHA2.hexdigest(input.to_s)
  end

  # Sets a new password for the current user
  def password=(new_password)
    @password_hash = User.calculate_hash(new_password)
  end

  # verifies the argument if it matches to the currently set password
  def password?(password_candidate)
    @password_hash == User.calculate_hash(password_candidate)
  end
end