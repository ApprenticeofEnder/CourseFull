import { ChildrenProps } from '@/types';

export default function Layout({ children }: ChildrenProps) {
    return (
        <div className="flex justify-center">
            <div className="flex max-w-lg flex-grow flex-col gap-4">
                {children}
            </div>
        </div>
    );
}
