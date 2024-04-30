// DEPRECATED

import DisclosureButton from '@/components/Button/DisclosureButton';
import { Disclosure } from '@headlessui/react';
import { Fragment, ReactElement } from 'react';

function DisclosureList({
    title,
    content,
}: {
    title: string;
    content: ReactElement[];
}) {
    return (
        <div className="flex flex-col justify-center text-sm m-2 w-full sm:w-1/2">
            <Disclosure>
                <Disclosure.Button className="w-max" as={DisclosureButton}>
                    {title}
                </Disclosure.Button>
                <Disclosure.Panel className="bg-sky-300 p-10 rounded-lg flex">
                    <div className="flex flex-col justify-between gap-4">
                        <ol className="list-decimal flex flex-col justify-between gap-4">
                            {content.map((elem) => {
                                return (
                                    <li>
                                        <div className="flex flex-col justify-around gap-4">
                                            {elem}
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>

                        <div className="text-sm">
                            *Yes, we are aware of the irony. We're working on
                            it!
                        </div>
                    </div>
                </Disclosure.Panel>
            </Disclosure>
        </div>
    );
}

const passwordManagementContent = [
    <Fragment>
        <div>
            <strong>Get a password manager. </strong>A password manager is the
            easiest, safest way of storing the increasing number of passwords we
            have to deal with.
        </div>
        <div>
            It helps take a load off your brain, it leads to fewer mistakes when
            filling out web forms, and most password managers are encrypted
            super well.
        </div>
        <div>
            <strong>Recommendations: </strong>
            Bitwarden, 1Password, Proton Pass
        </div>
    </Fragment>,
    <Fragment>
        <div>
            <strong>Use social logins. </strong>
            Social logins are what you use any time you log into a site with
            Google, Facebook, Microsoft, etc. No password = nothing to manage!
        </div>
    </Fragment>,
    <Fragment>
        <div>
            <strong>Make a system. </strong>
            Failing everything else, you can always make a new system to deal
            with passwords.
        </div>
    </Fragment>,
];

export default function PasswordAdviceCard() {
    return (
        <div className="text-center flex flex-col">
            <h1 className="text-xl m-5">Setting a Password</h1>
            <p className="m-5">
                Chances are, you've probably set a password before.
            </p>
            <p className="m-5">
                <strong>
                    However, passwords in general aren't the greatest thing.
                </strong>
            </p>
            <div className="flex sm:flex-row sm:justify-center sm:w-1/2">
                <DisclosureList
                    title="Tips for Dealing with Passwords"
                    content={passwordManagementContent}
                />
            </div>
        </div>
    );
}
