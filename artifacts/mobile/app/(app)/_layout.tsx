import { Stack } from "expo-router";
import React from "react";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="trade-asset" />
      <Stack.Screen name="confirm-transaction" />
      <Stack.Screen name="submitted" />
      <Stack.Screen name="rejected" />
      <Stack.Screen name="success-payment" />
      <Stack.Screen name="transactions" />
      <Stack.Screen name="card-status" />
      <Stack.Screen name="sell-gift-card" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="bills" />
      <Stack.Screen name="airtime" />
      <Stack.Screen name="data" />
      <Stack.Screen name="withdraw" />
      <Stack.Screen name="crypto" />
      <Stack.Screen name="rates" />
      <Stack.Screen name="referral" />
      <Stack.Screen name="esim" />
      <Stack.Screen name="more" />
    </Stack>
  );
}
