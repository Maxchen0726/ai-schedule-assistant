// src/components/EventList.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

function EventList({ selectedDate }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/events/", {
        params: { date: selectedDate },
      });
      setEvents(res.data);
    } catch (err) {
      console.error("获取事件失败：", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const handleDelete = async (id) => {
    if (!window.confirm("确定删除这个事件吗？")) return;
    try {
      await api.delete(`/events/${id}/`);
      fetchEvents();
    } catch (err) {
      console.error("删除失败：", err);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-sm">当天事件</h2>
        <button
          onClick={fetchEvents}
          className="text-xs border rounded px-2 py-1"
        >
          刷新
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-gray-500">加载中...</p>
      ) : events.length === 0 ? (
        <p className="text-xs text-gray-500">这一天还没有事件。</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {events.map((e) => (
            <li
              key={e.id}
              className="border rounded px-3 py-2 flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{e.title}</div>
                <div className="text-xs text-gray-500">
                  {new Date(e.start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" - "}
                  {new Date(e.end_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" · "}
                  <span>{e.event_type}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(e.id)}
                className="text-xs text-red-500"
              >
                删除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EventList;
