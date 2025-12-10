// src/components/AdvicePanel.jsx
import React, { useState } from "react";
import api from "../api";

function AdvicePanel({ selectedDate }) {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState("");
  const [error, setError] = useState("");

  const handleGenerateAdvice = async () => {
    setLoading(true);
    setAdvice("");
    setError("");
    try {
      const res = await api.post("/ai/daily-advice/", {
        date: selectedDate,
      });
      setAdvice(res.data.advice);
    } catch (err) {
      console.error("获取建议失败：", err);
      setError("生成建议失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 h-full flex flex-col">
      <h2 className="font-semibold text-sm mb-2">AI 生活建议</h2>
      <p className="text-xs text-gray-500 mb-2">
        基于你当天的日程，从效率、休息、健康角度给出 3-5 条建议。
      </p>
      <button
        onClick={handleGenerateAdvice}
        disabled={loading}
        className="bg-blue-600 text-white text-xs rounded px-3 py-1 mb-2 self-start disabled:opacity-50"
      >
        {loading ? "生成中..." : "生成今日建议"}
      </button>

      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      <div className="flex-1 border rounded px-2 py-2 text-xs whitespace-pre-wrap overflow-auto">
        {advice || "尚未生成建议。"}
      </div>
    </div>
  );
}

export default AdvicePanel;