/**
 * CloudBase Web SDK 初始化
 * 
 * 环境 ID: personal-d9gneosnn8b41f1a5
 * 控制台: https://tcb.cloud.tencent.com/dev?envId=personal-d9gneosnn8b41f1a5
 */
import cloudbase from "@cloudbase/js-sdk";

const CLOUDBASE_ENV_ID = import.meta.env.VITE_CLOUDBASE_ENV_ID || "personal-d9gneosnn8b41f1a5";

export const app = cloudbase.init({
  env: CLOUDBASE_ENV_ID,
});

/**
 * 获取 Auth 实例
 */
export const auth = app.auth();

/**
 * 获取数据库实例
 */
export const db = app.database();

/**
 * 匿名登录 - 用于无需注册的体验场景
 * 生产环境应替换为正式登录方式
 */
export async function signInAnonymously() {
  const loginState = await auth.getLoginState();
  if (!loginState) {
    await auth.signInAnonymously();
  }
  return auth.getLoginState();
}

/**
 * 获取当前登录用户信息
 */
export async function getCurrentUser() {
  return auth.getCurrentUser();
}

export default app;
