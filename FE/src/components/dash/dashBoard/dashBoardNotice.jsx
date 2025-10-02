import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../configs/axiosInstance";
import { FaChevronDown } from "react-icons/fa";
import { IoPencil, IoTrashOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Pill = ({ children, tone = "gray" }) => {
  const tones = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${tones[tone] || tones.gray}`}>
      {children}
    </span>
  );
};

export default function DashBoardNotice() {
  const navigate = useNavigate();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // filter dropdown góc phải (All / Active / Disabled)
  const [stateFilter, setStateFilter] = useState("All");
  const [openStateDrop, setOpenStateDrop] = useState(false);

  // tabs phía trên (All + các page)
  const [pageFilter, setPageFilter] = useState("All");

  // đang xoá id nào → để disable icon
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let alive = true;

    const fetchNotices = async () => {
      setLoading(true);
      setErr(null);
      try {
        const { data } = await axiosInstance.get("/notice/admin");
        if (!alive) return;
        const mapped = (Array.isArray(data?.notices) ? data.notices : data || []).map((n) => ({
          id: n?.id ?? n?._id ?? null,
          title: n?.title ?? "—",
          subtitle: n?.subtitle ?? "",
          pages: Array.isArray(n?.pages) ? n.pages : [],
          state: !!n?.state,
          imageUrl: n?.image?.url || n?.image || null,
          updatedAt: n?.updatedAt ?? n?.createdAt ?? null,
        }));
        setNotices(mapped);
      } catch (e) {
        if (alive) setErr(e?.response?.data?.message || e?.message || "Failed to load notices");
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchNotices();
    return () => { alive = false; };
  }, []);

  // Danh sách pages duy nhất để render tab
  const pageTabs = useMemo(() => {
    const set = new Set();
    notices.forEach((n) => n.pages?.forEach((p) => set.add(p)));
    return ["All", ...Array.from(set)];
  }, [notices]);

  // đếm số theo tab
  const pageCounts = useMemo(() => {
    const counts = { All: notices.length };
    notices.forEach((n) => {
      (n.pages || []).forEach((p) => {
        counts[p] = (counts[p] || 0) + 1;
      });
    });
    return counts;
  }, [notices]);

  // áp 2 filter: page + state
  const filtered = useMemo(() => {
    return notices.filter((n) => {
      const matchPage = pageFilter === "All" ? true : (n.pages || []).includes(pageFilter);
      const matchState =
        stateFilter === "All" ? true : stateFilter === "Active" ? n.state : !n.state;
      return matchPage && matchState;
    });
  }, [notices, pageFilter, stateFilter]);

  const toggleState = async (notice) => {
    try {
      // Optimistic UI
      setNotices((prev) =>
        prev.map((n) => (n.id === notice.id ? { ...n, state: !n.state } : n))
      );
      await axiosInstance.put(`/notice/${notice.id}/state`, { state: !notice.state });
    } catch (e) {
      // revert nếu lỗi
      setNotices((prev) =>
        prev.map((n) => (n.id === notice.id ? { ...n, state: notice.state } : n))
      );
      alert(e?.response?.data?.message || e?.message || "Failed to update state");
    }
  };

  const toEdit = (n) => {
    navigate(`/dash-board/update-notices?id=${n.id}`);
  };

  const onDelete = async (n) => {
    const ok = window.confirm(`Delete notice "${n.title}"?`);
    if (!ok) return;

    // Optimistic remove
    setDeletingId(n.id);
    const prevNotices = notices;
    setNotices((cur) => cur.filter((x) => x.id !== n.id));

    try {
      await axiosInstance.delete(`/notice/${n.id}`);
      // success: giữ nguyên
    } catch (e) {
      // fail -> revert
      setNotices(prevNotices);
      alert(e?.response?.data?.message || e?.message || "Failed to delete notice");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Notices manage</h3>

        <div className="flex items-center gap-3">
          {/* dropdown filter state */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenStateDrop((s) => !s)}
              className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center"
            >
              {stateFilter}
              <FaChevronDown className="ml-2 text-xs" />
            </button>
            {openStateDrop && (
              <div className="absolute right-0 mt-2 w-36 bg-white shadow rounded-md overflow-hidden z-10">
                {["All", "Active", "Disabled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStateFilter(s);
                      setOpenStateDrop(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      stateFilter === s ? "font-semibold" : ""
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center"
            onClick={() => navigate("/dash-board/update-notices")}
          >
            + Add notice
          </button>
        </div>
      </div>

      {/* Tabs (All / page…) */}
      <div className="flex items-center gap-3 border-b pb-2 mb-4">
        {pageTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setPageFilter(tab)}
            className={`text-sm px-3 py-1.5 rounded-full ${
              pageFilter === tab ? "bg-black text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab}{" "}
            {pageCounts[tab] != null && (
              <span className="ml-1 text-xs opacity-80">{pageCounts[tab]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Error */}
      {err && (
        <div className="mb-4 rounded-md bg-red-50 text-red-700 px-4 py-3">{err}</div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100">
        <table className="w-full text-sm table-fixed">
          {/* Cố định chiều rộng cột để bảng không “nhảy” */}
          <colgroup>
            <col className="w-[38%]" /> {/* Title */}
            <col className="w-[28%]" /> {/* Pages */}
            <col className="w-[14%]" /> {/* State */}
            <col className="w-[20%]" /> {/* Actions */}
          </colgroup>

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left font-medium px-4 py-3">Title</th>
              <th className="text-left font-medium px-4 py-3">Pages</th>
              <th className="text-left font-medium px-4 py-3">State</th>
              <th className="text-right font-medium px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-4" colSpan={4}>
                    <div className="h-6 bg-gray-100 animate-pulse rounded" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr className="border-t">
                <td className="px-4 py-8 text-center text-gray-500" colSpan={4}>
                  No notices found.
                </td>
              </tr>
            ) : (
              filtered.map((n) => (
                <tr key={n.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900 truncate">{n.title}</div>
                    {n.subtitle ? (
                      <div className="text-xs text-gray-500 mt-0.5 truncate">{n.subtitle}</div>
                    ) : null}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(n.pages || []).length
                        ? n.pages.map((p, i) => <Pill key={i}>{p}</Pill>)
                        : <span className="text-gray-400">—</span>}
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    {n.state ? <Pill tone="green">Active</Pill> : <Pill tone="red">Disabled</Pill>}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4 justify-end">
                      {/* GIỮ NGUYÊN Activate/Disable */}
                      <button
                        onClick={() => toggleState(n)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          n.state
                            ? "bg-red-50 text-red-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {n.state ? "Disable" : "Activate"}
                      </button>

                      {/* EDIT icon kiểu DashUMTable */}
                      <IoPencil
                        onClick={() => toEdit(n)}
                        className="cursor-pointer text-green-500 hover:text-green-700 text-lg"
                        title="Edit"
                        aria-label="Edit notice"
                      />

                      {/* DELETE icon kiểu DashUMTable */}
                      <IoTrashOutline
                        onClick={() => (deletingId ? null : onDelete(n))}
                        className={`cursor-pointer text-red-500 hover:text-red-700 text-lg ${
                          deletingId === n.id ? "opacity-50 pointer-events-none" : ""
                        }`}
                        title={deletingId === n.id ? "Deleting..." : "Delete"}
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
    </section>
  );
}
