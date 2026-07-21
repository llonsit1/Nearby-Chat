import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

export default function AddChat() {
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
const [ip, setIp] = useState('');
const [port, setPort] = useState('');

  return (
    <View style={styles.container}> 
      <Text>IP: </Text>
      <TextInput
        style={styles.input}
        value={ip}
        onChangeText={setIp}
      />
      <Text>Port: </Text>
      <TextInput
        style={styles.input}
        value={port}
        onChangeText={setPort}
        keyboardType="numeric"
      />
        <Button
          title="Add Chat"
          onPress={() => {
            // agregar la lógica para agregar el chat aquí por ahora solo are que se vaya a la pantalla de chats postdata: el navigation ahora es sagrado xd
            console.log("IP: ", ip, "Port: ", port);
            navigation.navigate('Chats');
          }}
        />
    </View>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    borderRadius: 5,
  },
});