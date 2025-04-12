import React, { useState, useEffect, useReducer } from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";
import savedEventsReducer from "./EventReducer";

export default function ContextWrapper(props) {
  const [dateIndices, setDateIndices] = useState({
    year: dayjs().year(),
    month: dayjs().month(),
    week: Math.floor(dayjs().date() / 7),
    day: dayjs().date()
  });
  
  const [showMain, setShowMain] = useState("month");

  const initEvents = () => {
    const storageEvents = localStorage.getItem('savedEvents');
    return storageEvents ? JSON.parse(storageEvents) : [];
  };

  const [savedEvents, dispatchCalEvent] = useReducer(
    savedEventsReducer, 
    [], 
    initEvents
  );

  const fetchEvents = async () => {
    try {
      console.log("Attempting to fetch events from backend...");
      const response = await fetch('https://event-calendar-a9evc5qwp-paramesh2545s-projects.vercel.app/api/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Events fetched successfully:', data);
      
      dispatchCalEvent({ type: 'PUSH', payload: data });
    } catch (error) {
      console.error('Error fetching events:', error);
      
      const localEvents = initEvents();
      if (localEvents.length > 0) {
        console.log('Using events from localStorage as fallback');
        dispatchCalEvent({ type: 'PUSH', payload: localEvents });
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('savedEvents', JSON.stringify(savedEvents));
  }, [savedEvents]);

  return (
    <GlobalContext.Provider
      value={{
        dateIndices,
        setDateIndices,
        showMain,
        setShowMain,
        savedEvents,
        dispatchCalEvent,
        fetchEvents,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}