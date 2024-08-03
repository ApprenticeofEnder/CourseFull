'use client';
import ProductCard from '@/components/Card/Product';
import { Endpoints } from '@/lib/enums';
import { classNames } from '@/lib/helpers';
import { useProtectedEndpoint, useSession } from '@/lib/session/sessionContext';
import { Product } from '@/lib/types';
import { getProducts } from '@/services/productsService';
import { Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
export default function ProductsPage() {
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);

    const router = useRouter();

    const { session, loadingSession } = useSession()!;

    useProtectedEndpoint(session, loadingSession, router);

    useEffect(() => {
        if (!session) {
            return;
        }
        let mounted = true;

        getProducts(session, (error) => {
            console.error(error.message);
        })
            .then(({ response }) => {
                if (mounted) {
                    const data: Product[] = response?.data;
                    setProducts(data);
                    setLoadingProducts(false);
                }
            })
            .catch();
        return () => {
            mounted = false;
        };
    }, [session]);
    return (
        <div className="h-dvh flex flex-col justify-center gap-8">
            <h1>Products</h1>
            {loadingProducts ? (
                <Spinner label="One sec while we grab what we have..." />
            ) : (
                <></>
            )}
            {products ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {products.map((product) => (
                        <ProductCard
                            className={classNames(
                                products.length == 1
                                    ? 'sm:col-span-2 md:col-start-2 md:col-span-1'
                                    : ''
                            )}
                            key={product.stripe_id}
                            {...product}
                            isCourseTicket={product.name === 'Course Ticket'}
                        />
                    ))}
                </div>
            ) : (
                'No products found.'
            )}
        </div>
    );
}
