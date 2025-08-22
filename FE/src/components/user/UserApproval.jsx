import React, { useEffect, useState } from "react";
import axiosInstance from "../../configs/axiosInstance";

const UserApproval = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("auth/users?pending=true");
      setPendingUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      alert("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId) => {
    try {
      await axiosInstance.put(`auth/users/${userId}/approve`);
      alert("User approved successfully!");
      fetchPendingUsers();
    } catch (err) {
      console.error("Failed to approve user:", err);
      alert("Failed to approve user.");
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  return (
    <div className="p-6 bg-[#4A6FA5] rounded-2xl mr-4 shadow">
      <h2 className="text-2xl font-bold mb-4">Pending User Approvals</h2>
      {loading ? (
        <p>Loading...</p>
      ) : pendingUsers.length === 0 ? (
        <p className="text-gray-600">No pending users.</p>
      ) : (
        <table className="w-full text-sm rounded-lg text-left border">
          <thead className="bg-[#D6E5E3]">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Username</th>
              <th className="p-2">Role</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody className="bg-[#E8F1F2]">
            {pendingUsers.map(user => (
              <tr key={user._id} className="border-t">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => approveUser(user._id)}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserApproval;
