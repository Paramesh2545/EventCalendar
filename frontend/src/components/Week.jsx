import React, { useEffect, useRef, useState, useContext } from 'react'
import dayjs from 'dayjs'
import EventModal from './EventModal'
import GlobalContext from '../context/GlobalContext'
import categories from './categories'

const Week = ({currentWeek}) => {
    const { savedEvents } = useContext(GlobalContext);
    const timeGridRef = useRef(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    
    const days = Array.isArray(currentWeek) ? currentWeek : currentWeek?.days || [];
    const currentTime = Array.isArray(currentWeek) ? {
        hour: dayjs().hour(),
        minute: dayjs().minute(),
        scrollPosition: dayjs().hour() * 80 - 200
    } : currentWeek?.currentTime;

    useEffect(() => {
        if (timeGridRef.current && currentTime) {
            timeGridRef.current.scrollTop = currentTime.scrollPosition;
        }
    }, [currentTime?.scrollPosition]);

    const hours = Array.from({ length: 24 }, (_, i) => {
        const hour = i;
        const meridiem = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        
        return {
            hour24: hour,
            hour12: hour12,
            meridiem: meridiem,
            label: `${hour12}:00 ${meridiem}`
        };
    });

    const handleTimeSlotClick = (day, timeSlot) => {
        setSelectedSlot({
            date: day,
            startTime: timeSlot.hour24,
            endTime: timeSlot.hour24 + 1
        });
        setSelectedEvent(null);
        setShowEventModal(true);
    };

    const handleEventClick = (event, day, e) => {
        e.stopPropagation(); 
        setSelectedEvent(event);
        setSelectedSlot({
            date: day,
            startTime: parseInt(event.startTime.split(':')[0]),
            endTime: parseInt(event.endTime.split(':')[0])
        });
        setShowEventModal(true);
    };

    return (
        <div className="flex flex-col h-screen w-full">
            {showEventModal && (
                <EventModal 
                    selectedSlot={selectedSlot}
                    closeModal={() => setShowEventModal(false)}
                    selectedEvent={selectedEvent}
                />
            )}

            <div className='grid grid-cols-[60px_repeat(7,1fr)] bg-white sticky top-0 z-50 border-b w-full'>
                <div className='h-20'></div>
                {days.map((day, idx) => (
                    <div 
                        key={idx}
                        className={`border-r border-gray-200 ${
                            day.isSame(dayjs(), 'day') ? 'bg-blue-50' : ''
                        }`}
                    >
                        <header className="flex flex-col pl-2 py-2">
                            <p className="text-sm text-gray-500">
                                {day.format("ddd")}
                            </p>
                            <h1 className="text-xl font-semibold text-center">
                                {day.date()}
                            </h1>
                        </header>
                    </div>
                ))}
            </div>

            <div 
                ref={timeGridRef}
                className="flex-1 overflow-y-auto w-full"
            >
                <div className='grid grid-cols-[60px_repeat(7,1fr)] w-full'>
                    {hours.map((timeSlot) => (
                        <React.Fragment key={timeSlot.hour24}>
                            <div className="h-20 border-b border-gray-200 sticky left-0 bg-white flex items-center justify-end pr-2 pl-2">
                                <span className="text-sm text-gray-500">
                                    {timeSlot.label}
                                </span>
                            </div>
                            
                            {days.map((day, idx) => {
                                const dayEvents = savedEvents.filter(
                                    evt => evt.day === day.format('YYYY-MM-DD')
                                );

                                return (
                                    <div 
                                        key={`${day.format('YYYY-MM-DD')}-${timeSlot.hour24}`}
                                        onClick={() => handleTimeSlotClick(day, timeSlot)}
                                        className={`h-20 border-b border-r border-gray-200 relative group cursor-pointer ${
                                            day.isSame(dayjs(), 'day') && timeSlot.hour24 === currentTime?.hour
                                                ? 'bg-blue-50'
                                                : ''
                                        }`}
                                    >
                                        {dayEvents
                                            .filter(evt => {
                                                const eventStart = parseInt(evt.startTime.split(':')[0]);
                                                return eventStart === timeSlot.hour24;
                                            })
                                            .map(evt => (
                                                <div
                                                    key={evt.id}
                                                    onClick={(e) => handleEventClick(evt, day, e)}
                                                    className={`absolute inset-x-0 z-10 mx-1 p-1 rounded text-white text-sm cursor-pointer hover:opacity-90 ${
                                                        categories.find(cat => cat.id === evt.category).color.replace('bg-', 'bg-opacity-75 bg-')
                                                    }`}
                                                >
                                                    <div className="font-semibold">{evt.title}</div>
                                                    <div className="text-xs">
                                                        {evt.startTime} - {evt.endTime}
                                                    </div>
                                                </div>
                                            ))
                                        }

                                        {day.isSame(dayjs(), 'day') && 
                                         timeSlot.hour24 === currentTime?.hour && (
                                            <div className="absolute w-full border-t-2 border-red-400" 
                                                 style={{ 
                                                     top: `${(currentTime?.minute / 60) * 100}%`
                                                 }}>
                                                <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-400 rounded-full"/>
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-25 transition-opacity"/>
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Week