import { Course, CourseMultiCreateProps, ItemStatus } from '@coursefull';
import { useEffect, useState } from 'react';
import { Input, Select, SelectItem } from '@nextui-org/react';
import Button from '@components/Button/Button';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function CourseMultiCreate({
    coursesRemaining,
    setCoursesRemaining,
    semester,
    setSemester,
}: CourseMultiCreateProps) {
    function updateCourseTitle(targetIndex: number, title: string) {
        setSemester((semester) => ({
            ...semester,
            courses: semester.courses.map((course, index) => {
                if (index !== targetIndex) {
                    return course;
                }
                return {
                    ...course,
                    title,
                };
            }),
        }));
    }

    function updateCourseCode(targetIndex: number, course_code: string) {
        setSemester((semester) => ({
            ...semester,
            courses: semester.courses.map((course, index) => {
                if (index !== targetIndex) {
                    return course;
                }
                return {
                    ...course,
                    course_code,
                };
            }),
        }));
    }

    function handleStatusChange(targetIndex: number, newStatusString: string) {
        let status: ItemStatus;
        switch (newStatusString) {
            case ItemStatus.ACTIVE:
                status = ItemStatus.ACTIVE;
                break;
            case ItemStatus.COMPLETE:
                status = ItemStatus.COMPLETE;
                break;
            default:
                status = ItemStatus.ACTIVE;
        }
        setSemester((semester) => ({
            ...semester,
            courses: semester.courses.map((course, index) => {
                if (index !== targetIndex) {
                    return course;
                }
                return {
                    ...course,
                    status,
                };
            }),
        }));
    }

    const removeCourse = (targetIndex: number) => {
        setSemester((semester) => ({
            ...semester,
            courses: semester.courses.filter(
                (_, index) => index !== targetIndex
            ),
        }));
        setCoursesRemaining((coursesRemaining) => coursesRemaining + 1);
    };

    return (
        <div>
            <p className="text-center">
                You have {coursesRemaining} courses left on your account.
            </p>
            <p className="text-center">
                Generally, people don&apos;t take more than 6 courses in a
                semester.
            </p>
            <div className="flex flex-col gap-4">
                {semester.courses.map((course, index) => (
                    <div
                        key={index}
                        className="p-4 border-primary-500/10 border-2 rounded-lg space-y-4"
                    >
                        <Input
                            label="Course Code"
                            placeholder="Enter course code"
                            value={course?.course_code}
                            onChange={(e) =>
                                updateCourseCode(index, e.target.value)
                            }
                            className="max-w-xs"
                        />
                        <Input
                            label="Course Title"
                            placeholder="Enter course title"
                            value={course?.title}
                            onChange={(e) =>
                                updateCourseTitle(index, e.target.value)
                            }
                            className="max-w-xs"
                        />
                        <Select
                            label="Status"
                            placeholder="Select course status"
                            selectedKeys={[course?.status || ItemStatus.ACTIVE]}
                            onChange={(e) =>
                                handleStatusChange(index, e.target.value)
                            }
                            className="max-w-xs"
                        >
                            <SelectItem
                                key={ItemStatus.ACTIVE}
                                value={ItemStatus.ACTIVE}
                                textValue="Active"
                            >
                                Active
                            </SelectItem>
                            <SelectItem
                                key={ItemStatus.COMPLETE}
                                value={ItemStatus.COMPLETE}
                                textValue="Complete"
                            >
                                Complete
                            </SelectItem>
                        </Select>
                        <Button
                            buttonType="danger"
                            onPress={() => removeCourse(index)}
                            startContent={<TrashIcon className="h-6 w-6" />}
                        >
                            Remove Course
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
