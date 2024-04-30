import Button, { ButtonProps } from '@/components/Button/Button';
import { useRouter } from 'next/navigation';

export interface LinkButtonProps extends ButtonProps {
    href: string;
}

export default function LinkButton({ children, href }: LinkButtonProps) {
    const router = useRouter();
    return <Button onPressEnd={() => router.push(href)}>{children}</Button>;
}
