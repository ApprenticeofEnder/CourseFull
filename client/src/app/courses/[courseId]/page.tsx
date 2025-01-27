import { FC } from 'react';

import CoursePage from './course';

interface CoursePageProps {
    params: Promise<{ courseId: string }>;
}

const Page: FC<CoursePageProps> = async ({ params }) => {
    const { courseId } = await params;
    // I would LOVE to use SSR assistance for this, but the way the Deliverables are, they can't be passed from server components to client components
    return <CoursePage courseId={courseId} />;
};

export default Page;
