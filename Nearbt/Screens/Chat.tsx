import MaterialIcons from '@react-native-vector-icons/material-icons';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardStickyView, KeyboardChatScrollView } from 'react-native-keyboard-controller'

// Burbuja de la izquierda
function LeftBubble() {
    return (
        <View style={styles.leftBubbleContainer}>
            <View style={styles.leftBubbleTextContainer}>
                <Text>lorem ipsum</Text>
            </View>
        </View>)
}

function RightBubble() {
    return (
        <View style={styles.rightBubbleContainer}>
            <View style={styles.rightBubbleTextContainer}>
                <Text>lorem ipsum</Text>
            </View>
        </View>)
}

export default function Chat() {
    return (
        <View style={{ flex: 1 }}>
            <KeyboardChatScrollView style={{ flex: 1 }}>
                <View style={styles.chatBubblesContainer}>
                    <Text style={{ marginTop: 36, textAlign: 'center' }}>July 18 2026</Text>
                    <LeftBubble />
                    <RightBubble />
                    <LeftBubble />
                    <RightBubble />
                    <LeftBubble />
                    <RightBubble />
                </View>
            </KeyboardChatScrollView>

            <KeyboardStickyView style={styles.inputWrapper}>
                <TextInput
                    style={styles.messageTextInput}
                    placeholder="Enter Message"
                />
                <TouchableOpacity style={styles.attachFileButton}>
                    <MaterialIcons name="attach-file" size={24} color="#3498DB" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendIconButton}>
                    <MaterialIcons name="send" size={24} color="#3498DB" />
                </TouchableOpacity>
            </KeyboardStickyView>
        </View>

    );
}
const styles = StyleSheet.create({
    chatContainer: {

    },
    chatBubblesContainer: {
        gap: 10,
        flex: 7
    },
    leftBubbleContainer: {
        marginLeft: 12,
        alignItems: 'stretch',
        backgroundColor: '#dad7d7',
        alignSelf: "flex-start",
        borderRadius: 5
    },
    leftBubbleTextContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10
    },
    rightBubbleContainer: {
        marginRight: 12,
        alignItems: 'stretch',
        backgroundColor: '#3498DB',
        alignSelf: "flex-end",
        borderRadius: 12
    },
    rightBubbleTextContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10
    },
    messageTextInputContainer: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginLeft: 20,
        marginBottom: 10,
        gap: 10
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#c9cacb',
        borderRadius: 12,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10
    },
    messageTextInput: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 10,
        // no backgroundColor/borderRadius here anymore — the wrapper has it
    },
    sendIconButton: {
        paddingLeft: 8,
        marginRight: 10
    },
    attachFileButton: {
        marginRight: 5
    }
});

