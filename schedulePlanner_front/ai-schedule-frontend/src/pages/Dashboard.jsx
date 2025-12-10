// src/pages/Dashboard.jsx
import React, { useState } from "react";
import EventList from "../components/EventList.jsx";
import EventForm from "../components/EventForm.jsx";
import AdvicePanel from "../components/AdvicePanel.jsx";
import UserDashboard from "./UserDashboard.jsx";

function formatDate(date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

function Dashboard({ onLogout }) {
  const [selectedDate, setSelectedDate] = useState(() => formatDate(new Date()));
  const [tab, setTab] = useState("today"); // "today" | "me"

  return (
    <div className="min-h-screen bg-slate-100">
      {/* 顶部导航条 */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
            AI
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900">AI 日程助手</h1>
            <p className="text-[11px] text-slate-500">
              记录 · 复盘 · AI 生活建议
            </p>
          </div>
        </div>

        <button
          className="text-xs text-slate-600 border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50"
          onClick={onLogout}
        >
          退出登录
        </button>
      </header>

      <main className="max-w-6xl mx-auto py-6 px-4 lg:px-0 space-y-4">
        {/* 顶部 Tab 切换 */}
        <div className="flex gap-2 border-b border-slate-200 pb-2 mb-2">
          <button
            className={`text-xs md:text-sm px-3 py-1.5 rounded-t-lg ${
              tab === "today"
                ? "bg-white font-semibold shadow-sm border border-slate-200 border-b-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
            onClick={() => setTab("today")}
          >
            今日日程
          </button>
          <button
            className={`text-xs md:text-sm px-3 py-1.5 rounded-t-lg ${
              tab === "me"
                ? "bg-white font-semibold shadow-sm border border-slate-200 border-b-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
            onClick={() => setTab("me")}
          >
            我的概览
          </button>
        </div>

        {/* Tab 内容 */}
        {tab === "today" ? (
          <>
            {/* 日期选择 + 小标题 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  今天的安排
                </h2>
                <p className="text-xs text-slate-500">
                  选择日期，添加事件，并让 AI 帮你评估今天的节奏。
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">当前日期：</span>
                <input
                  type="date"
                  className="border border-slate-300 rounded-lg px-2 py-1 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/80 focus:border-slate-900"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            {/* 主体布局：左侧事件，右侧 AI 建议 */}
            <div className="grid lg:grid-cols-3 gap-4 mt-3">
              <div className="lg:col-span-2 space-y-4">
                <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                  <h3 className="text-xs font-semibold text-slate-800 mb-3">
                    新增事件
                  </h3>
                  <EventForm selectedDate={selectedDate} />
                </section>

                <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-slate-800">
                      当天事件
                    </h3>
                  </div>
                  <EventList selectedDate={selectedDate} />
                </section>
              </div>

              <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <AdvicePanel selectedDate={selectedDate} />
              </section>
            </div>
          </>
        ) : (
          <UserDashboard />
        )}
      </main>
    </div>
  );
}

export default Dashboard;