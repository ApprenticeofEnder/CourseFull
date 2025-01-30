import { ItemStatus, SavedCourse, SavedSemester } from '@/types';

export function determineCourseGradeAndGoal(
    course: SavedCourse | null | undefined
) {
    if (!course) {
        return {
            grade: undefined,
            goal: undefined,
        };
    }
    const goal = course.goal;
    const isActive = course.status === ItemStatus.ACTIVE;

    if (isActive && course.grade === 0) {
        return {
            grade: undefined,
            goal,
        };
    }

    return {
        grade: course.grade,
        goal,
    };
}

export function determineSemesterAverageAndGoal(
    semester: SavedSemester | null | undefined
) {
    if (!semester) {
        return {
            average: undefined,
            goal: undefined,
        };
    }

    const goal = semester.goal;

    if (!semester.graded_courses || semester.graded_courses.length === 0) {
        return {
            average: undefined,
            goal,
        };
    }

    const gradeSum = semester.graded_courses.reduce((sum, course) => {
        return sum + course.grade;
    }, 0);
    const average = gradeSum / semester.graded_courses.length;

    return {
        average,
        goal,
    };
}
