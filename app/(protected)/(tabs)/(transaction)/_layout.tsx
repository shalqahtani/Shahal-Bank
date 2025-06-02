import colors from "@/data/styling/colors";
import { Stack } from "expo-router";
import React from "react";

const HomeLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.grey,
        },
        headerTitleStyle: {
          color: colors.primary,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "SAHAL Bank", headerBackVisible: false }}
      />
    </Stack>
  );
};

export default HomeLayout;
