import MaterialIcons from '@react-native-vector-icons/material-icons';
import { View, Text, StyleSheet, ToastAndroid, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardStickyView, KeyboardChatScrollView } from 'react-native-keyboard-controller'
import { useEffect, useRef, useState } from 'react';
import { pick } from '@react-native-documents/picker'
import * as RNFS from '@dr.pogodin/react-native-fs';

/* 
* Para usar el servidor, por ahora hay que cambiar estos valores manualmente
* Pronto, estos valores se van a llenar usando ParamList de react navigation
*/
const IP = "192.168.1.13"
const PORT = 3000

type FileMetadata = {
    extension: string;
    name: string;
    size: number;
    uri: string;
    mime: string;
    url?: string;
};

type Message = {
    id: string;
    date: string;
    sender: boolean;
    text: string;
    incoming: boolean;
    fileMetadata?: FileMetadata;
    status?: string;
};


// TODO: Crear una API de esto
function getFileExtension(filename: string): string {
    const parts = filename.split('.');

    if (parts.length <= 1) {
        return '';
    }

    return parts.pop()!.toLowerCase();
}

function getMimeType(extension: string): string {
    switch (extension.toLowerCase()) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'pdf':
            return 'application/pdf';
        default:
            return 'application/octet-stream';
    }
}

function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, i);

    return `${value.toFixed(decimals)} ${units[i]}`;
}


async function downloadFile(fileUrl: string, fileName: string) {
    const showToast = () => {
        ToastAndroid.show('Archivo descargado', ToastAndroid.SHORT);
    };

    const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    console.log("FROM URL: ", `http://${IP}:3000${fileUrl}`);

    try {
        const result = await RNFS.downloadFile({
            fromUrl: `http://${IP}:3000${fileUrl}`,
            toFile: localPath,
            progress: (res) => {
                const percent = (res.bytesWritten / res.contentLength) * 100;
                console.log(`Downloaded ${percent.toFixed(0)}%`);
            },
            progressDivider: 10,
        }).promise;

        if (result.statusCode === 200) {
            console.log('Saved to:', localPath);
            showToast();
            return localPath;
        } else {
            throw new Error(`Download failed with status ${result.statusCode}`);
        }
    } catch (error) {
        console.error('Download error:', error);
        throw error;
    }
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
        case "jpeg":
        case "png":
            return (
                <View key={item.id} style={bubbleContainer}>
                    <View style={bubbleTextContainer}>
                        <Image
                            style={{ height: 200, width: 200 }}
                            source={{ uri: `http://${IP}:3000${item.fileMetadata.url}` }}
                        />
                        <Text>{item.text}</Text>
                    </View>
                </View>)
        default:
            return (
                <View key={item.id} style={bubbleContainer}>
                    <View style={bubbleTextContainer}>
                        <View style={styles.fileContainer}>
                            <MaterialIcons name={item.status == "Uploading" ? "timer" : "file-copy"} size={30} color="#dddddd" style={styles.icon} />
                            <View style={styles.fileInfoContainer}>
                                <Text>{item.fileMetadata.name}</Text>
                                <Text>{formatBytes(item.fileMetadata.size)}</Text>
                            </View>
                            {item.incoming && (
                                <TouchableOpacity onPress={() => downloadFile(item.fileMetadata!.url === undefined ? "" : item.fileMetadata!.url, item.fileMetadata!.name)}>
                                    <MaterialIcons name="download" size={30} color="#dddddd" style={{ marginTop: 20, marginLeft: 10, marginRight: 10 }} />
                                </TouchableOpacity>
                            )}
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
        let shouldReconnect = true;

        const connect = () => {
            ws.current = new WebSocket(`ws://${IP}:${PORT}/ws`);

            ws.current.onopen = () => console.log('WS connected');
            ws.current.onmessage = (event) => {
                const incoming: Message = JSON.parse(event.data);
                incoming.incoming = true;
                setMessages(prev => [...prev, incoming]);
            };
            ws.current.onerror = (e) => console.error('WS error', e);
            ws.current.onclose = (e) => {
                console.log('WS closed. Code:', e.code, 'Reason:', e.reason);
                if (shouldReconnect) {
                    setTimeout(connect, 2000);
                }
            };
        };

        connect();

        // unmount 
        return () => {
            shouldReconnect = false;
            ws.current?.close();
        };
    }, []);
    const sendMessage = async () => {
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
        setAttachCount(0);
        setPendingAttachment(undefined);

        if (newMessage.fileMetadata !== undefined && pendingAttachment !== undefined) {
            const uploadUrl = "http://192.168.1.13:3000/upload";
            try {
                const formData = new FormData();

                formData.append("file", {
                    uri: pendingAttachment.uri,
                    name: pendingAttachment.name,
                    type: getMimeType(pendingAttachment.extension),
                });

                const response = await fetch(uploadUrl, {
                    method: "POST",
                    body: formData,
                });

                const result = await response.json();

                newMessage.fileMetadata.url = result.url;
                newMessage.status = "sent";

                ws.current?.send(JSON.stringify(newMessage));

                setMessages(prev =>
                    prev.map(m => m.id === newMessage.id ? { ...newMessage } : m)
                );
            } catch (e) {
                newMessage.status = "failed";

                setMessages(prev =>
                    prev.map(m => m.id === newMessage.id ? { ...newMessage } : m)
                );
            }
        } else {
            ws.current?.send(JSON.stringify(newMessage));
        }
    };

    const onFileAttachmentPress = async () => {
        // open file picker...
        if (attachCount == 1) {
            setAttachCount(0);
            setPendingAttachment(undefined);
            return;
        }

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


            // Por ahora solo podemos adjuntar solo 1 archivo
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
        backgroundColor: 'rgba(255, 255, 255, 0.50)',
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

