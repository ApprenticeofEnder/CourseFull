import { ChildrenProps } from '@coursefull';

export const metadata = {
    title: 'Settings',
};
export default function SettingsLayout({ children }: ChildrenProps) {
    return (
        <div className="h-dvh flex flex-col justify-center gap-4 sm:w-3/4 mx-auto">
            {children}
        </div>
    );
}
