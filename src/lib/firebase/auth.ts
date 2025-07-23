import {
  type User,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
} from "firebase/auth";

import { auth } from "./firebaseConfig";

export function onAuthStateChanged(callback: (authUser: User | null) => void) {
  return _onAuthStateChanged(auth, callback);
}

/**
 * Signs in a user with Google using a popup.
 *
 * This function utilizes the GoogleAuthProvider to initiate the sign-in process.
 * If the sign-in is successful, it returns the user's unique identifier (UID).
 *
 * @returns {Promise<string | undefined>} A promise that resolves to the user's UID if sign-in is successful, or undefined if it fails.
 * @throws {Error} Throws an error if the sign-in process fails or if the result does not contain a user.
 */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);

    if (!result || !result.user) {
      throw new Error("Google sign in failed");
    }
    return result.user.uid;
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

export async function signOutWithGoogle() {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}
