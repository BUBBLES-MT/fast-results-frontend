// app/lib/session.ts

const SESSION_TIMEOUT_MINUTES = 15; // dakika 15
const CHECK_INTERVAL_MS = 60000; // angalia kila dakika 1

export function startSessionTimeout() {
  // Weka last_activity wakati wa login
  localStorage.setItem("last_activity", Date.now().toString());
  
  // Anza interval ya kuangalia
  const interval = setInterval(() => {
    const lastActivity = localStorage.getItem("last_activity");
    if (!lastActivity) return;
    
    const now = Date.now();
    const elapsed = (now - parseInt(lastActivity)) / 1000 / 60; // dakika
    
    if (elapsed >= SESSION_TIMEOUT_MINUTES) {
      // 🔥 LOGOUT AUTOMATIC!
      console.log(`⏰ Session timeout after ${SESSION_TIMEOUT_MINUTES} minutes`);
      localStorage.clear();
      window.location.href = "/login?timeout=true";
    }
  }, CHECK_INTERVAL_MS);
  
  return () => clearInterval(interval);
}

// 🔥 FUNGA KWA KILA SHUGHULI YA USER
export function updateLastActivity() {
  localStorage.setItem("last_activity", Date.now().toString());
}

// 🔥 WEKA HII KWENYE APP LAYOUT AU DASHBOARD
export function setupSessionMonitoring() {
  // Fungua interval
  const cleanup = startSessionTimeout();
  
  // Weka event listeners kwa shughuli zote
  const events = ['click', 'keydown', 'scroll', 'mousemove', 'touchstart'];
  const update = () => updateLastActivity();
  
  events.forEach(event => {
    document.addEventListener(event, update);
  });
  
  return () => {
    cleanup();
    events.forEach(event => {
      document.removeEventListener(event, update);
    });
  };
}