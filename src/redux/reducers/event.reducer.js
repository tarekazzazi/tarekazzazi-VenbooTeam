import { combineReducers } from 'redux';

const allEventsReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_EVENTS':
            return action.payload;
        case "UNSET_USER":
            return [];
        default:
            return state;
    }
}

const boothApplications = (state = [], action) => {
    switch (action.type) {
        case 'SET_EVENT_BOOTH_APPLICATIONS':
            return action.payload;
        case "UNSET_USER":
            return [];
        default:
            return state;
    }
}

export default allEventsReducer;