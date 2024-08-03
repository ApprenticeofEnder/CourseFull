import { Link, LinkProps } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

export default function CourseFullLink({
    children,
    href,
    ...props
}: LinkProps) {
    const router = useRouter();

    return (
        <Link
            onPressEnd={() => {
                router.push(href!);
            }}
            href={href}
            {...props}
        >
            {children}
        </Link>
    );
}
