const apiKey = "2d87440969c15455332850ac5c61f72f";
import { create } from 'apisauce'

export const weatherApi = (path, { coords }) => {
  let suffix = `lat=${coords.latitude}&lon=${coords.longitude}`;
  const api = create({
    baseURL: `https://api.openweathermap.org`,
  })
  return api.get(`/data/2.5${path}?appid=${apiKey}&units=imperial&${suffix}`)
};
