# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
@products = Stripe::Product.list({ active: true })

@products.each do |product|
  price = Stripe::Price.retrieve(product.default_price)
  Api::V1::Product
    .find_or_initialize_by(stripe_id: product.id)
    .update!(name: product.name, description: product.description, price: price.unit_amount, stripe_price: product.default_price)
end
