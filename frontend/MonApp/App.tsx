/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./Components/Header";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import { Provider } from "react-redux";
import store from "./redux/store";
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';


export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Chat: { user: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {

  const optionStack:any = {
    headerStyle: {backgroundColor: '#f5f5f5'},
    headerTintColor: '#000',
    headerTitleAlign: 'center',
    headerTitleStyle: {fontWeight: 'bold', fontSize: 50},
    headerShadowVisible: false,
  }
  return (
    <>
      <Provider store={store}>
        <Header />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen 
              name="Login" 
              component={Login} 
              options={{...optionStack, title: 'Login'}} 
            />
            <Stack.Screen name="Register" component={Register} options={{...optionStack, title: 'Register'}} />
            <Stack.Screen 
              name="Home" 
              component={Home} 
              options={{...optionStack, title: 'Home'}}
              />
              <Stack.Screen 
                name="Chat" 
                component={Chat} 
                options={{...optionStack, title: 'Home'}}
              />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </>
  );
}


export default App;


