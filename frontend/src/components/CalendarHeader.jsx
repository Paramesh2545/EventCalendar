import React from 'react'
import logo from "../assets/logo.png";
import GlobalContext from '../context/GlobalContext';
import { useContext } from 'react';
import dayjs from 'dayjs';

const CalendarHeader = () => {
  const { dateIndices, setDateIndices, showMain, setShowMain } = useContext(GlobalContext);
  console.log("working")
  const handlePrevious = () => {
    const currentDate = dayjs()
      .year(dateIndices.year)
      .month(dateIndices.month)
      .date(dateIndices.day);

    switch(showMain) {
      case 'week':
        const prevWeek = currentDate.subtract(1, 'week');
        setDateIndices({
          year: prevWeek.year(),
          month: prevWeek.month(),
          week: Math.floor(prevWeek.date() / 7),
          day: prevWeek.date()
        });
        break;
      case 'month':
        const prevMonth = currentDate.subtract(1, 'month');
        setDateIndices({
          year: prevMonth.year(),
          month: prevMonth.month(),
          week: 0,
          day: 1
        });
        break;
      case 'day':
        const prevDay = currentDate.subtract(1, 'day');
        setDateIndices({
          year: prevDay.year(),
          month: prevDay.month(),
          week: Math.floor(prevDay.date() / 7),
          day: prevDay.date()
        });
        break;
    }
  };

  const handleNext = () => {
    const currentDate = dayjs()
      .year(dateIndices.year)
      .month(dateIndices.month)
      .date(dateIndices.day);

    switch(showMain) {
      case 'week':
        const nextWeek = currentDate.add(1, 'week');
        setDateIndices({
          year: nextWeek.year(),
          month: nextWeek.month(),
          week: Math.floor(nextWeek.date() / 7),
          day: nextWeek.date()
        });
        break;
      case 'month':
        console.log("Changing to next month")
        const nextMonth = currentDate.add(1, 'month');
        setDateIndices({
          year: nextMonth.year(),
          month: nextMonth.month(),
          week: 0,
          day: 1
        });
        break;
      case 'day':
        const nextDay = currentDate.add(1, 'day');
        setDateIndices({
          year: nextDay.year(),
          month: nextDay.month(),
          week: Math.floor(nextDay.date() / 7),
          day: nextDay.date()
        });
        break;
    }
  };

  const handleToday = () => {
    const today = dayjs();
    setDateIndices({
      year: today.year(),
      month: today.month(),
      week: Math.floor(today.date() / 7),
      day: today.date()
    });
  };

  const ChangeToDay = () => setShowMain('day');
  const ChangeToWeek = () => setShowMain('week');
  const ChangeToMonth = () => setShowMain('month');

  // Format the current date based on the view
  const getHeaderDate = () => {
    const currentDate = dayjs()
      .year(dateIndices.year)
      .month(dateIndices.month)
      .date(dateIndices.day);

    switch(showMain) {
      case 'day':
        return currentDate.format('MMMM D, YYYY');
      case 'week':
        const weekStart = currentDate.startOf('week');
        const weekEnd = currentDate.endOf('week');
        return `${weekStart.format('MMM D')} - ${weekEnd.format('MMM D, YYYY')}`;
      case 'month':
      default:
        return currentDate.format('MMMM YYYY');
    }
  };

  return (
    <header className="px-4 py-2 flex items-center sticky">
      <img src={logo} alt="calendar" className="mr-2 w-12 h-12" />
      <h1 className="mr-10 text-xl text-gray-500 fond-bold">
        Calendar
      </h1>
      <button
        onClick={handleToday}
        className="border rounded py-2 px-4 mr-5"
      >
        Today
      </button>
      <button onClick={handlePrevious}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_left
        </span>
      </button>
      <button onClick={handleNext}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_right
        </span>
      </button>
      <h2 className="ml-4 text-xl text-gray-500 font-bold">
        {getHeaderDate()}
      </h2>
      <div className="space-x-2 ml-5">
        <button 
          className={`px-4 py-2 rounded ${
            showMain === "day" ? "bg-red-500 text-white" : "hover:bg-gray-100"
          }`} 
          onClick={ChangeToDay}
        >
          Day
        </button>
        <button 
          className={`px-4 py-2 rounded ${
            showMain === "week" ? "bg-red-500 text-white" : "hover:bg-gray-100"
          }`} 
          onClick={ChangeToWeek}
        >
          Week
        </button>
        <button 
          className={`px-4 py-2 rounded ${
            showMain === "month" ? "bg-red-500 text-white" : "hover:bg-gray-100"
          }`} 
          onClick={ChangeToMonth}
        >
          Month
        </button>
      </div>
    </header>
  );
};

export default CalendarHeader;