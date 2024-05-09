"use client";

import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import * as React from 'react';

interface Memo {
    date: Date;
    content: string;
}

const MemoCalendar_17ER2 = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const [memos, setMemos] = useState<Memo[]>([]);
    const [memoInput, setMemoInput] = React.useState<string>("");

    const handleSelect = (date: Date) => {
        setDate(date);
        const selectedMemo = memos.find(m => m.date.getTime() === date.getTime());
        setMemoInput(selectedMemo ? selectedMemo.content : "");
    };

    const saveMemo = () => {
        setMemos(prevMemos => [
            ...prevMemos.filter(m => m.date.getTime() !== date?.getTime()),
            { date: date!, content: memoInput },
        ]);
    };

    return (
        <div className="grid grid-rows-2 space-y-4">
            <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelect}
                className="rounded-md border"
            />

            <div className="flex space-x-3 dark:bg-black">
                <Input value={memoInput} onChange={e => setMemoInput(e.target.value)} placeholder="Add a memo here..." />
                <button onClick={saveMemo} className="bg-blue-500 hover:bg-blue-600 text-white rounded py-2 px-4">Save</button>
            </div>
        </div>
    );
}

export default MemoCalendar_17ER2;