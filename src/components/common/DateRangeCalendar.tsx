import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface DateRangeCalendarProps {
    startDate: string;
    endDate: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
}

export function DateRangeCalendar({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
}: DateRangeCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectingStart, setSelectingStart] = useState(true);

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const parseDate = (dateStr: string) => {
        return dateStr ? new Date(dateStr + 'T00:00:00') : null;
    };

    const isDateInRange = (date: Date) => {
        const start = parseDate(startDate);
        const end = parseDate(endDate);
        if (!start || !end) return false;
        return date >= start && date <= end;
    };

    const isDateSelected = (date: Date) => {
        const dateStr = formatDate(date);
        return dateStr === startDate || dateStr === endDate;
    };

    const handleDateClick = (day: number) => {
        const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dateStr = formatDate(selectedDate);

        if (selectingStart) {
            onStartDateChange(dateStr);
            setSelectingStart(false);
        } else {
            if (new Date(dateStr) < parseDate(startDate)!) {
                onStartDateChange(dateStr);
                onEndDateChange(startDate);
            } else {
                onEndDateChange(dateStr);
            }
            setSelectingStart(true);
        }
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="rounded-lg border border-gray-300 bg-white p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">{monthName}</h3>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handlePrevMonth}
                                    className="h-8 w-8"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleNextMonth}
                                    className="h-8 w-8"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="mb-2 grid grid-cols-7 gap-1">
                            {weekDays.map((day) => (
                                <div key={day} className="text-center text-xs font-medium text-gray-500">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {days.map((day, index) => {
                                if (day === null) {
                                    return <div key={`empty-${index}`} className="h-8" />;
                                }

                                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                const dateStr = formatDate(date);
                                const isSelected = isDateSelected(date);
                                const isInRange = isDateInRange(date);
                                const isStart = dateStr === startDate;
                                const isEnd = dateStr === endDate;

                                return (
                                    <button
                                        key={day}
                                        onClick={() => handleDateClick(day)}
                                        className={`h-8 rounded text-sm font-medium transition-colors ${isSelected
                                                ? isStart || isEnd
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-blue-100 text-blue-900'
                                                : isInRange
                                                    ? 'bg-blue-50 text-gray-900'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="w-48">
                    <div className="space-y-3 rounded-lg border border-gray-300 bg-white p-4">
                        <div>
                            <p className="text-xs font-medium text-gray-500">Start Date</p>
                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                {startDate ? new Date(startDate + 'T00:00:00').toLocaleDateString('en-US') : 'Not selected'}
                            </p>
                        </div>
                        <div className="border-t border-gray-200" />
                        <div>
                            <p className="text-xs font-medium text-gray-500">End Date</p>
                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                {endDate ? new Date(endDate + 'T00:00:00').toLocaleDateString('en-US') : 'Not selected'}
                            </p>
                        </div>
                        <div className="border-t border-gray-200" />
                        <div className="pt-2">
                            <p className="text-xs font-medium text-gray-500">Mode</p>
                            <p className="mt-1 text-sm text-gray-700">
                                {selectingStart ? 'Select start date' : 'Select end date'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
