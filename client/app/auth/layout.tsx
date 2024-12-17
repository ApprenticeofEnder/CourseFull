import { ChildrenProps } from '@coursefull';

export const metadata = {
    title: 'Settings',
};
export default function SettingsLayout({ children }: ChildrenProps) {
    return (
        <div className="flex flex-col justify-start gap-4 sm:w-3/4 mx-auto">
            {children}
        </div>
    );
}
