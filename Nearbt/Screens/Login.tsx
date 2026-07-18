import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';



const Login = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');

    const verificarUsuario = () => {
        if (usuario.trim().length > 0 && contrasena.trim().length >= 4) {
            setMensaje('Usuario validado');
            return true;
        } else {
            setMensaje('Usuario o contraseña incorrectos');
            return false;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.Text}>Ingresa tu usuario</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Usuario"
                value={usuario}
                onChangeText={setUsuario}
            />
            <Text style={styles.Text}>Ingresa tu contraseña</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Contraseña"
                secureTextEntry
                value={contrasena}
                onChangeText={setContrasena}
            />
             <Button 
                title="Iniciar sesión"
                onPress={() => {
                    const exito = verificarUsuario();
                    if (exito) {
                        navigation.navigate('Chats');
                    }
                }} 
            />

            {mensaje !== '' && <Text style={styles.Text}>{mensaje}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 200,
        alignItems: 'center',
        padding: 20,
    },
    Text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        color: 'white'
    },
    textInput: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default Login;