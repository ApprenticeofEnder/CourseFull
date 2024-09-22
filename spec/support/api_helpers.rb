# frozen_string_literal: true

require 'jwt'

def auth_headers(user, confirmed = true)
  payload = {
    sub: user[:supabase_id].to_s,
    user_metadata: { email_confirmed: confirmed }
  }
  auth_token = JWT.encode(payload, ENV['JWT_SECRET'])
  { authorization: "Bearer #{auth_token}" }
end
