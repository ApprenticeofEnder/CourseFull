'use client';

import { getLocalTimeZone, now } from '@internationalized/date';
import { differenceInSeconds } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { determineCourseGradeAndGoal } from '@/lib/helpers';
import { useTime, useTimeDispatch } from '@/lib/time/TimeContext';
import {
    GradeColours,
    ItemStatus,
    SavedCourse,
    SavedDeliverable,
    SemesterProgressType,
} from '@/types';

export function useWindowDimensions() {
    const hasWindow = typeof window !== 'undefined';

    const getWindowDimensions = useCallback(() => {
        const width = hasWindow ? window.innerWidth : null;
        const height = hasWindow ? window.innerHeight : null;
        return {
            width,
            height,
        };
    }, [hasWindow]);

    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    );

    useEffect(() => {
        if (hasWindow) {
            function handleResize() {
                setWindowDimensions(getWindowDimensions());
            }

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [hasWindow, getWindowDimensions]);

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

export function useCourseGradeColours(course: SavedCourse | null | undefined) {
    const { grade, goal } = determineCourseGradeAndGoal(course);

    return useGradeColours(goal, grade);
}

export function useCourseProgressCard(course: SavedCourse | null | undefined) {
    const { bgColour, textColour } = useCourseGradeColours(course);
    switch (bgColour) {
        case 'bg-success-200': {
            return {
                bgColour,
                textColour,
                message: "You're on track!",
            };
        }
        case 'bg-warning-200': {
            return {
                bgColour,
                textColour,
                message: "You're getting there!",
            };
        }
        case 'bg-warning-200': {
            return {
                bgColour,
                textColour,
                message: 'You might need some help here!',
            };
        }
        default: {
            return {
                bgColour,
                textColour,
                message: 'No marks yet.',
            };
        }
    }
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
    deadlineMessage: string;
    status: ItemStatus;
}

export function useDeliverableStatusObserver(
    deliverable: SavedDeliverable | null | undefined,
    status: ItemStatus
) {
    const timeDispatch = useTimeDispatch();
    useEffect(() => {
        if (!deliverable) {
            return;
        }
        switch (status) {
            case ItemStatus.URGENT: {
                timeDispatch({
                    type: 'ADD_URGENT_DELIVERABLE',
                    payload: deliverable,
                });
                return;
            }
            case ItemStatus.OVERDUE: {
                timeDispatch({
                    type: 'ADD_OVERDUE_DELIVERABLE',
                    payload: deliverable,
                });
                return;
            }
            case ItemStatus.COMPLETE: {
                timeDispatch({
                    type: 'COMPLETE_DELIVERABLE',
                    payload: deliverable,
                });
                return;
            }
        }
    }, [deliverable, status, timeDispatch]);
}

interface DeliverableIndicator {
    chipColour: 'primary' | 'danger' | 'warning';
    showChip: boolean;
}

export function useDeliverablesIndicator(
    upcomingDeliverables: SavedDeliverable[] | undefined
): DeliverableIndicator {
    const {
        deliverables: { overdue, urgent },
    } = useTime();

    return useMemo(() => {
        if (!upcomingDeliverables) {
            return {
                showChip: false,
                chipColour: 'primary',
            };
        }
        const overdueCount = overdue.length;
        const urgentCount = urgent.length;

        let chipColour: 'primary' | 'danger' | 'warning' = 'primary';
        if (urgentCount > 0) {
            chipColour = 'warning';
        }
        if (overdueCount > 0) {
            chipColour = 'danger';
        }

        return {
            chipColour,
            showChip: upcomingDeliverables.length > 0,
        };
    }, [overdue, urgent, upcomingDeliverables]);
}

export function useTimeRemaining(
    deliverable: SavedDeliverable | null | undefined
): TimeRemaining {
    const { time } = useTime();

    const { deadlineDate, currentStatus } = useMemo(() => {
        if (!deliverable) {
            return {
                deadlineDate: now(getLocalTimeZone()).toDate(),
                currentStatus: ItemStatus.ACTIVE,
            };
        }
        return {
            deadlineDate: deliverable.deadline.toDate(),
            currentStatus: deliverable.status,
        };
    }, [deliverable]);

    const timeRemainingData = useMemo(() => {
        const currentDate = time.toDate();
        const seconds = differenceInSeconds(deadlineDate, currentDate);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (currentStatus === ItemStatus.COMPLETE) {
            return {
                days,
                hours,
                minutes,
                seconds,
                status: currentStatus,
                deadlineMessage: `Done`,
            };
        }

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

        const stillTimeRemaining = seconds > 0;
        const isBeyondThreeDays = days >= 3;
        let status = ItemStatus.OVERDUE;
        if (stillTimeRemaining) {
            status = ItemStatus.URGENT;
        }
        if (isBeyondThreeDays) {
            status = ItemStatus.ACTIVE;
        }

        return {
            days,
            hours,
            minutes,
            seconds,
            status,
            deadlineMessage: `${messageVariableData} remaining`,
        };
    }, [deadlineDate, time, currentStatus]);

    const { status } = timeRemainingData;

    useDeliverableStatusObserver(deliverable, status);

    return timeRemainingData;
}
