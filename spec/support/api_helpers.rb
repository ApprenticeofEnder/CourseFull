require "jwt"

def auth_headers(user)
  auth_token = JWT.encode({ sub: user[:supabase_id].to_s }, ENV["JWT_SECRET"])
  { authorization: "Bearer #{auth_token}" }
end
