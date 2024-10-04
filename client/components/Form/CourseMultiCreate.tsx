import { Course, CourseMultiCreateProps, ItemStatus } from '@coursefull';
import { useEffect, useState } from 'react';
import { Input, Select, SelectItem } from '@nextui-org/react';
import Button from '@components/Button/Button';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function CourseMultiCreate({
    courses,
    setCourses,
    coursesRemaining,
    setCoursesRemaining,
}: CourseMultiCreateProps) {
    function handleTitleChange(index: number, newTitle: string) {
        const updatedCourses = [...courses];
        updatedCourses[index] = {
            ...updatedCourses[index],
            title: newTitle,
            course_code: updatedCourses[index]?.course_code || '',
            status: updatedCourses[index]?.status || ItemStatus.ACTIVE,
        };
        setCourses(updatedCourses);
    }

    function handleCourseCodeChange(index: number, newCourseCode: string) {
        const updatedCourses = [...courses];
        updatedCourses[index] = {
            ...updatedCourses[index],
            title: updatedCourses[index]?.title || '',
            course_code: newCourseCode,
            status: updatedCourses[index]?.status || ItemStatus.ACTIVE,
        };
        setCourses(updatedCourses);
    }

    function handleStatusChange(index: number, newStatusString: string) {
        let newStatus: ItemStatus;
        switch (newStatusString) {
            case ItemStatus.ACTIVE:
                newStatus = ItemStatus.ACTIVE;
                break;
            case ItemStatus.COMPLETE:
                newStatus = ItemStatus.COMPLETE;
                break;
            default:
                newStatus = ItemStatus.ACTIVE;
        }
        const updatedCourses = [...courses];
        updatedCourses[index] = {
            ...updatedCourses[index],
            title: updatedCourses[index]?.title || '',
            course_code: updatedCourses[index]?.course_code || '',
            status: newStatus,
        };
        setCourses(updatedCourses);
    }

    const removeCourse = (index: number) => {
        const updatedCourses = courses.filter((_, i) => i !== index);
        setCourses(updatedCourses);
        setCoursesRemaining(coursesRemaining + 1);
        console.log(coursesRemaining);
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
                {courses.map((course, index) => (
                    <div
                        key={index}
                        className="p-4 border-primary-500/10 border-2 rounded-lg space-y-4"
                    >
                        <Input
                            label="Course Title"
                            placeholder="Enter course title"
                            value={course?.title}
                            onChange={(e) =>
                                handleTitleChange(index, e.target.value)
                            }
                            className="max-w-xs"
                        />
                        <Input
                            label="Course Code"
                            placeholder="Enter course code"
                            value={course?.course_code}
                            onChange={(e) =>
                                handleCourseCodeChange(index, e.target.value)
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
