import { Redirect } from "expo-router";

// Temporary: route the app root to the replica launcher so the preview
// opens the dev/testing launcher directly. The replica screens are kept
// in dedicated files (trade-submitted-replica.tsx, trade-rejected-replica.tsx)
// and are not integrated into any real app flow.
export default function Index() {
  return <Redirect href="/replica-launcher" />;
}
