import { ChildrenProps } from '@coursefull';

export const metadata = {
    title: 'Settings',
};
export default function SettingsLayout({ children }: ChildrenProps) {
    return <div className="h-4/5">{children}</div>;
}
