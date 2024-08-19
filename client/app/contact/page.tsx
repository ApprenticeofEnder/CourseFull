'use client';

import Link from '@components/Link';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
    return (
        <div className="flex flex-col sm:flex-row justify-center h-full my-14 gap-4">
            <div className="basis-1/2 flex flex-col gap-10 p-8 rounded-lg">
                <h1 className="text-left">Contact Us</h1>
                <ul className="list-disc text-xl">
                    <li>App not working right?</li>
                    <li>Got a feature you want to suggest?</li>
                    <li>Got an emergency related to the app?</li>
                </ul>
            </div>
            <div className="flex flex-col gap-10 bg-primary-800 border-primary-500/10 border-2 p-8 rounded-lg">
                <h2>Send us an email!</h2>
                <h3>
                    <EnvelopeIcon className="h-6 w-6 inline"></EnvelopeIcon>
                    <Link
                        href="mailto:support@coursefull.app"
                        className="text-2xl lg:text-3xl"
                        isBlock
                        color="foreground"
                    >
                        support@coursefull.app
                    </Link>
                </h3>

                <p>We&apos;ll do our best to reply within 1-3 business days.</p>
            </div>
        </div>
    );
}
