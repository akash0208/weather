import { Dimensions, Platform, PixelRatio } from 'react-native';

export const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
    const newSize = size * scale;
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
}

export const groupForecastByDay = (list) => {
    const data = {};

    list.forEach((item, index) => {
        const [day] = item.dt_txt.split(" ");
        let test = day.split("-");
        let todayDate = new Date().getDate();
        if (todayDate < 10)
            todayDate = "0" + new Date().getDate()
        if (test[test.length - 1] !== todayDate) {
            if (data[day]) {
                if (data[day].temp_max < item.main.temp_max) {
                    data[day].temp_max = item.main.temp_max;
                }

                if (data[day].temp_min > item.main.temp_min) {
                    data[day].temp_min = item.main.temp_min;
                }
            } else {
                data[day] = {
                    temp_min: item.main.temp_min,
                    temp_max: item.main.temp_max,
                };
            }
        }
    });

    const formattedList = Object.keys(data).map((key) => ({
        day: key,
        ...data[key],
    }));

    return formattedList;
};