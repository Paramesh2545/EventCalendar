import React, { useEffect, useRef, useState, useContext } from 'react'
import dayjs from 'dayjs'
import EventModal from './EventModal'
import GlobalContext from '../context/GlobalContext'
import categories from './categories'

const ShowDay = ({currentDay}) => {
    const { savedEvents } = useContext(GlobalContext);
    const timeGridRef = useRef(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    
    const currentTime = {
        hour: dayjs().hour(),
        minute: dayjs().minute(),
        scrollPosition: dayjs().hour() * 80 - 200
    };

    useEffect(() => {
        if (timeGridRef.current) {
            timeGridRef.current.scrollTop = currentTime.scrollPosition;
        }
    }, [currentTime.scrollPosition]);

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

    const day = currentDay || dayjs(); // Use provided day or default to today

    const dayEvents = savedEvents.filter(
        evt => evt.day === currentDay.format('YYYY-MM-DD')
    );

    const handleTimeSlotClick = (timeSlot) => {
        setSelectedSlot({
            date: day,
            startTime: timeSlot.hour24,
            endTime: timeSlot.hour24 + 1
        });
        setSelectedEvent(null);
        setShowEventModal(true);
    };

    const handleEventClick = (event, e) => {
        e.stopPropagation(); // Prevent time slot click
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
            
            <div className='grid grid-cols-[60px_1fr] bg-white sticky top-0 z-50 border-b w-full'>
                <div className='h-20'></div>
                <div className={`border-r border-gray-200 ${
                    day.isSame(dayjs(), 'day') ? 'bg-blue-50' : ''
                }`}>
                    <header className="flex flex-col pl-2 py-2">
                        <p className="text-sm text-gray-500">
                            {day.format("dddd")} {/* Full day name */}
                        </p>
                        <h1 className="text-xl font-semibold text-center">
                            {day.format("MMMM D")} {/* Month and day */}
                        </h1>
                    </header>
                </div>
            </div>

            <div 
                ref={timeGridRef}
                className="flex-1 overflow-y-auto w-full"
            >
                <div className='grid grid-cols-[60px_1fr] w-full'>
                    {hours.map((timeSlot) => (
                        <React.Fragment key={timeSlot.hour24}>
                            <div className="h-20 border-b border-gray-200 sticky left-0 bg-white flex items-center justify-end pr-2 pl-2">
                                <span className="text-sm text-gray-500">
                                    {timeSlot.label}
                                </span>
                            </div>
                            
                            <div 
                                onClick={() => handleTimeSlotClick(timeSlot)}
                                className={`h-20 border-b border-r border-gray-200 relative group cursor-pointer ${
                                    day.isSame(dayjs(), 'day') && timeSlot.hour24 === currentTime.hour
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
                                            onClick={(e) => handleEventClick(evt, e)}
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

                                <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-25 transition-opacity"/>
                                
                                {day.isSame(dayjs(), 'day') && timeSlot.hour24 === currentTime.hour && (
                                    <div className="absolute left-0 right-0 h-0.5 bg-red-500 z-20">
                                        <div className="absolute right-0 w-2 h-2 bg-red-500 rounded-full transform translate-y-[-4px]"/>
                                    </div>
                                )}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShowDay;