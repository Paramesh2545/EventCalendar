import React, { useContext } from 'react'
import dayjs from 'dayjs'
import GlobalContext from '../context/GlobalContext'
import categories from './categories'
const Day = ({ day, rowIdx, onDayClick }) => {
    const { savedEvents } = useContext(GlobalContext);

    const dayEvents = savedEvents.filter(
        evt => evt.day === day.format('YYYY-MM-DD')
    );

    const getCurrentDayClass = () => {
        return day.isSame(dayjs(), "day") 
            ? "bg-blue-600 text-white rounded-full w-7"
            : "";
    };

    return (
        <div 
            onClick={onDayClick}
            className='border border-gray-200 flex flex-col cursor-pointer min-h-[100px]'
        >
            <header className='flex flex-col items-center'>
                {rowIdx === 0 && (
                    <p className='text-sm mt-1'>
                        {day.format("ddd").toUpperCase()}
                    </p>
                )}
                <p className={`text-sm p-1 my-1 text-center ${getCurrentDayClass()}`}>
                    {day.format("DD")}
                </p>
            </header>
            <div className="flex-1 overflow-y-auto">
                {dayEvents.map((evt, idx) => (
                    <div
                        key={evt.id}
                        className={`px-2 py-1 mx-1 mb-1 truncate text-sm rounded text-white ${
                            categories.find(cat => cat.id === evt.category).color.replace('bg-', 'bg-opacity-75 bg-')
                        }`}
                    >
                        <div className="font-semibold truncate">{evt.title}</div>
                        <div className="text-xs">
                            {evt.startTime} - {evt.endTime}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Day;