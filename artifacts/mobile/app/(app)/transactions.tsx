/**
 * Legacy route kept for backward compatibility.
 * All transaction-history UX lives in (tabs)/history.tsx.
 * Any deep-link or reference to /(app)/transactions will be redirected here.
 */
import { Redirect } from "expo-router";

export default function TransactionsRedirect() {
  return <Redirect href="/(tabs)/history" />;
}
