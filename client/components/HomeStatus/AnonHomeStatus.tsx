'use client';

import { Fragment } from 'react';
import { useRouter } from 'next/navigation';

import { Endpoints } from '@/lib/enums';
import LinkButton from '@/components/Button/LinkButton';

export default function AnonHomeStatus() {
    return (
        <Fragment>
            <div className="text-2xl p-4 my-5 text-center">
                Ready to live your education to the fullest?
            </div>
            <div className="grid grid-cols-6 gap-4 text-center">
                <div className="col-start-2 col-end-4">
                    <LinkButton href={Endpoints.LOGIN} className="w-full">
                        Login
                    </LinkButton>
                </div>
                <div className="col-start-4 col-end-6">
                    <LinkButton href={Endpoints.SIGN_UP} className="w-full">
                        Sign Up
                    </LinkButton>
                </div>
            </div>
        </Fragment>
    );
}
