import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  View,
  Alert,
  FlatList,
  StatusBar,
} from "react-native";
import { format } from "date-fns";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import { weatherApi } from "../util/weatherApi";
import { BasicRow } from "../components/List";
import { H1, H2, P } from "../components/Text";

import LottieView from 'lottie-react-native';

const groupForecastByDay = (list) => {
  const data = {};

  list.forEach((item) => {
    const [day] = item.dt_txt.split(" ");
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
  });

  const formattedList = Object.keys(data).map((key) => ({
    day: key,
    ...data[key],
  }));

  return formattedList;
};

export default class Details extends React.Component {
  state = {
    currentWeather: {},
    loadingCurrentWeather: true,
    forecast: [],
    loadingForecast: true,
    placeName: ""
  };

  componentDidMount() {
    Permissions.askAsync(Permissions.LOCATION)
      .then(({ status }) => {
        if (status !== "granted") {
          throw new Error("Permission to access location was denied");
        }
        return Location.getCurrentPositionAsync();
      })
      .then((position) => {
        this.getCurrentWeather({ coords: position.coords });
        this.getForecast({ coords: position.coords });
      });
  }

  componentDidUpdate(prevProps) {
    const oldLat = prevProps.navigation.getParam("lat");
    const lat = this.props.navigation.getParam("lat");

    const oldLon = prevProps.navigation.getParam("lon");
    const lon = this.props.navigation.getParam("lon");

    const oldZipcode = prevProps.navigation.getParam("zipcode");
    const zipcode = this.props.navigation.getParam("zipcode");

    if (lat && oldLat !== lat && lon && oldLon !== lon) {
      this.getCurrentWeather({ coords: { latitude: lat, longitude: lon } });
      this.getForecast({ coords: { latitude: lat, longitude: lon } });
    } else if (zipcode && oldZipcode !== zipcode) {
      this.getCurrentWeather({ zipcode });
      this.getForecast({ zipcode });
    }
  }

  handleError = () => {
    Alert.alert("No location data found!", "Please try again", [
      {
        text: "Okay",
        onPress: () => this.props.navigation.navigate("Search"),
      },
    ]);
  };

  getCurrentWeather = ({ zipcode, coords }) =>
    weatherApi("/weather", { zipcode, coords })
      .then((resp) => {
        let response = resp.data
        if (response.cod === "404") {
          this.handleError();
        } else {
          this.props.navigation.setParams({ title: response.name });
          this.setState({
            currentWeather: response,
            loadingCurrentWeather: false,
            placeName: response.name
          });
        }
      })
      .catch((err) => {
        console.log("current error", err);
        this.handleError();
      });

  getForecast = ({ zipcode, coords }) =>
    weatherApi("/forecast", { zipcode, coords })
      .then((resp) => {
        let response = resp.data
        console.log(response)
        if (response.cod !== "404") {
          this.setState({
            loadingForecast: false,
            forecast: groupForecastByDay(response.list),
          });
        }
      })
      .catch((err) => {
        console.log("forecast error", err);
      });

  _renderItem({ item, index }) {
    console.log(day)
    let day = item;
    return (
      <BasicRow
        key={index}
        style={{ justifyContent: "space-between", width: '100%', paddingVertical: 10, alignItems: 'center', paddingHorizontal: 20 }}
      >
        <P>{format(new Date(day.day), "EEEE, MMM d")}</P>
        <View style={{ flexDirection: "row" }}>
          <P style={{ fontWeight: "700", marginRight: 10 }}>
            {Math.round(day.temp_max)}°F
          </P>
        </View>
      </BasicRow>
    )
  }

  render() {
    if (this.state.loadingCurrentWeather || this.state.loadingForecast) {
      return (
        <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3145b7' }}>
          <LottieView
            autoPlay
            loop
            style={{
              width: 80,
              height: 80,
            }}
            source={require('../assets/splashyLoader.json')}
          />
        </View>
      );
    }

    const { main } = this.state.currentWeather;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#3145b7' }}>
        <StatusBar barStyle="light-content" />
        <View style={{ width: '100%', height: '55%', alignItems: 'center', justifyContent: 'center' }}>
          <H1>{`${Math.round(main.temp)}°F`}</H1>
          <H2>{`${this.state.placeName}`}</H2>
        </View>

        <View style={{ width: '100%', height: '45%', justifyContent: 'flex-end' }}>

          <FlatList
            data={this.state.forecast}
            renderItem={this._renderItem}
            ListHeaderComponent={() => (<View style={{ width: '100%', height: 1, backgroundColor: 'white' }} />)}
            ItemSeparatorComponent={() => (<View style={{ width: '100%', height: 1, backgroundColor: 'white' }} />)} />
        </View>
      </SafeAreaView>
    );
  }
}
