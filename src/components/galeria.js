import { useEffect, useState, forwardRef, useImperativeHandle } from "react"
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image, RefreshControl } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { createTables, loadPhotos, deletarFoto, formatarData } from "./fotosServices"

const GaleriaDB = forwardRef(({ navigation }, ref) => {
    const [photos, setPhotos] = useState([])
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        initializeGallery()
    }, [])

    const initializeGallery = async () => {
        await createTables()
        await loadPhotosData()
    }

    const loadPhotosData = async () => {
        const photosData = await loadPhotos()
        setPhotos(photosData)
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await loadPhotosData()
        setRefreshing(false)
    }

    useImperativeHandle(ref, () => ({
        reloadGallery: async () => {
            await loadPhotosData()
        },
    }))

    const handleDeletePhoto = async (id) => {
        const success = await deletarFoto(id)
        if (success) {
            await loadPhotosData()
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.galleryTitle}>Galeria ({photos.length} fotos)</Text>
            <FlatList
                data={photos}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0000ff"]} tintColor={"#0000ff"} />
                }
                renderItem={({ item }) => (
                    <View style={styles.photoItem}>
                        <TouchableOpacity onPress={() => navigation.navigate("Foto", { fotoId: item.id })}>
                            <Image source={{ uri: item.foto }} style={styles.thumbnail} />
                            <Text style={styles.photoDate}>{formatarData(item.dataInclusao)}</Text>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => {
                                    Alert.alert("Confirmar", "Deseja realmente excluir esta foto?", [
                                        { text: "Cancelar", style: "cancel" },
                                        { text: "Excluir", onPress: () => handleDeletePhoto(item.id) },
                                    ])
                                }}
                            >
                                <Ionicons name="trash" size={16} color="red" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma foto encontrada</Text>}
            />
        </View>
    )
})

export default GaleriaDB

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#222831",
        padding: 10,
    },
    galleryTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        color: "#fff",
    },
    photoItem: {
        flex: 1,
        margin: 5,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        padding: 5,
        position: "relative",
    },
    thumbnail: {
        width: "100%",
        height: 120,
        borderRadius: 5,
    },
    photoDate: {
        fontSize: 10,
        color: "#666",
        textAlign: "center",
        marginTop: 5,
    },
    deleteButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(255,255,255,0.8)",
        borderRadius: 12,
        padding: 4,
    },
    emptyText: {
        textAlign: "center",
        color: "#666",
        marginTop: 20,
    },
})
