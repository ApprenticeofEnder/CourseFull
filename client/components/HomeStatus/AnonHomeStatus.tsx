'use client';

import { Fragment } from 'react';
import Button from '@/components/Button/Button';

export default function AnonHomeStatus() {
    return (
        <Fragment>
            <div className="text-2xl p-4 my-5 text-center">
                Ready to say goodbye to calculating your passing requirements?
            </div>
            <div className="grid grid-cols-6 gap-4 text-center">
                <div className="col-start-2 col-end-4">
                    If you have an account:
                    <Button
                        onClick={() => {
                            console.log('Login!');
                        }}
                    >
                        Login
                    </Button>
                </div>
                <div className="col-start-4 col-end-6">
                    If not:
                    <Button
                        onClick={() => {
                            console.log('Sign up!');
                        }}
                    >
                        Sign Up
                    </Button>
                </div>
            </div>
        </Fragment>
    );
}
