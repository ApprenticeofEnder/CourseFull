'use client';
import { useSearchParams } from 'next/navigation';
export default function ProductsPage() {
    const searchParams = useSearchParams();
    return (
        <div className="h-dvh flex flex-col justify-center gap-8">
            <h1>Products</h1>
        </div>
    );
}
