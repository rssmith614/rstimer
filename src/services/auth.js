import app from "./firebase";
import { getAuth } from "firebase/auth";

export const auth = getAuth(app);
// export const provider = new GoogleAuthProvider();