import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { signInAnonymously } from './config/cloudbase'

// 预初始化 CloudBase 并匿名登录
async function initApp() {
  try {
    const loginState = await signInAnonymously();
    console.log('[CloudBase] Anonymous login success, uid:', loginState?.user?.uid);
  } catch (e) {
    console.warn('[CloudBase] Anonymous login failed, AI features may not work:', e);
  }
  createRoot(document.getElementById('root')!).render(<App />);
}

initApp();
