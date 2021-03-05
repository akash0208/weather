import { weatherApi } from "../util/weatherApi";
import { GET_WEATHER, GET_FORECAST, RETRY, GOT_ERROR } from "./types"

export const getWeather = (coords) => async dispatch => {
    weatherApi("/weather", coords)
        .then((resp) => {
            let response = resp.data
            if (response.cod == "404" || response.cod == "400" || response.cod == "401") {
                dispatch({ type: GOT_ERROR })
            } else {
                dispatch({
                    type: GET_WEATHER,
                    payload: response
                })
            }
        })
        .catch((err) => {
            dispatch({ type: GOT_ERROR })
        });
}

export const getForecast = (coords) => async dispatch => {
    weatherApi("/forecast", coords)
        .then((resp) => {
            let response = resp.data
            console.log(response)
            if (response.cod == "404" || response.cod == "400" || response.cod == "401") {
                dispatch({ type: GOT_ERROR })
            } else {
                dispatch({
                    type: GET_FORECAST,
                    payload: response
                })
            }
        })
        .catch((err) => {
            dispatch({ type: GOT_ERROR })
        });
}

export const retry = () => dispatch => {
    dispatch({ type: RETRY })
}