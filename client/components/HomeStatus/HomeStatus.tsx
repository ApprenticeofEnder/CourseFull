import { SessionProps } from '@/lib/types';
import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Endpoints } from '@/lib/helpers';

export default function HomeStatus({ session }: SessionProps) {
    const [progress, setProgress] = useState<object[] | null>(null);

    useEffect(() => {
        async function requestProgress() {
            const { data } = await axios.get(Endpoints.API_PROGRESS, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });
            setProgress(data);
        }

        requestProgress().catch((err) => {
            alert('Error:' + err.message);
        });
    }, []);
    return (
        <Fragment>
            {progress?.length ? (
                progress.map((semesterProgress: object) => {
                    return <p>{JSON.stringify(semesterProgress)}</p>;
                })
            ) : (
                <p>No progress made.</p>
            )}
            {/* 
            Progress
                - If a semester is active, display the current average vs the goal
                - Otherwise . . . how do I want to handle that?
            Semester Select
            Probably a modal for creating a semester too
            */}

            {/* 
            1. Send a request to grab the active and completed semesters
            2. 
            3. 
            */}
        </Fragment>
    );
}
