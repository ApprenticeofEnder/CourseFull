import { User } from '@supabase/supabase-js';
import * as jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';

const USER1_ID = randomUUID();
export const USER1: User = {
    id: USER1_ID,
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {
        first_name: 'Alpha',
        last_name: 'Test',
        email: 'alpha@test.com',
        sub: USER1_ID,
        email_verified: false,
        phone_verified: false,
    },
    aud: 'authenticated',
    created_at: '2024-05-08 03:46:50.517869+00',
};
const USER2_ID = randomUUID();
export const USER2: User = {
    id: USER2_ID,
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {
        first_name: 'Beta',
        last_name: 'Test',
        email: 'beta@test.com',
        sub: USER2_ID,
        email_verified: false,
        phone_verified: false,
    },
    aud: 'authenticated',
    created_at: '2024-05-08 03:46:50.517869+00',
};

const JWT_SECRET = process.env.JWT_SECRET;

export function userAccessToken(user: User) {
    return jwt.sign(
        {
            aud: 'authenticated',
            exp: 4000000000,
            iat: 1717800975,
            iss: 'http://127.0.0.1:54321/auth/v1',
            sub: user.id,
            email: user.email,
            phone: '',
            app_metadata: user.app_metadata,
            user_metadata: user.user_metadata,
            role: 'authenticated',
            aal: 'aal1',
            amr: [
                {
                    method: 'password',
                    timestamp: 1717800975,
                },
            ],
            session_id: '1e1e6b67-0f9e-4334-9c27-edcc2ce0259d',
            is_anonymous: false,
        },
        JWT_SECRET || ''
    );
}

export function jwtDecode(token: string) {
    return jwt.decode(token);
}
