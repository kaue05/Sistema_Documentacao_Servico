import { StyleSheet, TouchableOpacity, Image } from "react-native"

export default function BotaoTirarFoto({ navigation }) {
    return (
        <TouchableOpacity onPress={() => navigation.navigate("Camera")} style={styles.button}>
            <Image source={require("../../assets/camera.png")} style={{ width: 60, height: 60 }} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#8E1616",
        width: 80,
        height: 80,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 80,
        right: 20,
        borderRadius: 50
    },
})