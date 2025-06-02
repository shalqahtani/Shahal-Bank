import { deleteToken } from "@/api/storage";
import AuthContext from "@/context/AuthContext";
import colors from "@/data/styling/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router, Tabs } from "expo-router";
import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
const TabLayout = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const queryClient = useQueryClient();
  const logout = () => {
    deleteToken(); // <--- This to delete token
    queryClient.clear(); // Clear all cached queries
    setIsAuthenticated(false); // If using context
    router.push("/login");
  };
  console.log();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: () => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons
              name="account-balance"
              size={28}
              color={colors.primary}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: colors.primary,
              }}
            >
              SAHAL Bank
            </Text>
          </View>
        ),
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopColor: colors.primary,
          height: 60,
          paddingBottom: 0,
          marginBottom: 0,
          alignSelf: "center",
          maxWidth: 600,
          width: "100%",
        },
        tabBarPosition: "top",
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.white,
        headerRight: () => (
          <TouchableOpacity onPress={() => logout()}>
            <MaterialIcons name="logout" size={30} color={colors.primary} />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="(tabs)/(home)"
        options={{
          title: "Home",
          tabBarIcon: () => null, // Completely hide the icon
        }}
      />
      <Tabs.Screen
        name="(tabs)/(transaction)"
        options={{
          title: "Transactions",
          tabBarIcon: () => null, // Completely hide the icon
        }}
      />
      <Tabs.Screen
        name="(tabs)/(users)"
        options={{
          title: "Users",
          tabBarIcon: () => null, // Completely hide the icon
        }}
      />
      <Tabs.Screen
        name="(tabs)/(profile)"
        options={{
          title: "Profile",
          tabBarIcon: () => null, // Completely hide the icon
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

const styles = StyleSheet.create({});
