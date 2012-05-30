require 'digest/sha2'

# Defines a User of this system
class User

  include DataMapper::Resource

  property :id, Serial

  property :name, String
  property :pwdHash, String

  has n, :accounts
  has n, :transactions

  # Sets a new password for the current user
  def password=(newPassword)
    @pwdHash = Digest::SHA2.hexdigest(newPassword)
  end

  # verifies the argument if it matches to the currently set password
  def password?(passwordCandidate)
    @pwdHash == Digest::SHA2.hexdigest(passwordCandidate)
  end
end