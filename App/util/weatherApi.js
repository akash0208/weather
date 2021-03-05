const apiKey = "2d87440969c15455332850ac5c61f72f";
import { create } from 'apisauce'

export const weatherApi = (path, { zipcode, coords }) => {
  let suffix = "";

  if (zipcode) {
    suffix = `zip=${zipcode}`;
  } else if (coords) {
    suffix = `lat=${coords.latitude}&lon=${coords.longitude}`;
  }

  const api = create({
    baseURL: `https://api.openweathermap.org`,
  })

  console.log(`https://api.openweathermap.org/data/2.5${path}?appid=${apiKey}&units=imperial&${suffix}`)
  // return fetch(
  //   `https://api.openweathermap.org/data/2.5${path}?appid=${apiKey}&units=imperial&${suffix}`
  // ).then(response => response.json());

  // api.get(`/data/2.5${path}?appid=${apiKey}&units=imperial&${suffix}`)
  return api.get(`/data/2.5${path}?appid=${apiKey}&units=imperial&${suffix}`)
};
