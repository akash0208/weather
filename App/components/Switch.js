import React, { Component } from 'react'
import { Text, StyleSheet, View, Switch } from 'react-native'
import { normalize } from '../helper/helper'

export default class App extends Component {
    render() {
        const { value, onChange } = this.props
        return (
            <View style={styles.switchContainer}>
                <Text style={styles.type}>C</Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={true ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={onChange}
                    value={value}
                />
                <Text style={styles.type}>F</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    switchContainer: {
        position: 'absolute',
        right: normalize(12),
        flexDirection: 'row',
        top: normalize(15),
        alignItems: 'center',
        justifyContent: 'space-between',
        width: normalize(60)
    },
    type: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: normalize(15)
    },
})
