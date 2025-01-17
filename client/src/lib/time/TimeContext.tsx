'use client';

import { ZonedDateTime, getLocalTimeZone, now } from '@internationalized/date';
import {
    Dispatch,
    FC,
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useReducer,
    useState,
} from 'react';

import { timeReducer } from '@/lib/time/timeReducer';
import { TimeAction, TimeState } from '@/types/time';

export const TimeContext = createContext<TimeState | null>(null);
export const TimeDispatchContext = createContext<Dispatch<TimeAction> | null>(
    null
);

const TimeProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [time, setTime] = useState<ZonedDateTime>(now(getLocalTimeZone()));

    const updateTime = useCallback(() => {
        setTime(now(getLocalTimeZone()));
    }, [setTime]);

    useEffect(() => {
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => {
            clearInterval(timer);
        };
    }, [updateTime]);

    const initialState: TimeState = {
        deliverables: {
            urgent: [],
            overdue: [],
        },
        time,
    };

    const [timeState, dispatch] = useReducer(timeReducer, initialState);

    return (
        <TimeContext.Provider value={timeState}>
            <TimeDispatchContext.Provider value={dispatch}>
                {children}
            </TimeDispatchContext.Provider>
        </TimeContext.Provider>
    );
};

export function useTime() {
    return useContext(TimeContext)!;
}

export function useTimeDispatch() {
    return useContext(TimeDispatchContext)!;
}

export default TimeProvider;
