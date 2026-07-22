import { Text, View, Image } from "react-native";

export default function ChatHeader(props: any, params: any) {
    let contactName = "Desconocido";
    let contactImage = require('../images/unknown.jpg');

    if (params !== undefined) {
        console.log("Reached?")
        contactName = params.chatName;
        contactImage = params.chatImage;
    }

    console.log(params)
    return (
        <View style={{ flexDirection: 'row', gap: 12}}>
            <Image
                source={contactImage}
                style={{ width: 50, height: 50, borderRadius: 25 }}
            >
            </Image>
            <View style={{flexDirection: 'column', gap: 5}}>
                <Text style={{fontWeight: 'bold', fontSize: 20  }}>{contactName}</Text>
                <Text>Online</Text>
            </View>
        </View>
    );
}