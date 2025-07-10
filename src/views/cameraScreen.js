import { StyleSheet, Text, View, TouchableOpacity, Button, Image } from "react-native"
import { CameraView, useCameraPermissions } from "expo-camera"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { tirarFoto, createTables, loadPhotos } from "../components/fotosServices"

export default function CameraScreen({ navigation }) {
    const [permissao, requestPermission] = useCameraPermissions()
    const [cameraRef, setCameraRef] = useState(null)
    const [cameraType, setCameraType] = useState("back")
    const [lastPhoto, setLastPhoto] = useState(null)

    useEffect(() => {
        createTables()
    }, [])

    if (!permissao) {
        return <View />
    }

    if (!permissao.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Você precisa de permissão para visualizar a câmera.</Text>
                <Button onPress={requestPermission} title="Conceder Permissão" />
            </View>
        )
    }

    const trocarCamera = () => {
        setCameraType((current) => (current === "back" ? "front" : "back"))
    }

    const handleTirarFoto = async () => {
        const loadPhotosCallback = async () => {
            const photos = await loadPhotos()
            console.log(`${photos.length} fotos carregadas`)
        }

        await tirarFoto(cameraRef, setLastPhoto, loadPhotosCallback)
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <CameraView style={styles.camera} ref={(ref) => setCameraRef(ref)} facing={cameraType}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={trocarCamera}>
                        <Text style={styles.buttonText}>Trocar Cam</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleTirarFoto}>
                        <Text style={styles.buttonText}>Capturar</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
            {lastPhoto && (
                <View style={styles.previewContainer}>
                    <Text style={styles.previewText}>Última foto:</Text>
                    <Image source={{ uri: lastPhoto.uri }} style={styles.previewImage} />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    message: {
        textAlign: "center",
        paddingBottom: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 10,
        backgroundColor: "#000000",
    },
    headerButton: {
        padding: 10,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 20,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: "transparent",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 20,
    },
    button: {
        alignSelf: "flex-end",
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 15,
    },
    buttonText: {
        fontSize: 18,
        color: "white",
    },
    previewContainer: {
        padding: 20,
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    previewText: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: "bold",
    },
    previewImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
})
