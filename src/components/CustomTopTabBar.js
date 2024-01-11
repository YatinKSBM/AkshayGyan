import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../config/Constants';

function CustomTopTabBar({ state, descriptors, navigation }) {
    const { navigate } = useNavigation();

    return (
        <View style={{ flexDirection: 'row' }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel || route.name;
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => navigate(route.name)}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            backgroundColor: colors.white_color,
                            paddingVertical: 15,
                            borderBottomColor: colors.background_theme2,
                            borderBottomWidth: route.key === state.routes[state.index].key ? 2 : 0, // Highlight the active tab
                        }}
                    >
                        <Text style={{ fontSize: 16, color: colors.black_color }}>{label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

export default CustomTopTabBar;
