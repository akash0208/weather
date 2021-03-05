import React from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { normalize } from '../helper/helper'

export default function Error(props) {

    function retry() {
        props.navigation.goBack()
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.temperature}>{`Something\nWent Wrong\nat our End!`}</Text>

            <TouchableOpacity style={styles.retry} onPress={retry}>
                <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3c4d93',
        alignItems: 'center',
        justifyContent: 'center'
    },
    temperature: {
        color: 'white',
        fontSize: normalize(50),
    },
    retry: {
        paddingHorizontal: normalize(30),
        marginTop: normalize(50),
        borderWidth: 1,
        borderColor: '#fff',
        paddingVertical: normalize(10)
    },
    retryText: {
        fontSize: normalize(16),
        color: '#fff'
    }
})
