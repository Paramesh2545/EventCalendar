import React, { useState } from 'react'
import Day from './Day'
import EventModal from './EventModal'
import categories from './categories'
const Month = ({month}) => {
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const handleDayClick = (day) => {
        setSelectedSlot({
            date: day,
            startTime: 9, // Default will be 9 AM
            endTime: 10  // Default will be 10 AM
        });
        setShowEventModal(true);
    };

    return (
        <div className='flex-1'>
            {showEventModal && (
                <EventModal 
                    selectedSlot={selectedSlot}
                    closeModal={() => setShowEventModal(false)}
                />
            )}
            
            <div className='flex-1 grid grid-cols-7 grid-rows-5'>
                {month.map((row, i) => (
                    <React.Fragment key={i}>
                        {row.map((day, idx) => (
                            <Day 
                                day={day} 
                                key={idx} 
                                rowIdx={i}
                                onDayClick={() => handleDayClick(day)}
                            />
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Month;