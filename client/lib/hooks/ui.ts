import { ItemStatus } from '@coursefull';
import { getLocalTimeZone, now, ZonedDateTime } from '@internationalized/date';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInSeconds,
} from 'date-fns';

interface GradeColours {
    bgColour: string;
    textColour: string;
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

interface TimeRemaining {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    message: string;
    status: ItemStatus;
}

export function useTimeRemaining(deadline: ZonedDateTime, status: ItemStatus): TimeRemaining {
    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        message: '',
        status
    });
    function getTimeRemaining() {
        const deadlineDate = deadline.toDate();
        const currentDate = now(getLocalTimeZone()).toDate();
        const days = differenceInDays(deadlineDate, currentDate);
        const hours = differenceInHours(deadlineDate, currentDate);
        const minutes = differenceInMinutes(deadlineDate, currentDate);
        const seconds = differenceInSeconds(deadlineDate, currentDate);
        let messageVariableData = 'No time';
        if(days > 0){
            messageVariableData = `${days} days`;
        } else if (hours > 0){
            messageVariableData = `${hours} hours`;
        } else if (minutes > 0){
            messageVariableData = `${minutes} minutes`;
        } else if (seconds >= 0){
            messageVariableData = `${seconds} seconds`;
        }
        const incomplete = status !== ItemStatus.COMPLETE;
        setTimeRemaining({
            days,
            hours,
            minutes,
            seconds,
            status: (seconds < 0 && incomplete) ? ItemStatus.OVERDUE : status,
            message: `${messageVariableData} remaining`,
        });
    }
    useEffect(() => {
        getTimeRemaining();
        const timer = setInterval(getTimeRemaining, 1000);
        return () => {
            clearInterval(timer);
        };
    }, [deadline, status]);
    return timeRemaining;
}
