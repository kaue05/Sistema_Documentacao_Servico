import React from "react"

import { useEffect, useRef } from "react"
import { View, StyleSheet } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import GaleriaDB from "../components/galeria"
import BotaoTirarFoto from "../components/botaoTirarFoto"
import { createTables } from "../components/fotosServices"

export default function HomeScreen({ navigation }) {
    const galeriaRef = useRef(null) 

    useEffect(() => {
        createTables() 
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            if (galeriaRef.current) {
                galeriaRef.current.reloadGallery()
            }
        }, []),
    )

    return (
        <View style={styles.container}>
            <GaleriaDB ref={galeriaRef} navigation={navigation} />
            <BotaoTirarFoto navigation={navigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#222831",
    },
})
