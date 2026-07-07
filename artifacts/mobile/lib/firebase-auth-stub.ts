/**
 * Stub for @react-native-firebase/auth
 *
 * Used so the app bundles cleanly in standard Expo Go (which does not ship
 * the native Firebase SDK). Features that rely on real-time Firebase auth
 * (e.g. useLiveBalance) will see "no authenticated user" and fall back to
 * the JWT wallet API — exactly the documented fallback path.
 *
 * In a production / EAS development-build this file is never reached because
 * the real @react-native-firebase/auth package resolves first.
 */

type Unsubscribe = () => void;
type User = null; // stub never provides a signed-in user

interface StubAuth {
  onAuthStateChanged(callback: (user: User) => void): Unsubscribe;
  currentUser: null;
}

const auth = (): StubAuth => ({
  onAuthStateChanged: (callback) => {
    // Always report "no signed-in Firebase user"
    callback(null);
    return () => {};
  },
  currentUser: null,
});

export default auth;
