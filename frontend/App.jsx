import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

import MapScreen from './screens/MapScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import MonCompteScreen from './screens/MonCompteScreen';
import ChatScreen from './screens/ChatScreen';
import PreferenceScreen from './screens/PreferenceScreen'
import CompagnonScreen from './screens/CompagnonScreen';
import PoiScreen from './screens/PoiScreen'
import ProfileScreen from "./screens/ProfileScreen";
import MessageScreen from "./screens/MessageScreen";
import EventScreen from './screens/EventScreen';
import NewEventScreen from './screens/NewEventScreen'

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import user from './reducers/user';
import places from './reducers/places';
import event from "./reducers/event";

import { useSelector } from 'react-redux';


const store = configureStore({
  reducer: { user, places, event},
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

//Configuration tab navigation
const TabNavigator = () => {
  const user = useSelector((state) => state.user.value); //Recuperation paramètres de l'utilsateur stocké dans le STORE
  
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = '';

        if (route.name === 'Map') {
          iconName = 'home';
          return <FontAwesome name={iconName} size={size} color={color} />;
        } else if (route.name === 'Compte') {
          iconName = 'user';
          return <FontAwesome name={iconName} size={size} color={color} />;
        } else if (route.name === 'Chat') {
          iconName = 'comment';
          return (
            <View style={{ flexDirection:"row" }}>
              <FontAwesome name={iconName} size={size} color={color} />
              {(user.pastilleMessage)&&<View style={{ width: 10, height: 10, backgroundColor: '#F00', borderRadius: 50}}></View>}
            </View>
          );
        }
      },
      tabBarActiveTintColor: '#FFFFFF',
      tabBarInactiveTintColor: '#000000',
      tabBarStyle: { backgroundColor: '#7DBA84' },
      headerShown: false,
    })}>
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Compte" component={MonCompteScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} options={{ tabBarButton: (props) => { } }} />
      <Tab.Screen name="Preference" component={PreferenceScreen} options={{ tabBarButton: (props) => { } }} />
      <Tab.Screen name="Compagnon" component={CompagnonScreen} options={{ tabBarButton: (props) => { } }} />
      <Tab.Screen name="Poi" component={PoiScreen} options={{ tabBarButton: (props) => { } }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AutocompleteDropdownContextProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Profil" component={ProfileScreen} />
            <Stack.Screen name="Preference" component={PreferenceScreen} />
            <Stack.Screen name="Compagnon" component={CompagnonScreen} />
            <Stack.Screen name="Poi" component={PoiScreen} />
            <Stack.Screen name="Message" component={MessageScreen} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="Event" component={EventScreen} />
            <Stack.Screen name="NewEvent" component={NewEventScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </AutocompleteDropdownContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
