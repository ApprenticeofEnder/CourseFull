'use client';

import { Fragment } from 'react';

export default function EmailVerify() {
    return (
        <Fragment>
            <h2>Email Verification Sent</h2>
            <p className="text-center">
                {
                    "You'll need to verify your email address before you can start using CourseFull."
                }
            </p>
        </Fragment>
    );
}
