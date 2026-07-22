import MaterialIcons from '@react-native-vector-icons/material-icons';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardStickyView, KeyboardChatScrollView } from 'react-native-keyboard-controller'
import { useEffect, useRef, useState } from 'react';
import { pick } from '@react-native-documents/picker'


/* 
* Para usar el servidor, por ahora hay que cambiar estos valores manualmente
* Pronto, estos valores se van a llenar usando ParamList de react navigation
*/
const IP = "192.168.1.19"
const PORT = 3000

type FileMetadata = {
    extension: string;
    name: string;
    size: number;
    uri: string;
    mime: string
};

type Message = {
    id: string;
    date: string;
    sender: boolean;
    text: string;
    incoming: boolean;
    fileMetadata?: FileMetadata;
};

function getFileExtension(filename: string): string {
    const parts = filename.split('.');

    if (parts.length <= 1) {
        return '';
    }

    return parts.pop()!.toLowerCase();
}


function Bubble(item: Message) {
    // Decidir si los mensajes van a la izquierda o a la derecha basado en la propiedad de "Message" "incoming"
    const bubbleContainer = item.incoming ? styles.leftBubbleContainer : styles.rightBubbleContainer
    const bubbleTextContainer = item.incoming ? styles.leftBubbleTextContainer : styles.rightBubbleTextContainer

    if (item.fileMetadata == undefined) {
        return (
            <View key={item.id} style={bubbleContainer}>
                <View style={bubbleTextContainer}>
                    <Text>{item.text}</Text>
                </View>
            </View>
        );
    }

    switch (item.fileMetadata.extension) {
        case "jpg":
        case "png":
            return (
                <View key={item.id} style={bubbleContainer}>
                    <View style={bubbleTextContainer}>
                        <Image
                            style={{ height: 200, width: 200 }}
                            source={require('../images/beach.jpg')}
                        />
                        <Text>{item.text}</Text>
                    </View>
                </View>)
        default:
            return (
                <View key={item.id} style={bubbleContainer}>
                    <View style={bubbleTextContainer}>
                        <View style={styles.fileContainer}>
                            <MaterialIcons name="file-copy" size={30} color="#dddddd" style={styles.icon} />
                            <View style={styles.fileInfoContainer}>
                                <Text>Chat.bin</Text>
                                <Text>2.0 MB</Text>
                            </View>
                        </View>
                        <Text>{item.text}</Text>
                    </View>
                </View>)
    }
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setmessageText] = useState('');
    const [attachCount, setAttachCount] = useState(0);
    const [pendingAttachment, setPendingAttachment] = useState<FileMetadata | undefined>(undefined);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://" + IP + ":" + PORT);

        ws.current.onopen = () => console.log('WS connected');
        ws.current.onmessage = (event) => {
            const incoming: Message = JSON.parse(event.data);
            // TODO: El servidor es el que debe decidir esto, no el cliente
            incoming.incoming = true;
            setMessages(prev => [...prev, incoming]);
        };
        ws.current.onerror = (e) => console.error('WS error ', e.message);
        ws.current.onclose = (e) => { console.log('WS closed ', e.reason) };

        return () => ws.current?.close();
    }, []);

    const sendMessage = () => {
        if (messageText.trim().length === 0 || (messageText.trim().length === 0 && pendingAttachment === undefined)) {
            return;
        }

        const newMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            date: new Date().toISOString(),
            sender: true,
            incoming: false,
            fileMetadata: pendingAttachment,
        };

        setMessages(prev => [...prev, newMessage]);
        setmessageText("");
        console.log(JSON.stringify(newMessage))
        ws.current?.send(JSON.stringify(newMessage));
        setPendingAttachment(undefined);
    };

    const onFileAttachmentPress = async () => {
        // open file picker...

        try {
            const [result] = await pick({
                mode: 'open',
            })
            console.log(result)
            const name: string = result.name != undefined ? result.name : ""
            const extesion: string = getFileExtension(name)
            const size: number = result.size != undefined ? result.size : 0
            const uri: string = result.uri != undefined ? result.uri : ""
            const mime: string = result.type != undefined ? result.type : ""
            setPendingAttachment({
                extension: extesion,
                name: name,
                size: size,
                uri: uri,
                mime: mime
            });

            // Por ahora solo podemos adjuntar un archivo
            setAttachCount(1);
        } catch (err) {
            // see error handling
        }

    };
    return (
        <View style={{ flex: 1 }}>
            <KeyboardChatScrollView style={{ flex: 1 }}>
                <View style={styles.chatBubblesContainer}>
                    <Text style={{ marginTop: 36, marginBottom: 15, textAlign: 'center' }}>July 18 2026</Text>
                    {messages.map((item: Message) => Bubble(item))}

                </View>
            </KeyboardChatScrollView>

            <KeyboardStickyView style={styles.inputWrapper}>
                <TextInput
                    style={styles.messageTextInput}
                    placeholder="Enter Message"
                    value={messageText}
                    onChangeText={(text) => setmessageText(text)}
                />
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.attachFileButton} onPress={onFileAttachmentPress}>
                        <MaterialIcons name="attach-file" size={24} color="#3498DB" />
                    </TouchableOpacity>

                    <Text>{attachCount != 0 ? attachCount : ""}</Text>
                </View>
                <TouchableOpacity style={styles.sendIconButton} onPress={sendMessage}>
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
        marginBottom: 10,
        flexDirection: 'column'
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
    },
    fileContainer: {
        flexDirection: 'row',
        backgroundColor: '#8a8282',
        borderRadius: 12,
        gap: 10,
    },
    fileInfoContainer: {
        flexDirection: 'column',
        gap: 10,
        marginRight: 10,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10
    },
    icon: {
        marginTop: 10,
        marginLeft: 10
    }
});

