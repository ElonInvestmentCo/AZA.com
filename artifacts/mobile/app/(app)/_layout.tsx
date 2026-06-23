import { Stack } from "expo-router";
import React from "react";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="sell-gift-card" />
      <Stack.Screen name="trade-asset" />
      <Stack.Screen name="confirm-transaction" />
      <Stack.Screen name="submitted" />
      <Stack.Screen name="success-payment" />
      <Stack.Screen name="transactions" />
      <Stack.Screen name="card-status" />
    </Stack>
  );
}
