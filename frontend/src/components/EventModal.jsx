import React, { useState, useContext, useEffect } from 'react';
import dayjs from 'dayjs';
import GlobalContext from '../context/GlobalContext';

import categories from './categories';
const EventModal = ({ selectedSlot, closeModal, selectedEvent }) => {
    const { dispatchCalEvent } = useContext(GlobalContext);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('work');
    const [date, setDate] = useState(selectedSlot.date.format('YYYY-MM-DD'));
    const [startTime, setStartTime] = useState(
        dayjs().hour(selectedSlot.startTime).format('HH:00')
    );
    const [endTime, setEndTime] = useState(
        dayjs().hour(selectedSlot.endTime).format('HH:00')
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedEvent) {
            setTitle(selectedEvent.title);
            setCategory(selectedEvent.category);
            setDate(selectedEvent.date);
            setStartTime(selectedEvent.startTime);
            setEndTime(selectedEvent.endTime);
        }
    }, [selectedEvent]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        const calendarEvent = {
            id: selectedEvent?.id || Date.now(),
            _id: selectedEvent?._id,
            title,
            category,
            date,
            startTime,
            endTime,
            day: selectedSlot.date.format('YYYY-MM-DD'),
            created: selectedEvent?.created || dayjs().format('YYYY-MM-DD HH:mm:ss')
        };

        try {
            const url = selectedEvent?._id 
                ? `http://localhost:3000/api/events/${selectedEvent._id}`
                : 'http://localhost:3000/api/events';
            
            const method = selectedEvent?._id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(calendarEvent)
            });

            if (!response.ok) {
                throw new Error(`Failed to save event: ${response.status} ${response.statusText}`);
            }

            const savedEvent = await response.json();
            console.log('Event saved to backend:', savedEvent);
            
            if (savedEvent._id) {
                calendarEvent._id = savedEvent._id;
            }
            
            dispatchCalEvent({ 
                type: selectedEvent?._id ? 'UPDATE' : 'PUSH', 
                payload: calendarEvent 
            });
            closeModal();
        } catch (error) {
            console.error('Error saving event:', error);
            setError('Failed to save event to server. It will be saved locally only.');
            
            dispatchCalEvent({ 
                type: selectedEvent?._id ? 'UPDATE' : 'PUSH', 
                payload: calendarEvent 
            });
            closeModal();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedEvent?._id) {
            dispatchCalEvent({ type: 'DELETE', payload: selectedEvent });
            closeModal();
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/events/${selectedEvent._id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete event: ${response.status} ${response.statusText}`);
            }

            dispatchCalEvent({ type: 'DELETE', payload: selectedEvent });
            closeModal();
        } catch (error) {
            console.error('Error deleting event:', error);
            setError('Failed to delete event from server. It will be deleted locally only.');
            
            dispatchCalEvent({ type: 'DELETE', payload: selectedEvent });
            closeModal();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">
                    {selectedEvent ? 'Edit Event' : 'Add Event'}
                </h2>
                
                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>
=
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Start Time</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">End Time</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between">
                        {selectedEvent && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Delete
                            </button>
                        )}
                        <div className="flex space-x-2 ml-auto">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventModal; 