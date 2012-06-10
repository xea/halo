
class Query

	attr_accessor :transactions
	attr_accessor :opening_balance
	
	def self.for_month(user_id, year, month, day)
		start_month = DateTime.parse("#{year}-#{month}-#{day}")
		end_month = start_month.next_month

		transactions = Transaction.all(:user_id => user_id, :at.gte => start_month, :at.lt => end_month, :order => [ :at.asc ] )

		query = Query.new
		query.transactions = transactions
		query.opening_balance = opening_balance(user_id, year, month, day)
		
		return query
	end

	
	def self.opening_balance(user_id, year , month = 1, day = 1)
		return Transaction.sum(:amount, :conditions => [ 'user_id = ? and at < ? and enabled = ?', user_id,  DateTime.parse("#{year}-#{month}-#{day}"), true ])
	end

end
