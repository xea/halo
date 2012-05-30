# Defines a transaction category
#
# Categories are used to make sorting and filtering transactions easier. For example you can group all your food
# related transactions into a category called "Food"
class Category

  include DataMapper::Resource

  property :id, Serial
  property :name, String

  has n, :transactions
end