import Spacer from '@/components/Spacer';
export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            <Spacer>
                <div className="flex flex-row justify-center">
                    <div className="w-3/4 sm:w-1/2 h-dvh flex flex-col justify-center gap-8">
                        {children}
                    </div>
                </div>
            </Spacer>
        </main>
    );
}
