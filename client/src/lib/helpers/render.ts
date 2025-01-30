import { DateFormatter, getLocalTimeZone, now } from '@internationalized/date';

import {
    determineCourseGradeAndGoal,
    determineSemesterAverageAndGoal,
} from '@/lib/helpers/calculations';
import {
    ItemStatus,
    SavedCourse,
    SavedDeliverable,
    SavedSemester,
    SemesterProgressType,
} from '@/types';

export function renderSemesterProgressAverage(
    progressItem: SemesterProgressType | null | undefined
): string {
    const hasGrades = !!progressItem?.num_graded_courses;
    const average = hasGrades ? progressItem.average : undefined;

    return renderMarkVsGoal(average, progressItem?.goal);
}

export function renderMarkVsGoal(
    mark: number | undefined,
    goal: number | undefined
) {
    let markText = '--';
    let goalText = '--';

    if (mark !== undefined) {
        markText = mark.toFixed(0);
    }

    if (goal !== undefined) {
        goalText = goal.toFixed(0);
    }

    return `${markText} / ${goalText} %`;
}

export function renderSemesterAverage(
    semester: SavedSemester | null | undefined
) {
    const { average, goal } = determineSemesterAverageAndGoal(semester);

    return renderMarkVsGoal(average, goal);
}

export function renderCourseGrade(course: SavedCourse | null | undefined) {
    const { grade, goal } = determineCourseGradeAndGoal(course);

    return renderMarkVsGoal(grade, goal);
}

export function renderDeliverableMark(
    deliverable: SavedDeliverable | null | undefined
) {
    const isComplete = deliverable?.status === ItemStatus.COMPLETE;
    const mark = isComplete ? deliverable.mark : undefined;

    return renderMarkVsGoal(mark, deliverable?.goal);
}

export function renderDeliverableDeadline(
    deliverable: SavedDeliverable | null | undefined,
    formatter: DateFormatter
) {
    if (!deliverable) {
        return formatter.format(now(getLocalTimeZone()).toDate());
    }
    return formatter.format(deliverable.deadline.toDate());
}

export function readableStatus(status: ItemStatus) {
    switch (status) {
        case ItemStatus.NOT_STARTED:
            return 'Not started';
        case ItemStatus.ACTIVE:
            return 'Active';
        case ItemStatus.COMPLETE:
            return 'Completed';
        case ItemStatus.URGENT:
            return 'Urgent';
        case ItemStatus.OVERDUE:
            return 'Overdue';
    }
}
