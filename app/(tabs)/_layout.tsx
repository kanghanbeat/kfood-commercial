import { Tabs } from "expo-router";
import React from "react";

import { theme } from "@/constants/theme";

const hiddenTabOptions = {
  href: null,
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: "Map",
          title: "Map",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          title: "Profile",
        }}
      />
      <Tabs.Screen
        name="search"
        options={hiddenTabOptions}
      />
      <Tabs.Screen
        name="create"
        options={hiddenTabOptions}
      />
      <Tabs.Screen
        name="ranking"
        options={hiddenTabOptions}
      />
    </Tabs>
  );
}
