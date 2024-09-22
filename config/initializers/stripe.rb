# frozen_string_literal: true

Rails.configuration.stripe = {
  publishable_key: ENV['STRIPE_PUBLIC_KEY'],
  secret_key: ENV['STRIPE_SECRET_KEY'],
  webhook_secret: ENV['STRIPE_WEBHOOK_SECRET']
}

Stripe.api_key = Rails.configuration.stripe[:secret_key]
