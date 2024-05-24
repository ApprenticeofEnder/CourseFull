'use client';

import { ReadableStatus, courseURL } from '@/lib/helpers';
import { Course } from '@/lib/types';
import LinkButton from '../Button/LinkButton';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Image } from '@nextui-org/react';

export default function CourseCard({
    id,
    title,
    course_code,
    status,
    goal,
    grade,
}: Course) {
    // const [img, setImg] = useState<string>('');

    // let mounted = true;
    // useEffect(() => {
    //     if (img) {
    //         return;
    //     }
    //     console.log('Firing request');
    //     axios
    //         .get('/random-image')
    //         .then((res) => {
    //             setImg(res.data.imageURL);
    //         })
    //         .catch((err) => {
    //             alert(err);
    //         });
    //     return () => {
    //         mounted = false;
    //     };
    // }, [img]);

    return (
        <div className="rounded-lg bg-primary-800 p-2 border-solid border-2 border-primary-500/10">
            <div className="flex justify-between">
                <h4>Goal: {goal}%</h4>
                <h4>Grade: {grade || '--'}%</h4>
            </div>
            <div className="flex justify-center">
                <Image
                    width={300}
                    alt="NextUI hero Image"
                    src={''}
                    // isLoading={true}
                />
            </div>

            <h3 className="text-left">{course_code}</h3>
            <h4 className="text-left">{title}</h4>
            <h4 className="text-left italic">{ReadableStatus(status)}</h4>
            <LinkButton className="mt-3 w-full" href={courseURL(id)}>
                Visit
            </LinkButton>
        </div>
    );
}
