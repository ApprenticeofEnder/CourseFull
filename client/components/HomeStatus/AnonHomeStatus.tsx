'use client';

import { Fragment } from 'react';

import { Endpoints } from '@coursefull';
import LinkButton from '@/components/Button/LinkButton';

export default function AnonHomeStatus() {
    return (
        <Fragment>
            <div className="text-2xl p-4 my-5 text-center">
                Ready to live your education to the fullest?
            </div>
            <div className="grid grid-cols-6 gap-4 text-center">
                <div className="col-start-2 col-end-4">
                    <LinkButton
                        href={Endpoints.LOGIN}
                        className="w-full"
                        data-testid="home-login"
                    >
                        Login
                    </LinkButton>
                </div>
                <div className="col-start-4 col-end-6">
                    <LinkButton
                        href={Endpoints.SIGN_UP}
                        className="w-full"
                        data-testid="home-signup"
                    >
                        Sign Up
                    </LinkButton>
                </div>
            </div>
        </Fragment>
    );
}
