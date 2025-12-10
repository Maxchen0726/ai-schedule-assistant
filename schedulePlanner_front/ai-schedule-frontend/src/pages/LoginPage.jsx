// src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import api from "../api";

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    const expiredFlag = localStorage.getItem("session_expired");
    if (expiredFlag === "1") {
      setInfo("登录状态已过期，请重新登录。");
      localStorage.removeItem("session_expired");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      const res = await api.post("/auth/token/", { username, password });
      const access = res.data.access;
      const refresh = res.data.refresh;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      onLoginSuccess(access);
    } catch (err) {
      console.error(err);
      setError("用户名或密码错误，请重试。");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* 左侧：品牌 / 文案 */}
        <div className="hidden md:block text-slate-100 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/50 px-3 py-1 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>AI 日程助手 · Beta</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            让每天的安排<br />更轻松、更可控。
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            记录事件、查看统计、自动生成生活建议。
            <br />
            登录后即可在一个页面里掌握你的学习、工作和休息节奏。
          </p>
        </div>

        {/* 右侧：登录卡片 */}
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-slate-100 px-6 py-6 md:px-8 md:py-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">登录</h2>
              <p className="text-xs text-slate-500 mt-1">
                使用你的账户进入 AI 日程助手
              </p>
            </div>
          </div>

          {info && (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-md">
              {info}
            </div>
          )}

          {error && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                用户名
              </label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900 placeholder:text-slate-400"
                placeholder="例如：siwei"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                密码
              </label>
              <input
                type="password"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900 placeholder:text-slate-400"
                placeholder="你的登录密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white text-sm py-2.5 rounded-lg hover:bg-slate-800 active:bg-slate-900 transition-colors"
            >
              登录
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center">
            当前为本地开发环境 · 账号由管理员在 Django Admin 中创建
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;