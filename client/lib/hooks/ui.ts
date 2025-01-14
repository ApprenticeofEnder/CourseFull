import { GradeColours, ItemStatus, SemesterProgressType } from '@coursefull';
import { getLocalTimeZone, now, ZonedDateTime } from '@internationalized/date';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInSeconds,
} from 'date-fns';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
}

export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

export function useGradeColours(
    goal: number | undefined,
    grade: number | undefined,
    deliverableStatus?: ItemStatus // Only use this for deliverables
): GradeColours {
    return useMemo(() => {
        const defaultResult = {
            // For some reason this is a very light colour
            // and yet the success/danger colours are the inverse?
            bgColour: 'bg-primary-800',
            textColour: 'text-text',
        };
        if (goal === undefined || grade === undefined || grade === 0) {
            return defaultResult;
        }
        if (deliverableStatus && deliverableStatus !== ItemStatus.COMPLETE) {
            return defaultResult;
        }
        let indicator: string = 'danger';
        if (grade >= goal) {
            indicator = 'success';
        } else if (goal - grade <= 5) {
            indicator = 'warning';
        } else {
            indicator = 'danger';
        }
        return {
            bgColour: `bg-${indicator}-200`,
            textColour: `text-${indicator}-800`,
        };
    }, [goal, grade, deliverableStatus]);
}

export function useProgressColours(
    semesters: SemesterProgressType[] | undefined
): SemesterProgressType[] {
    return useMemo(() => {
        if (!semesters) {
            return [];
        }
        return semesters.map((semester) => {
            const { goal, average } = semester;
            const defaultResult = {
                // For some reason this is a very light colour
                // and yet the success/danger colours are the inverse?
                bgColour: 'bg-primary-800',
                textColour: 'text-text',
            };
            if (goal === undefined || average === undefined || average === 0) {
                return {
                    ...semester,
                    grade_colour: defaultResult,
                };
            }
            let indicator: string = 'danger';
            if (average >= goal) {
                indicator = 'success';
            } else if (goal - average <= 5) {
                indicator = 'warning';
            } else {
                indicator = 'danger';
            }
            return {
                ...semester,
                grade_colour: {
                    bgColour: `bg-${indicator}-200`,
                    textColour: `text-${indicator}-800`,
                },
            };
        });
    }, [semesters]);
}

interface TimeRemaining {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    message: string;
    status: ItemStatus;
}

export function useTimeRemaining(
    deadline: ZonedDateTime,
    status: ItemStatus
): TimeRemaining {
    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        message: '',
        status,
    });
    const getTimeRemaining = useCallback(() => {
        const deadlineDate = deadline.toDate();
        const currentDate = now(getLocalTimeZone()).toDate();
        const days = differenceInDays(deadlineDate, currentDate);
        const hours = differenceInHours(deadlineDate, currentDate);
        const minutes = differenceInMinutes(deadlineDate, currentDate);
        const seconds = differenceInSeconds(deadlineDate, currentDate);
        let messageVariableData = 'No time';
        if (days > 0) {
            messageVariableData = `${days} days`;
        } else if (hours > 0) {
            messageVariableData = `${hours} hours`;
        } else if (minutes > 0) {
            messageVariableData = `${minutes} minutes`;
        } else if (seconds >= 0) {
            messageVariableData = `${seconds} seconds`;
        }
        const incomplete = status !== ItemStatus.COMPLETE;
        setTimeRemaining({
            days,
            hours,
            minutes,
            seconds,
            status: seconds < 0 && incomplete ? ItemStatus.OVERDUE : status,
            message: `${messageVariableData} remaining`,
        });
    }, [deadline, status]);
    useEffect(() => {
        getTimeRemaining();
        const timer = setInterval(getTimeRemaining, 1000);
        return () => {
            clearInterval(timer);
        };
    }, [getTimeRemaining]);
    return timeRemaining;
}
