import { GET_FORECAST, GET_WEATHER, GOT_ERROR, RETRY } from '../Action/types'

const initialState = {
    currentData: "",
    forecastData: "",
    cityName: "",
    error: true
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case GET_WEATHER:
            return { ...state, currentData: action.payload, cityName: action.payload.name, error: false }
        case GET_FORECAST:
            return { ...state, forecastData: action.payload, error: false }
        case GOT_ERROR:
            return { ...state, error: true }
        case RETRY:
            return { ...state, error: false }
        default:
            return state;
    }
}

export default reducer;
