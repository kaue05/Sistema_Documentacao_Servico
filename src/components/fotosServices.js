import { Alert } from "react-native"
import * as SQLite from "expo-sqlite"
import * as MediaLibrary from "expo-media-library"

const db = SQLite.openDatabaseSync("rn_sqlite")

export const createTables = async () => {
    try {
        db.execSync(`
            CREATE TABLE IF NOT EXISTS servicesPhotos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                foto TEXT NOT NULL,
                dataInclusao DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `)
        console.log("Tabela criada com sucesso!")
    } catch (error) {
        console.error("Erro ao criar tabela:", error)
    }
}

export const getFotoById = async (id) => {
    try {
        const result = db.getFirstSync("SELECT * FROM servicesPhotos WHERE id = ?", [id])
        return result
    } catch (error) {
        console.error("Erro ao buscar foto:", error)
        return null
    }
}

export const tirarFoto = async (cameraRef, setLastPhoto, loadPhotosCallback) => {
    if (cameraRef) {
        try {
            const photo = await cameraRef.takePictureAsync({
                base64: true,
                quality: 0.8,
            })
            console.log("Foto tirada:", photo)
            await salvarFoto(photo, setLastPhoto, loadPhotosCallback)
        } catch (error) {
            console.error("Erro ao tirar foto:", error)
            Alert.alert("Erro", "Não foi possível tirar a foto")
        }
    }
}

export const salvarFoto = async (photo, setLastPhoto, loadPhotosCallback) => {
    try {
        const { status } = await MediaLibrary.requestPermissionsAsync()
        if (status !== "granted") {
            Alert.alert("Erro", "Permissão para salvar fotos negada.")
            return
        }

        await MediaLibrary.createAssetAsync(photo.uri)

        if (db) {
            const dataAtual = new Date().toISOString()
            db.runSync("INSERT INTO servicesPhotos (foto, dataInclusao) VALUES (?, ?)", [photo.uri, dataAtual])
            console.log("Foto salva no banco de dados!")

            if (loadPhotosCallback) {
                await loadPhotosCallback()
            }

            Alert.alert("Sucesso", "Foto salva com sucesso!")

            if (setLastPhoto) {
                setLastPhoto(photo)
            }
        }
    } catch (error) {
        console.error("Erro ao salvar foto:", error)
        Alert.alert("Erro", "Não foi possível salvar a foto")
    }
}

export const loadPhotos = async () => {
    try {
        const result = db.getAllSync("SELECT * FROM servicesPhotos ORDER BY dataInclusao DESC")
        return result
    } catch (error) {
        console.error("Erro ao carregar fotos:", error)
        return []
    }
}

export const deletarFoto = async (id) => {
    try {
        if (db) {
            db.runSync("DELETE FROM servicesPhotos WHERE id = ?", [id])
            Alert.alert("Sucesso", "Foto removida com sucesso!")
            return true
        }
    } catch (error) {
        console.error("Erro ao deletar foto:", error)
        Alert.alert("Erro", "Não foi possível remover a foto")
        return false
    }
}
export const formatarData = (dataISO) => {
    const data = new Date(dataISO)
    return data.toLocaleDateString("pt-BR") + " às " + data.toLocaleTimeString("pt-BR")
}