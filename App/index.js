import React from 'react';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Provider } from "react-redux";

import Details from "./screens/Details";
import Error from './screens/Error';
import store from "./Store";

const AppStack = createStackNavigator({
  Details: { screen: Details },
  ErrorScreen: { screen: Error },
},
  { headerMode: 'none' }
);

let Navigation = createAppContainer(AppStack);

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}

export default App;