"use client"

import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native"
import { useEffect, useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { getFotoById, deletarFoto, formatarData } from "../components/fotosServices"

export default function FotoScreen({ navigation, route }) {
    const { fotoId } = route.params
    const [foto, setFoto] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadFoto()
    }, [])

    const loadFoto = async () => {
        try {
            const fotoData = await getFotoById(fotoId)
            setFoto(fotoData)
        } catch (error) {
            console.error("Erro ao carregar foto:", error)
            Alert.alert("Erro", "Não foi possível carregar a foto")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteFoto = async () => {
        Alert.alert("Confirmar", "Deseja realmente excluir esta foto?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                    const success = await deletarFoto(fotoId)
                    if (success) {
                        navigation.goBack()
                    }
                },
            },
        ])
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Carregando foto...</Text>
            </View>
        )
    }

    if (!foto) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Foto não encontrada</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerButton} onPress={handleDeleteFoto}>
                    <Ionicons name="trash" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
                <Image source={{ uri: foto.foto }} style={styles.fullImage} resizeMode="contain" />
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.dateText}>📅 {formatarData(foto.dataInclusao)}</Text>
                <Text style={styles.idText}>ID: {foto.id}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    errorText: {
        fontSize: 18,
        color: "#666",
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    backButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    headerButton: {
        padding: 10,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 20,
    },
    imageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    fullImage: {
        width: "100%",
        height: "100%",
    },
    infoContainer: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 20,
        alignItems: "center",
    },
    dateText: {
        color: "white",
        fontSize: 16,
        marginBottom: 5,
    },
    idText: {
        color: "#ccc",
        fontSize: 12,
    },
})
