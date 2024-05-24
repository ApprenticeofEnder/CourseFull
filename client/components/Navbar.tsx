import Spacer from '@/components/Spacer';
import AccountDropdown from '@/components/AccountDropdown';

type Props = {
    session: any;
};

export default function Navbar({ session }: Props) {
    return (
        <nav className="flex justify-center">
            <Spacer className="fixed z-20 w-full">
                <div className="relative flex h-20 items-center justify-between bg-background-900">
                    <h1>CourseFull</h1>
                    <AccountDropdown session={session} />
                </div>
            </Spacer>
        </nav>
    );
}
