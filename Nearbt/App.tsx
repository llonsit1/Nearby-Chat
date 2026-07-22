import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AddChat from './Screens/AddChath';
import Login from './Screens/Login';
import Chats from './Screens/Chats';
import Chat from './Screens/Chat';
import Test from './Screens/Test';
import ChatHeader from './Components/ChatHeader'
import { KeyboardProvider } from "react-native-keyboard-controller";

type ChatParams = {
  chatName: string;
  chatImage: any;
}

export type RootStackParamList = {
  Login: undefined;
  Chats: undefined;
  Chat: ChatParams;
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
      options: ({ route }) => ({
        title: 'Chat',
        navigationBarHidden: true,
        headerTitle: (props) => ChatHeader(props, route.params),
      }),
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

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}