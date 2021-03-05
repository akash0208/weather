import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StatusBar,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { format } from "date-fns";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import LottieView from 'lottie-react-native';
import { groupForecastByDay, normalize } from "../helper/helper";
import Switch from "../components/Switch";
import { connect } from "react-redux";
import { getWeather, getForecast } from '../Action/actions'

function Details(props) {

  const [currentWeather, setCurrentWeather] = useState({})
  const [loadingCurrentWeather, setLodingCurrentWeather] = useState(true)
  const [forecast, setForecast] = useState([])
  const [loadingForecast, setLoadingForecast] = useState(true)
  const [placeName, setPlaceName] = useState("")
  const [isEnabled, setIsEnabled] = useState(false)
  const [position, setPosition] = useState()

  const { getWeather, currentData, forecastData, cityName, getForecast, error } = props;

  useEffect(() => {
    fetchReport();
  }, [])

  function fetchReport() {
    setLodingCurrentWeather(true);
    setLoadingForecast(true);
    Permissions.askAsync(Permissions.LOCATION)
      .then(({ status }) => {
        if (status !== "granted") {
          throw new Error("Permission to access location was denied");
        }
        return Location.getCurrentPositionAsync();
      })
      .then((position) => {
        setPosition(position.coords)
        getWeather({ coords: position.coords });
        getForecast({ coords: position.coords })
      });
  }

  useEffect(() => {
    if (currentData) {
      setCurrentWeather(currentData);
      setPlaceName(cityName);
      setLodingCurrentWeather(false);
    }
    if (forecastData) {
      setForecast(groupForecastByDay(forecastData.list))
      setLoadingForecast(false);
    }
  }, [currentData, forecastData, cityName])

  const _renderItem = ({ item, index }) => {
    let day = item;
    let temp = Math.round(day.temp_max)
    if (!isEnabled)
      temp = Math.round((temp - 32) * 5 / 9)
    return (
      <View
        key={index}
        style={styles.listItems}
      >
        <Text style={styles.forcastDay}>{format(new Date(day.day), "EEEE, MMM d")}</Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.listTemp}>
            {temp}°{isEnabled ? "F" : "C"}
          </Text>
        </View>
      </View>
    )
  }

  function toggleSwitch() {
    setIsEnabled(!isEnabled)
  }

  if (error) {
    return (
      <SafeAreaView style={{ ...styles.container, ...styles.errorContainer }}>
        <Text style={styles.temperature}>{`Something\nWent Wrong\nat our End!`}</Text>

        <TouchableOpacity style={styles.retry} onPress={fetchReport}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  if (loadingCurrentWeather || loadingForecast) {
    return (
      <View style={styles.loaderContainer}>
        <LottieView
          autoPlay
          loop
          style={styles.lottie}
          source={require('../assets/splashyLoader.json')}
        />
      </View>
    );
  }

  const { main } = currentWeather;
  let weather = Math.round(main.temp)
  if (!isEnabled)
    weather = Math.round((weather - 32) * 5 / 9)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Switch value={isEnabled} onChange={toggleSwitch} />
      <View style={styles.currentReport}>
        <Text style={styles.temperature}>{`${weather}°${isEnabled ? "F" : "C"}`}</Text>
        <Text style={styles.cityName}>{`${placeName}`}</Text>
      </View>


      <View style={styles.flatlistContainer}>
        <FlatList
          data={forecast}
          renderItem={_renderItem}
          ListHeaderComponent={() => (<View style={{ width: '100%', height: 1, backgroundColor: 'white' }} />)}
          ItemSeparatorComponent={() => (<View style={{ width: '100%', height: 1, backgroundColor: 'white' }} />)}
          keyExtractor={(item, index) => index.toString()} />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3c4d93'
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  currentReport: {
    width: '100%',
    height: '55%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  temperature: {
    color: 'white',
    fontSize: normalize(50)
  },
  cityName: {
    color: 'white',
    fontSize: normalize(20)
  },
  listItems: {
    justifyContent: "space-between",
    width: '100%',
    paddingVertical: normalize(15),
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    flexDirection: 'row'
  },
  flatlistContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0
  },
  forcastDay: {
    fontSize: normalize(16),
    color: 'white'
  },
  listTemp: {
    fontWeight: "700",
    color: 'white',
    fontSize: normalize(17)
  },
  loaderContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3c4d93'
  },
  lottie: {
    width: normalize(80),
    height: normalize(80),
  },
  retry: {
    paddingHorizontal: normalize(30),
    marginTop: normalize(50),
    borderWidth: 1,
    borderColor: '#fff',
    paddingVertical: normalize(10)
  },
  retryText: {
    fontSize: normalize(16),
    color: '#fff'
  }
})

const mapStateToProps = (state) => {
  return ({
    currentData: state.currentData,
    cityName: state.cityName,
    forecastData: state.forecastData,
    error: state.error
  })
};

export default connect(mapStateToProps, { getWeather, getForecast })(Details);