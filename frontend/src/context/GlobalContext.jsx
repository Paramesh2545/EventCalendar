import React from "react";

const GlobalContext = React.createContext({
  dateIndices: {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    week: 0,  
    day: new Date().getDate()
  },
  setDateIndices: (indices) => {},
  showMain: 'month',
  setShowMain: () => {},
  savedEvents: [],
  dispatchCalEvent: ({ type, payload }) => {},
  fetchEvents: () => {},  
});

export default GlobalContext;