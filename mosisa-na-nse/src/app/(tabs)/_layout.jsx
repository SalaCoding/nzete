import { Tabs } from "expo-router"
import React from 'react'
import { Ionicons } from "@expo/vector-icons"
import { Platform } from "react-native"

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'rgb(38, 154, 155)',
        tabBarInactiveTintColor: 'gray',
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: 'rgb(38, 154, 155)',
          paddingTop: Platform.OS === 'android' ? 10 : 8,
        }
      }}
    >
      <Tabs.Screen name="index"
        options={{
          title: "Home",
          tabBarIcon: ({color, size}) => (<Ionicons
            name="home-outline" size={26} color={color}
          />)
        }}
      />
      <Tabs.Screen name="ranked" 
        options={{
          title: "Ranked",
          tabBarIcon: ({color, size}) => (<Ionicons
            name='stats-chart-outline' size={26} color={color}
          />)
        }}
      />
      <Tabs.Screen name="profile" 
        options={{
          title: "Profile",
          tabBarIcon: ({color, size}) => (<Ionicons
            name='person-circle-outline' size={26} color={color}
          />)
        }}
      />
      <Tabs.Screen name="change-username"
        options={{
          title: "Change Username",
          tabBarIcon: ({color, size}) => (<Ionicons
            name='cog-outline' size={26} color={color}
          />)
        }}
      />
      <Tabs.Screen name="delete-account"
        options={{
          title: "Delete Account",
          tabBarIcon: ({color, size}) => (<Ionicons
            name='trash-outline' size={26} color={color}
          />)
        }}
      />
    </Tabs>
  )
}

export default TabLayout
