class Account
  include DataMapper::Resource

  property :id, Serial
  property :name, String

  belongs_to :user

  has n, :transactions
end
