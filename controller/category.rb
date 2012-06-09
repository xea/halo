# Displays the current acocunt info
get "/categories" do
	@categories = Category.all

	haml :"/category/index"
end

post "/category/new" do
	cat = current_user.create_category params[:category_name]

	if cat.valid?
	else
		logger.error "Category creation failed: #{cat.errors.full_messages}"
		flash[:error] = cat.errors.full_messages.join "<br />"
	end

	redirect to :"/categories"
end
