import Image from 'next/image';
import Navbar from './components/Navbar';
import Spacer from './components/Spacer';

export default function Home() {
    return (
        <main>
            <Navbar />
            <Spacer>
                <h1 className="italic">Hello!</h1>
            </Spacer>
        </main>
    );
}
