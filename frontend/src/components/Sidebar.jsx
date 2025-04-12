import React, { useContext } from 'react'
import dayjs from 'dayjs'
import GlobalContext from '../context/GlobalContext'
import categories from './categories'

const Sidebar = () => {
  const { savedEvents } = useContext(GlobalContext)

  const groupedEvents = categories.reduce((acc, category) => {
    const categoryEvents = savedEvents
      .filter(event => event.category === category.id)
      .sort((a, b) => {
        const dateA = dayjs(`${a.day} ${a.startTime}`)
        const dateB = dayjs(`${b.day} ${b.startTime}`)
        return dateA.diff(dateB)
      })
    
    if (categoryEvents.length > 0) {
      acc[category.id] = {
        name: category.name,
        color: category.color,
        events: categoryEvents
      }
    }
    return acc
  }, {})

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">All Events</h2>
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([categoryId, categoryData]) => (
          <div key={categoryId} className="space-y-3">
            <h3 className={`text-lg font-medium ${categoryData.color}`}>
              {categoryData.name}
            </h3>
            <div className="space-y-3">
              {categoryData.events.map((event) => (
                <div
                  key={event.id}
                  className={`p-3 rounded-lg ${categoryData.color} bg-opacity-75`}
                >
                  <div className="text-xs font-medium text-white opacity-90 mb-1">
                    {categoryData.name}
                  </div>
                  <div className="font-semibold text-white">{event.title}</div>
                  <div className="text-sm text-white">
                    {dayjs(event.day).format('MMM D, YYYY')}
                  </div>
                  <div className="text-sm text-white">
                    {event.startTime} - {event.endTime}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(groupedEvents).length === 0 && (
          <div className="text-gray-500 text-center">
            No events scheduled
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar