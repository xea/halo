require 'digest/sha2'

# Defines a User of this system
class User

	include DataMapper::Resource

	property :id, Serial

	property :name, String, :unique => true, :required => true
	property :display_name, String
	property :password_hash, String, :length => 64

	property :login_count, Integer, :default => 0

	has n, :accounts
	has n, :transactions
	has n, :categories

	validates_confirmation_of :password_hash

	attr_accessor :password_hash_confirmation

	# Returns the first user which matches to the given username and password arguments
	def self.find_user(username, password = nil)
		user = nil

		if password.nil?
			user = User.first(:name => username)
		else
			user = User.first(:name => username, :password_hash => User.calculate_hash(password)) if !password.nil?
		end

		return user
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

	# Registers a new user
	def self.register(username, display_name, password, password_cnf)
		user = User.new
		user.name = username.to_s
		user.display_name = display_name.to_s
		user.password_hash = User.calculate_hash(password)
		user.password_hash_confirmation = User.calculate_hash(password_cnf)

		if user.valid?
			user.save!
		end

		return user
	end

	# Transfers the given amount
	def transfer(at, category_id, account_id, amount, vendor, comment)
		ta = Transaction.new
		ta.at = at
		ta.account = accounts.to_a.find { |account| account.id == account_id.to_i }
		ta.amount = amount
		ta.vendor = vendor
		ta.comment = comment
		ta.category = categories.to_a.find { |category| category.id == category_id.to_i }
		ta.user = ta.account.user

		if ta.valid?
			ta.save
			reload
		end


		return ta
	end

	# Creates a new account associated to the current user
	def create_account(account_name)
		account = Account.new
		account.name = account_name
		account.user = self

		if account.valid?
			account.save
			reload
		end

		return account
	end

	def create_category(category_name)
		cat = Category.new
		cat.name = category_name
		cat.user = self

		if cat.valid?
			cat.save
			reload
		end

		return cat
	end

	def transaction_months
		repository.adapter.select("select substr(at, 1, 7) as a from transactions where user_id = ? group by a order by a asc", self.id)
	end
end
