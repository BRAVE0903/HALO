import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const BottomNavBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const getIcon = () => {
          switch (route.name) {
            case 'Home':
              return <Ionicons name="home" size={24} color={isFocused ? 'black' : 'gray'} />;
            case 'Message':
              return <MaterialIcons name="message" size={24} color={isFocused ? 'black' : 'gray'} />;
            case 'Search':
              return <Feather name="search" size={24} color={isFocused ? 'black' : 'gray'} />;
            case 'Profile':
              return <Ionicons name="person" size={24} color={isFocused ? 'black' : 'gray'} />;
            default:
              return null;
          }
        };

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.tab}>
            {getIcon()}
            <Text style={[styles.label, { color: isFocused ? 'black' : 'gray' }]}>{route.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#c9d7ca',
    paddingVertical: 10,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  tab: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default BottomNavBar;