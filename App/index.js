import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Details from "./screens/Details";

const AppStack = createStackNavigator(
  {
    Details: {
      screen: Details,
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.getParam("title", ""),
        headerStyle: {
          backgroundColor: "#3145b7",
          borderBottomColor: "#3145b7"
        },
        headerTintColor: "#fff",
        headerShown: false
      })
    },
  }
);

export default createAppContainer(AppStack);
