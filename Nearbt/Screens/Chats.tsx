/**
 * Pantalla de Chats
 */
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { readFile, DocumentDirectoryPath } from '@dr.pogodin/react-native-fs';

var contacts = [
    {
        "image": require("../images/forest.jpg"),
        "name": "Chat #1",
        "last_message": "Are you still coming today?",
        "time": "8:42 AM"
    },
    {
        "image": require("../images/city.jpg"),
        "name": "Chat #2",
        "last_message": "I'll send the files tonight.",
        "time": "11:15 AM"
    },
    {
        "image":  require("../images/beach.jpg"),
        "name": "Chat #3",
        "last_message": "That was really fun 😂",
        "time": "Yesterday"
    },
    {
        "image": require("../images/night.jpg"),
        "name": "Chat #4",
        "last_message": "Call me when you're free.",
        "time": "2:08 PM"
    }
]

function Contact(contact: any, navigation: NativeStackNavigationProp<RootStackParamList>) {
  const ContactPress = () => {
    navigation.navigate('Chat')
  }; 

  return (
    <TouchableOpacity style={styles.contactContainer} onPress={ContactPress}>
      <Image style={styles.contactPhoto} source={contact.image} />
      <View style={styles.infoContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{contact.name}</Text>
        </View> 
        <Text style={{ fontSize: 12 }}>{contact.last_message}</Text>
      </View>
      <Text style={{marginTop: 10, marginRight: 18, fontSize: 11}}>{contact.time}</Text>
    </TouchableOpacity>
  );
}



export default function Chats() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const loginFilePath: string = DocumentDirectoryPath + '/login.txt';

  // Verificar si el archivo no existe
  readFile(loginFilePath, 'utf8').catch((error) => {
    console.log("Archivo de login no existe");

    // Ir a login
    navigation.navigate('Login')
  });
  
  return (
    <View style={styles.container}>
      <Text style={{ padding: 40, fontSize: 30 }}>Chat Rooms</Text>
      <FlatList
        data={contacts}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        renderItem={({item}) => Contact(item, navigation) }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  contactPhoto: {
    marginStart: 20,
    width: 70,
    height: 70,
    borderRadius: 35
  },
  contactContainer: {
    gap: 20,
    flexDirection: 'row',
  },
  infoContainer: {
    marginTop: 8,
    flex: 1,
    gap: 5,
  }
});

