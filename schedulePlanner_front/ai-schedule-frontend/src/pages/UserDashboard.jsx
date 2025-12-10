// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

function UserDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/me/dashboard/");
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("无法加载个人概览，请稍后再试。");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-500">
        正在加载个人信息...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-500">
        {error}
      </div>
    );
  }

  const { profile, total_events, events_last_7_days, events_by_type, total_advices, advices_last_30_days, last_active } = data;

  return (
    <div className="space-y-4">
      {/* 个人信息卡片 */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="font-semibold text-sm mb-2">个人信息</h2>
        <p className="text-sm">
          <span className="font-medium">用户名：</span>{profile.username}
        </p>
        <p className="text-sm">
          <span className="font-medium">显示名称：</span>{profile.display_name || "（未设置）"}
        </p>
        <p className="text-sm">
          <span className="font-medium">邮箱：</span>{profile.email || "（未设置）"}
        </p>
        <p className="text-sm">
          <span className="font-medium">时区：</span>{profile.timezone}
        </p>
        <p className="text-sm mt-2">
          <span className="font-medium">简介：</span>{profile.bio || "你还没有填写个人简介。"}
        </p>
      </div>

      {/* 活动统计 */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="font-semibold text-sm mb-2">活动记录</h2>
        <p className="text-sm">总事件数：{total_events}</p>
        <p className="text-sm">最近 7 天事件数：{events_last_7_days}</p>
        <p className="text-sm mt-1">
          最后活跃时间：{last_active ? new Date(last_active).toLocaleString() : "暂无记录"}
        </p>
      </div>

      {/* 事件类型分布 */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="font-semibold text-sm mb-2">事件类型分布（总计）</h2>
        <ul className="text-sm space-y-1">
          {Object.entries(events_by_type).map(([etype, count]) => (
            <li key={etype}>
              <span className="font-medium">{etype}</span>：{count}
            </li>
          ))}
        </ul>
      </div>

      {/* AI 使用情况 */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="font-semibold text-sm mb-2">AI 使用情况</h2>
        <p className="text-sm">总共生成建议：{total_advices} 次</p>
        <p className="text-sm">最近 30 天生成建议：{advices_last_30_days} 次</p>
      </div>
    </div>
  );
}

export default UserDashboard;