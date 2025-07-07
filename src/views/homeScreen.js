"use client"

import React from "react"

import { useEffect, useRef } from "react"
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
// import GaleriaDB, { createTables } from "../components/galeria"
import GaleriaDB from "../components/galeria"
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
            <TouchableOpacity onPress={() => navigation.navigate("Camera")} style={styles.button}>
                <Image source={require("../../assets/camera.png")} style={{ width: 60, height: 60 }} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#222831",
    },
    paragraph: {
        margin: 24,
        marginTop: 0,
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
    },
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
