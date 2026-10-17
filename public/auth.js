
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
  apiKey: "AIzaSyCDHZAMxXMn8cpO_EaDpke7otBl_MeWBQY",
  authDomain: "nova-ai-2f655.firebaseapp.com",
  projectId: "nova-ai-2f655",
  appId: "1:225057696784:web:fd9209e31a1a2c7773ae95"
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


const loginButton = document.createElement("button");
loginButton.id = "google-login";
loginButton.textContent = "Google ile giriş yap";
loginButton.style.cssText =
  "position:fixed;top:12px;right:12px;z-index:9999;padding:10px 14px;border:1px solid #ddd;border-radius:20px;background:#fff;color:#111;font-weight:600;";

document.body.appendChild(loginButton);

loginButton.addEventListener("click", async () => {
  loginButton.textContent = "Google açılıyor...";
  loginButton.disabled = true;

  try {
    await window.novaGoogleLogin();
  } catch (error) {
    alert("Giriş hatası: " + error.message);
    loginButton.textContent = "Google ile giriş yap";
    loginButton.disabled = false;
  }
});

document.addEventListener("nova-auth-changed", () => {
  if (window.novaUser) {
    loginButton.textContent = window.novaUser.displayName || "Giriş yapıldı";
    loginButton.disabled = true;
  }
});


