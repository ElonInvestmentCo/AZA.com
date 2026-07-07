/**
 * Stub for @react-native-firebase/firestore
 *
 * Provides the minimal surface used by useLiveBalance so the hook compiles
 * and runs in standard Expo Go. All listeners are no-ops; snapshots report
 * "document does not exist", which causes useLiveBalance to return
 * { balance: null } and the UI falls back to the REST wallet API.
 */

type Unsubscribe = () => void;

interface StubDocSnapshot {
  exists(): boolean;
  data(): Record<string, unknown> | null;
}

interface StubDocRef {
  onSnapshot(
    onNext: (snapshot: StubDocSnapshot) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe;
}

interface StubCollectionRef {
  doc(id: string): StubDocRef;
}

interface StubFirestore {
  collection(name: string): StubCollectionRef;
}

const firestore = (): StubFirestore => ({
  collection: (_name: string) => ({
    doc: (_id: string) => ({
      onSnapshot: (_onNext, _onError) => () => {}, // no-op listener
    }),
  }),
});

export default firestore;
