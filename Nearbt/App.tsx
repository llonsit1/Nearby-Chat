import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AddChat from './Screens/AddChath';
import Login from './Screens/Login';
import Chats from './Screens/Chats';
import Chat from './Screens/Chat';
import Test from './Screens/Test';
import { KeyboardProvider } from "react-native-keyboard-controller";

export type RootStackParamList = {
  Login: undefined;
  Chats: undefined;
  Chat: undefined;
  Test: undefined;
  AddChath: undefined;
};

const RootStack = createNativeStackNavigator({
  screens: {
    Chats: {
      screen: Chats,
      options: {
        headerBackVisible: false
      }
    },
    Login: {
      screen: Login,
      options: { title: 'Bienvenido' },
    },
    Chat: {
      screen: Chat,
      options: { title: 'Chat', navigationBarHidden: true }
    },
    Test: {
      screen: Test,
      options: { title: 'Testing' }
    },
    AddChath: {
      screen: AddChat,
      options: { title: 'Add Chat' }
    },
    
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <KeyboardProvider>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </KeyboardProvider>
  );
}