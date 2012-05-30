# Encapsulates an arbitrary monetary transaction
class Transaction

  include DataMapper::Resource

  property :id, Serial

  property :amount, Float, :required => true, :default => 0.0

  # When was the transaction completed
  property :at, DateTime, :required => true, :default => DateTime.now
  property :comment, String

  property :enabled, Boolean, :required => true, :default => true

  belongs_to :category

  # Indicates if this transaction happened today
  def is_today?
  end

  # Indicates if this transaction will happen in the future
  def future?
  end

  # Indicates if this transaction happened in the past
  def past?
  end
end