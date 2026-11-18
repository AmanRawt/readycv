/**
 * ReadyCVs — auth_manager.js
 * Shared auth state manager — prevents login redirect loop
 * Import this on every page EXCEPT login.html itself
 */

import { auth } from '../core/firebase.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const PUBLIC_PAGES = ['login.html', 'index.html', 'ats_page.html', 'ai_resume_writer.html', 'resume_maker.html', 'team.html', 'help.html'];
const currentPage  = window.location.pathname.split('/').pop() || 'index.html';
const isLoginPage  = currentPage === 'login.html';
const isProfilePage= currentPage === 'profile.html';

let authResolved = false;

onAuthStateChanged(auth, user => {
  authResolved = true;
  window._currentUser = user || null;

  if (isLoginPage && user) {
    // Logged in, on login page → go to profile (NOT back to login)
    window.location.replace('profile.html');
    return;
  }

  if (isProfilePage && !user) {
    // Not logged in, on profile → go to login
    window.location.replace('login.html');
    return;
  }

  // Update header nav on every page
  updateHeaderNav(user);
});

function updateHeaderNav(user) {
  // Replace "Log In" links with "My Profile" when logged in
  document.querySelectorAll('a[href="login.html"], a[href="login_page.html"]').forEach(el => {
    if (user) {
      el.href        = 'profile.html';
      el.textContent = ''; // will rebuild
      el.innerHTML   = '<span class="material-symbols-outlined" style="font-size:18px;vertical-align:middle">account_circle</span> My Profile';
    }
  });

  // Show/hide logout buttons
  const logoutBtns = document.querySelectorAll('[data-logout]');
  logoutBtns.forEach(btn => { btn.style.display = user ? '' : 'none'; });

  // Show profile avatar in header if logged in
  const profileAvatar = document.getElementById('headerProfileBtn');
  if (profileAvatar && user) {
    profileAvatar.style.display = '';
    const initial = (user.displayName || user.email || '?')[0].toUpperCase();
    if (user.photoURL) {
      profileAvatar.innerHTML = `<img src="${user.photoURL}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;display:block">`;
    } else {
      profileAvatar.textContent = initial;
    }
  }
}

export async function logout() {
  await signOut(auth);
  window.location.replace('index.html');
}

export function getCurrentUser() {
  return window._currentUser || null;
}
