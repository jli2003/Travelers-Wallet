import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
        tabBarActiveTintColor: 'white',
        tabBarStyle: { backgroundColor: 'black', borderTopWidth: 0,}
      }}>
        
      <Tabs.Screen 
      name="Home"
      options={{ 
        headerShown: false, 
        tabBarIcon: () => <FontAwesome size={20} name="home" color={'white'} />}}
      
      />
      <Tabs.Screen 
      name="Budget"
      options={{ 
        headerShown: false,
        tabBarIcon: () => <FontAwesome size={20} name="dollar" color={'white'} />
        }}
      />
      
    </Tabs>
  );
}
