import { useEffect, useState, useContext } from 'react'

import Util from './Util'
import CalendarHeader from './components/CalendarHeader'
import Sidebar from './components/Sidebar'
import Month from './components/Month'
import GlobalContext from './context/GlobalContext'
import dayjs from 'dayjs'
import Week from './components/Week'
import ShowDay from './components/ShowDay'
import GetCurrentWeek from './GetCurrentWeek'
import GetCurrentDay from './GetCurrentDay'

function App() {
  const { showMain, dateIndices, fetchEvents } = useContext(GlobalContext);
  const weekData = GetCurrentWeek(dateIndices);
  const monthData = Util(dateIndices);
  const dayData = GetCurrentDay(dateIndices);

  useEffect(() => {
    fetchEvents();
  }, []); 

  return (
    <>
      <div className='h-screen flex flex-col'>
        <CalendarHeader/>
        <div className="flex flex-1">
          <Sidebar/>
          {showMain === "month" && 
            <Month month={monthData}/> 
          }
          {showMain === "week" && 
            <Week currentWeek={weekData}/>
          }
          {showMain === "day" &&
            <ShowDay currentDay={dayData}/>
          }
        </div>
      </div>
    </>
  )
}

export default App
