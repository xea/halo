class Query


	def self.for_month(year, month)
		transactions = Transaction.all(:at.gte => "#{year}-#{month}")
	end
end
