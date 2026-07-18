import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Screens/Login';
import Chats from './Screens/Chats';

export type RootStackParamList = {
  Login: undefined;
  Chats: undefined;
};

const RootStack = createNativeStackNavigator({
  screens: {
    Login: {
      screen: Login,
      options: { title: 'Welcome' },
    },
    Chats: {
      screen: Chats,
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}