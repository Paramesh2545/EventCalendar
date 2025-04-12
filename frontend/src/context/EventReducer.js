const savedEventsReducer = (state, { type, payload }) => {
  switch (type) {
    case 'PUSH':
      if (Array.isArray(payload)) {
        return payload;
      }
      
      const existingIndex = state.findIndex(evt => 
        evt.id === payload.id || (evt._id && evt._id === payload._id)
      );
      
      if (existingIndex >= 0) {
        return state.map((evt, index) => 
          index === existingIndex ? payload : evt
        );
      }
      
      return [...state, payload];
    
    case 'UPDATE':
      return state.map(evt => 
        (evt.id === payload.id || (evt._id && evt._id === payload._id)) ? payload : evt
      );
    
    case 'DELETE':
      return state.filter(evt => 
        evt.id !== payload.id && (!evt._id || evt._id !== payload._id)
      );
    
    case 'CLEAR':
      return [];
      
    default:
      return state;
  }
};

export default savedEventsReducer; 