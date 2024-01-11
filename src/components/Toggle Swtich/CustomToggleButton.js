import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';


export default function CustomToggleButton({ status, onToggle, subject }) {

    
    const value = status == "Offline" ? false : true;
    console.log(value);
    return (
        <TouchableOpacity onPress={onToggle} style={value ? styles.onback : styles.offback}>
            {value ? <>
                <Text style={styles.offtoggleText}>{value ? 'Online' : 'Offline'}  {subject}</Text>
                <TouchableOpacity onPress={onToggle} style={value ? styles.ontoggleButton : styles.offtoggleButton}>
                </TouchableOpacity >
            </>
                : <>
                    <TouchableOpacity onPress={onToggle} style={value ? styles.ontoggleButton : styles.offtoggleButton}>
                    </TouchableOpacity >
                    <Text style={styles.ontoggleText}>{value ? 'Online' : 'Offline'} {subject}</Text>
                </>}
        </TouchableOpacity >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
    },
    onback: {
        width: 150,
        borderRadius: 50,
        backgroundColor: '#44bd32',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 10,
        flexDirection: 'row'
    },
    offback: {
        width: 150,
        backgroundColor: '#e55039',
        borderRadius: 50,
        alignItems: 'center',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },

    ontoggleButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 100,
        elevation: 5
    },
    offtoggleButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 100,
        elevation: 5
    },
    ontoggleText: {
        marginHorizontal: 5,
        fontSize: 14,
        textAlign: 'center',
        color: 'white'
    },
    offtoggleText: {
        marginHorizontal: 5,
        fontSize: 14,
        textAlign: 'center',
        color: 'white'
    },
});