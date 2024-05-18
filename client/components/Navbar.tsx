import Spacer from '@/components/Spacer';
import AccountDropdown from '@/components/AccountDropdown';

type Props = {
    session: any;
};

export default function Navbar({ session }: Props) {
    return (
        <nav
        // className="bg-gray-800"
        >
            <Spacer>
                <div className="relative flex h-20 items-center justify-between">
                    <h1>CourseFull</h1>
                    <AccountDropdown session={session} />
                </div>
            </Spacer>
        </nav>
    );
}
