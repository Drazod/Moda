// src/components/dash/dashUptN/DashUptNNoticesTable.jsx
import React, { useEffect, useState } from "react";
import { IoPencil, IoTrashOutline } from "react-icons/io5";
import axiosInstance from "../../../configs/axiosInstance";

const Pill = ({ active }) => (
  <span
    className={`px-3 py-1 text-xs rounded-full ${
      active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}
  >
    {active ? "Active" : "Disabled"}
  </span>
);

export default function DashUptNNoticesTable({ onEditNotice, onDeleted }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);
      const { data } = await axiosInstance.get("/notice/admin");
      const list = Array.isArray(data?.notices)
        ? data.notices
        : Array.isArray(data)
        ? data
        : [];
      // chuẩn hoá nhẹ
      setRows(
        list.map((n) => ({
          id: n.id ?? n._id,
          title: n.title ?? "—",
          pages: Array.isArray(n.pages) ? n.pages : [],
          state: !!n.state,
          updatedAt: n.updatedAt ?? n.createdAt ?? null,
        }))
      );
    } catch (e) {
      setErr("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleState = async (row) => {
    // optimistic
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, state: !r.state } : r))
    );
    try {
      await axiosInstance.put(`/notice/${row.id}/state`, { state: !row.state });
    } catch (e) {
      // revert khi lỗi
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, state: row.state } : r))
      );
      alert(e?.response?.data?.message || e?.message || "Update failed");
    }
  };

  const handleDelete = async (row) => {
    const ok = window.confirm(`Delete notice "${row.title}"?`);
    if (!ok) return;
    setDeletingId(row.id);

    const prev = rows;
    setRows(prev.filter((r) => r.id !== row.id));
    try {
      await axiosInstance.delete(`/notice/${row.id}`);
      onDeleted?.(row);
    } catch (e) {
      setRows(prev); // revert
      alert(e?.response?.data?.message || e?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm w-full overflow-hidden">
      {err && <div className="mb-3 text-red-600">{err}</div>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          {/* cố định width để bảng không “nhảy” */}
          <colgroup>
            <col className="w-[8%]" />   {/* Id */}
            <col className="w-[40%]" />  {/* Title */}
            <col className="w-[24%]" />  {/* Pages */}
            <col className="w-[12%]" />  {/* Active */}
            <col className="w-[16%]" />  {/* Actions */}
          </colgroup>

        <thead className="text-gray-500 border-b">
          <tr>
            <th className="text-left py-3">Id</th>
            <th className="text-left py-3">Title</th>
            <th className="text-left py-3">Pages</th>
            <th className="text-left py-3">Active</th>
            <th className="text-right py-3 pr-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <tr key={i} className="border-b">
                <td colSpan={5} className="py-4">
                  <div className="h-5 bg-gray-100 animate-pulse rounded" />
                </td>
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-gray-500">
                No notices.
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id} className="border-b last:border-b-0">
                <td className="py-4">{r.id}</td>
                <td className="py-4 font-medium truncate">{r.title}</td>
                <td className="py-4">
                  <div className="flex flex-wrap gap-1">
                    {r.pages.length
                      ? r.pages.map((p, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700"
                          >
                            {p}
                          </span>
                        ))
                      : "—"}
                  </div>
                </td>
                <td className="py-4">
                  <button onClick={() => toggleState(r)} title="Toggle">
                    <Pill active={r.state} />
                  </button>
                </td>
                <td className="py-4 pr-2">
                  <div className="flex justify-end items-center space-x-4">
                    <IoPencil
                      onClick={() => onEditNotice?.(r)}
                      className="cursor-pointer text-green-500 hover:text-green-700 text-lg"
                      title="Edit"
                      aria-label="Edit notice"
                    />
                    <IoTrashOutline
                      onClick={() => (deletingId ? null : handleDelete(r))}
                      className={`cursor-pointer text-red-500 hover:text-red-700 text-lg ${
                        deletingId === r.id ? "opacity-50 pointer-events-none" : ""
                      }`}
                      title={deletingId === r.id ? "Deleting..." : "Delete"}
                      aria-label="Delete notice"
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
}
