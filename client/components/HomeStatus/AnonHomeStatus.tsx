'use client';

import { Fragment } from 'react';
import { useRouter } from 'next/navigation';

import { Endpoints } from '@/lib/enums';
import LinkButton from '@/components/Button/LinkButton';

export default function AnonHomeStatus() {
    return (
        <Fragment>
            <div className="text-2xl p-4 my-5 text-center">
                Ready to say goodbye to calculating your passing requirements?
            </div>
            <div className="grid grid-cols-6 gap-4 text-center">
                <div className="col-start-2 col-end-4">
                    <LinkButton href={Endpoints.LOGIN}>Login</LinkButton>
                </div>
                <div className="col-start-4 col-end-6">
                    <LinkButton href={Endpoints.SIGN_UP}>Sign Up</LinkButton>
                </div>
            </div>
        </Fragment>
    );
}
