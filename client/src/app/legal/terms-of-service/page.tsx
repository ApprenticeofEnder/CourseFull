'use client';

import useWindowDimensions from '@/lib/hooks/ui';
import { Divider } from '@nextui-org/react';
import { useMemo } from 'react';

export default function Page() {
    const { width } = useWindowDimensions();

    const dividerOrientation: 'horizontal' | 'vertical' = useMemo(() => {
        return width >= 640 ? 'vertical' : 'horizontal';
    }, [width]);

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="md:basis-1/3">
                <h2>Terms of Service</h2>
            </div>
            <Divider orientation={dividerOrientation}></Divider>
            <div className="md:basis-2/3">Coming soon?</div>
        </div>
    );
}
