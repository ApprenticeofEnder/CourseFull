'use client';
import { Modal, useDisclosure } from '@nextui-org/react';
import { Fragment, useState } from 'react';

import CourseCard from '@components/Card/Course';
import UpdateCourseModal from '@components/Modal/UpdateCourse';
import { Course, SessionProps, Updated } from '@coursefull';

interface CoursesProps extends SessionProps {
    courses: Course[];
}

export default function Courses({ courses, session }: CoursesProps) {
    const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

    const updateCourseModal = useDisclosure();

    return (
        <Fragment>
            {(courses.length && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {courses.map((course) => {
                        return (
                            <CourseCard
                                {...(course as Updated<Course>)}
                                handleEdit={() => {
                                    setCurrentCourse(course);
                                    updateCourseModal.onOpen();
                                }}
                                handleDelete={() => {}}
                                session={session}
                                key={course.id}
                            />
                        );
                    })}
                </div>
            )) || (
                <p>
                    Looks like you don&quot;t have any courses. Time to add
                    some!
                </p>
            )}
            <Modal
                isOpen={updateCourseModal.isOpen}
                onOpenChange={updateCourseModal.onOpenChange}
                className="bg-sky-100"
            >
                <UpdateCourseModal session={session} course={currentCourse} />
            </Modal>
        </Fragment>
    );
}
