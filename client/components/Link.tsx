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
            onClick={(e) => {
                e.preventDefault();
                router.push(href!);
            }}
            href={href}
            {...props}
        >
            {children}
        </Link>
    );
}
