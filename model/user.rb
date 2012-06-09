require 'digest/sha2'

# Defines a User of this system
class User

	include DataMapper::Resource

	property :id, Serial

	property :name, String, :unique => true, :required => true
	property :display_name, String
	property :password_hash, String, :length => 64

	has n, :accounts
	has n, :transactions
	has n, :categories

	# Returns the first user which matches to the given username and password arguments
	def self.find_user(username, password)
		user = User.first(:name => username, :password_hash => User.calculate_hash(password))
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
	def self.register(username, display_name, password)
		user = User.new
		user.name = username.to_s
		user.display_name = display_name.to_s
		user.password_hash = User.calculate_hash(password)

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
end
