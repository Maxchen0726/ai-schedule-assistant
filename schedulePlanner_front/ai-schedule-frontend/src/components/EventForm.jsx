// src/components/EventForm.jsx
import React, { useState } from "react";
import api from "../api";

function EventForm({ selectedDate }) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [eventType, setEventType] = useState("personal");
  const [message, setMessage] = useState("");

  const toISODateTime = (dateStr, timeStr) => {
    return `${dateStr}T${timeStr}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/events/", {
        title,
        description: "",
        start_time: toISODateTime(selectedDate, startTime),
        end_time: toISODateTime(selectedDate, endTime),
        is_all_day: false,
        event_type: eventType,
      });
      setMessage("创建成功！");
      setTitle("");
    } catch (err) {
      console.error("创建事件失败：", err);
      setMessage("创建失败，请检查输入或稍后重试。");
    }
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="font-semibold text-sm mb-2">新增事件</h2>
      <form className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm" onSubmit={handleSubmit}>
        <input
          className="border rounded px-2 py-1 col-span-2"
          placeholder="事件标题，如：学习 ML"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">开始</span>
          <input
            type="time"
            className="border rounded px-2 py-1"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">结束</span>
          <input
            type="time"
            className="border rounded px-2 py-1"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <select
          className="border rounded px-2 py-1"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        >
          <option value="work">工作</option>
          <option value="study">学习</option>
          <option value="fitness">运动</option>
          <option value="entertainment">娱乐</option>
          <option value="personal">个人</option>
        </select>

        <button
          type="submit"
          className="bg-green-600 text-white rounded px-2 py-1 md:col-span-1"
        >
          保存
        </button>
      </form>
      {message && <p className="text-xs text-gray-600 mt-1">{message}</p>}
    </div>
  );
}

export default EventForm;