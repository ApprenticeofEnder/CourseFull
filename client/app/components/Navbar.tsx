import Spacer from '@/app/components/Spacer';
import AccountDropdown from '@/app/components/AccountDropdown';

export default function Navbar() {
    return (
        <nav className="bg-gray-800">
            <Spacer>
                <div className="relative flex h-16 items-center justify-between">
                    <h1>
                        <span className="sr-only">CourseFull</span>
                        CourseFull
                    </h1>
                    <AccountDropdown />
                </div>
            </Spacer>
        </nav>
    );
}
