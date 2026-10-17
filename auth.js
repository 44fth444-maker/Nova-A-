
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Firebase Console > Project settings > Your apps > Web app
const firebaseConfig = {
  apiKey: "BURAYA_API_KEY",
  authDomain: "BURAYA_AUTH_DOMAIN",
  projectId: "nova-ai-2f655",
  appId: "BURAYA_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

getRedirectResult(auth).catch(error => {
  console.error("Google giriş hatası:", error);
  alert("Giriş hatası: " + error.message);
});

onAuthStateChanged(auth, user => {
  console.log(user ? "Giriş yapıldı: " + user.email : "Henüz giriş yapılmadı");
  window.novaUser = user;
  document.dispatchEvent(new Event("nova-auth-changed"));
});

window.novaGoogleLogin = () => signInWithRedirect(auth, provider);
window.novaLogout = () => signOut(auth);

