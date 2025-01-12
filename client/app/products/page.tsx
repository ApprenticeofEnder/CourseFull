'use client';
import ProductCard from '@components/Card/Product';
import { classNames } from '@lib/helpers';
import { useProtectedEndpoint, useSession } from '@lib/supabase/SessionContext';
import { Product } from '@coursefull';
import { getProducts } from '@services/productsService';
import { Spinner } from '@nextui-org/react';
import { useEffect, useState } from 'react';
export default function ProductsPage() {
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);

    const [error, setError] = useState<any>(null);
    const { session, loadingSession } = useSession()!;

    useProtectedEndpoint(session, loadingSession);

    useEffect(() => {
        if (!session) {
            return;
        }
        let mounted = true;

        getProducts(session)
            .then((products) => {
                if (mounted) {
                    setProducts(products);
                    setLoadingProducts(false);
                }
            })
            .catch((err) => {
                setError(err);
            });
        return () => {
            mounted = false;
        };
    }, [session]);
    if(error){
        throw error;
    }

    return (
        <div className="flex flex-col justify-start gap-8">
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
