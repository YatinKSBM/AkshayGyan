import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import CustomToggleButton from './CustomToggleButton';

export default function ToggleButton() {
    const [isOn, setIsOn] = useState(false);
    const handleToggle = () => {
        setIsOn((prevIsOn) => !prevIsOn);
    };
    return (
        <View style={styles.container}>
            <CustomToggleButton value={isOn} onToggle={handleToggle} />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});