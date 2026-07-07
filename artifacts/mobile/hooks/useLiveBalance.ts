import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";

interface LiveBalanceResult {
  /** Wallet balance in Naira. null while loading or if no Firestore doc exists yet. */
  balance: number | null;
  loading: boolean;
  error: Error | null;
}

/**
 * useLiveBalance
 *
 * Subscribes to the Firestore document `/users/{uid}` for the currently
 * authenticated Firebase user and surfaces `walletBalanceNaira` in real time.
 *
 * The backend uses the Firebase Admin SDK to update `walletBalanceNaira`
 * (clients are blocked from writing that field directly by firestore.rules),
 * so every payment confirmation or admin credit is reflected instantly here.
 *
 * Returns `{ balance: null, loading: false, error: null }` when no Firebase
 * user is signed in, so callers can safely fall back to the JWT wallet API.
 */
export function useLiveBalance(): LiveBalanceResult {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Keep a reference to any active Firestore listener so we can tear it
    // down explicitly whenever the Firebase auth state changes — returning
    // a value from the onAuthStateChanged callback is not honoured by the
    // SDK and would leave stale listeners open across sign-in/sign-out.
    let firestoreUnsub: (() => void) | null = null;

    const teardownFirestore = () => {
      if (firestoreUnsub) {
        firestoreUnsub();
        firestoreUnsub = null;
      }
    };

    const authUnsub = auth().onAuthStateChanged((user) => {
      // Always tear down any previous Firestore listener first so we never
      // hold an active subscription for the wrong (or no) user.
      teardownFirestore();

      if (!user) {
        setBalance(null);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);

      firestoreUnsub = firestore()
        .collection("users")
        .doc(user.uid)
        .onSnapshot(
          (snapshot) => {
            // exists() is a method call in @react-native-firebase/firestore
            if (snapshot.exists()) {
              const data = snapshot.data();
              setBalance(
                typeof data?.walletBalanceNaira === "number"
                  ? data.walletBalanceNaira
                  : null,
              );
            } else {
              setBalance(null);
            }
            setLoading(false);
            setError(null);
          },
          (err) => {
            console.warn("[useLiveBalance] Firestore snapshot error:", err);
            setError(err);
            setLoading(false);
          },
        );
    });

    return () => {
      // On unmount: remove the auth listener first, then the Firestore one.
      authUnsub();
      teardownFirestore();
    };
  }, []);

  return { balance, loading, error };
}
