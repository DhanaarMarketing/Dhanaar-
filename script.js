// ==========================
// DHANAAR MARKETING V2
// SCRIPT.JS - PART 1
// ==========================

import { auth, db } from "./firebase.js";
import {
  ref,
  set,
  get
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

// Referral Code
let referralCode = localStorage.getItem("referralCode");

if (!referralCode) {
    referralCode = "FIDA" + Math.floor(10000 + Math.random() * 90000);
    localStorage.setItem("referralCode", referralCode);
}

// Player Data
let points = Number(localStorage.getItem("points")) || 0;
let coins = Number(localStorage.getItem("coins")) || 0;
let xp = Number(localStorage.getItem("xp")) || 0;
let level = Number(localStorage.getItem("level")) || 1;

let history = JSON.parse(localStorage.getItem("history")) || [];

// Save Data
async function saveData() {

    localStorage.setItem("points", points);
    localStorage.setItem("coins", coins);
    localStorage.setItem("xp", xp);
    localStorage.setItem("level", level);
    localStorage.setItem("history", JSON.stringify(history));

    if (!auth.currentUser) return;

    await set(ref(db, "players/" + auth.currentUser.uid), {
        name: document.getElementById("profileName").innerText,
        referralCode,
        points,
        coins,
        xp,
        level,
        history,
        updated: new Date().toISOString()
    });

}

// Load Data
async function loadData() {

    if (!auth.currentUser) return;

    const snapshot = await get(ref(db, "players/" + auth.currentUser.uid));

    if (snapshot.exists()) {

        const data = snapshot.val();

        points = data.points || 0;
        coins = data.coins || 0;
        xp = data.xp || 0;
        level = data.level || 1;
        history = data.history || [];

    }

    updateScreen();

}
// ==========================
// PART 2 - Login & Dashboard
// ==========================

async function login() {

    const name = document.getElementById("name").value.trim();

    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    document.getElementById("username").innerText = name;
    document.getElementById("profileName").innerText = name;

    generateReferral();

    await loadData();

    loginReward();

    updateScreen();
}

function updateScreen() {

    document.getElementById("points").innerText = points;
    document.getElementById("coins").innerText = coins;
    document.getElementById("level").innerText = level;
    document.getElementById("xp").innerText = xp + " / 100";

    document.getElementById("profileCoins").innerText = coins;
    document.getElementById("profileLevel").innerText = level;

    document.getElementById("leaderCoins").innerText = coins;
    document.getElementById("leaderLevel").innerText = level;
    document.getElementById("leaderPoints").innerText = points;

    document.getElementById("history").innerHTML =
        history.length
            ? history.join("<hr>")
            : "<p>No Transactions Yet</p>";

    checkBadges();
}

function levelCheck() {

    while (xp >= 100) {
        xp -= 100;
        level++;
        addHistory("⭐ Level Up! Level " + level);
    }

}

function loginReward() {

    const today = new Date().toDateString();

    if (localStorage.getItem("lastLoginReward") === today) return;

    coins += 10;
    points += 10;
    xp += 10;

    localStorage.setItem("lastLoginReward", today);

    addHistory("🎁 Daily Login Reward (+10 Coins)");

    saveData();
}
// ==========================
// PART 3 - Referral & Tasks
// ==========================

// Generate Referral
function generateReferral() {

    document.getElementById("refCode").value = referralCode;
    document.getElementById("profileReferral").innerText = referralCode;

}

// Copy Referral
function copyReferral() {

    const input = document.getElementById("refCode");

    input.select();
    navigator.clipboard.writeText(input.value);

    alert("Referral Code Copied!");

}

// Add History
function addHistory(text) {

    history.unshift(
        "🕒 " + new Date().toLocaleString() + " - " + text
    );

    if (history.length > 30) {
        history.pop();
    }

}

// Daily Task
function dailyTask() {

    points += 10;
    coins += 5;
    xp += 20;

    addHistory("✅ Daily Task");

    levelCheck();
    saveData();
    updateScreen();

}

// Common Task
function completeTask(reward, taskName) {

    points += reward;
    coins += reward;
    xp += 10;

    addHistory(taskName);

    levelCheck();
    saveData();
    updateScreen();

}

// WhatsApp
function shareOnWhatsApp() {

    window.open(
        "https://wa.me/?text=Join%20Dhanaar%20Marketing",
        "_blank"
    );

    completeTask(10, "📲 WhatsApp Task");

}

// TikTok
function visitTikTok() {

    window.open(
        "https://www.tiktok.com/@fidajunejo12",
        "_blank"
    );

    completeTask(15, "🎵 TikTok Task");

}

// YouTube
function watchPromoVideo() {

    window.open(
        "https://www.youtube.com/@VIVC177",
        "_blank"
    );

    completeTask(20, "▶️ YouTube Task");

}
// ==========================
// PART 4 - Final
// ==========================

// Daily Reward
function claimDailyReward() {

    const today = new Date().toDateString();

    if (localStorage.getItem("dailyReward") === today) {
        alert("Today's reward already claimed!");
        return;
    }

    coins += 25;
    points += 25;
    xp += 25;

    localStorage.setItem("dailyReward", today);

    addHistory("🎁 Daily Reward");

    levelCheck();
    saveData();
    updateScreen();

}

// Lucky Spin
function spinWheel() {

    const rewards = [10, 20, 30, 50, 100];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];

    coins += reward;
    points += reward;
    xp += 15;

    addHistory("🎡 Lucky Spin +" + reward);

    levelCheck();
    saveData();
    updateScreen();

}

// Gift Code
function redeemGift() {

    const code = document.getElementById("giftCode").value.trim().toUpperCase();

    if (code === "WELCOME100") {
        coins += 100;
        points += 100;
    } else if (code === "DHANAAR50") {
        coins += 50;
        points += 50;
    } else {
        alert("Invalid Gift Code");
        return;
    }

    addHistory("🎁 Gift Code");

    saveData();
    updateScreen();

}

// Withdrawal
function withdraw() {

    const account = document.getElementById("account").value.trim();

    if (coins < 500) {
        alert("500 Coins Required");
        return;
    }

    if (!account) {
        alert("Enter JazzCash / Easypaisa");
        return;
    }

    coins -= 500;

    addHistory("💸 Withdrawal Request");

    saveData();
    updateScreen();

}

// Badges
function checkBadges() {

    let badges = [];

    if (level >= 5) badges.push("🥉 Bronze");
    if (level >= 10) badges.push("🥈 Silver");
    if (level >= 20) badges.push("🥇 Gold");

    document.getElementById("badges").innerHTML =
        badges.length ? badges.join("<br>") : "No Badges";

}

// Start
window.onload = function () {

    generateReferral();
    updateScreen();

};
window.login = login;
window.copyReferral = copyReferral;
window.dailyTask = dailyTask;
window.shareOnWhatsApp = shareOnWhatsApp;
window.visitTikTok = visitTikTok;
window.watchPromoVideo = watchPromoVideo;
window.claimDailyReward = claimDailyReward;
window.spinWheel = spinWheel;
window.redeemGift = redeemGift;
window.withdraw = withdraw;