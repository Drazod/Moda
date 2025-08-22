import React, { useEffect, useState } from "react";
import axiosInstance from "../../configs/axiosInstance";

const RoomListEditor = () => {
  const [rooms, setRooms] = useState([]);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [formData, setFormData] = useState({ name: '', building: '', location: '', description: '', capacity: 0 });
  const [newRoom, setNewRoom] = useState({ name: '', building: '', location: '', description: '', capacity: 0 });

  const fetchRooms = async () => {
    try {
      const res = await axiosInstance.get("/rooms");
      setRooms(res.data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleEditClick = (room) => {
    setEditingRoomId(room._id);
    setFormData({ name: room.name, building: room.building, location: room.location, description: room.description, capacity: room.capacity });
  };

  const handleCancel = () => {
    setEditingRoomId(null);
    setFormData({ name: '', building: '', location: '', description: '', capacity: 0 });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNewChange = (e) => {
    setNewRoom(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await axiosInstance.put(`/rooms/${editingRoomId}`, formData);
      alert("Room updated successfully");
      fetchRooms();
      handleCancel();
    } catch (error) {
      console.error("Failed to update room:", error);
      alert("Failed to update room");
    }
  };

  const handleAddRoom = async () => {
    if (!newRoom.name || !newRoom.building) {
      return alert("Name and Building are required.");
    }

    try {
      await axiosInstance.post("/rooms", newRoom);
      alert("Room added successfully");
      setNewRoom({ name: '', building: '', location: '', description: '', capacity: 0 });
      fetchRooms();
    } catch (error) {
      console.error("Failed to add room:", error);
      alert("Failed to add room");
    }
  };

  return (
    <div className="col-span-2 bg-[#4A6FA5] text-[#1D1A05]  rounded-2xl p-6 shadow-md mx-auto ">
      <h2 className="text-xl font-bold mb-4">Room Management</h2>

      {/* Add New Room Form */}
      <div className="mb-6 border p-4 rounded-lg bg-[#E8F1F2]">
        <h3 className="text-md font-semibold mb-2">Add New Room</h3>
        <div className="grid grid-cols-5 gap-2">
          <input name="name" value={newRoom.name} onChange={handleNewChange} placeholder="Name" className="border px-2 py-1" />
          <input name="building" value={newRoom.building} onChange={handleNewChange} placeholder="Building" className="border px-2 py-1" />
          <input name="location" value={newRoom.location} onChange={handleNewChange} placeholder="Location" className="border px-2 py-1" />
          <input name="description" value={newRoom.description} onChange={handleNewChange} placeholder="Description" className="border px-2 py-1" />
          <input name="capacity" value={newRoom.capacity} type="number" onChange={handleNewChange} placeholder="Capacity" className="border px-2 py-1" />
        </div>
        <button onClick={handleAddRoom} className="mt-2 bg-green-600 text-white px-4 py-2 rounded">Add Room</button>
      </div>

      {/* Room List Editor */}
      <table className="w-full rounded-lg text-sm text-left">
        <thead>
          <tr className="bg-[#D6E5E3]">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Building</th>
            <th className="px-4 py-2">Location</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Capacity</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room._id} className="border-b bg-[#E8F1F2]">
              {editingRoomId === room._id ? (
                <>
                  <td className="px-4 py-2"><input name="name" value={formData.name} onChange={handleChange} className="w-full" /></td>
                  <td className="px-4 py-2"><input name="building" value={formData.building} onChange={handleChange} className="w-full" /></td>
                  <td className="px-4 py-2"><input name="location" value={formData.location} onChange={handleChange} className="w-full" /></td>
                  <td className="px-4 py-2"><input name="description" value={formData.description} onChange={handleChange} className="w-full" /></td>
                  <td className="px-4 py-2"><input name="capacity" type="number" value={formData.capacity} onChange={handleChange} className="w-full" /></td>
                  <td className="px-4 py-2 space-x-2">
                    <button onClick={handleSave} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                    <button onClick={handleCancel} className="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-2">{room.name}</td>
                  <td className="px-4 py-2">{room.building}</td>
                  <td className="px-4 py-2">{room.location}</td>
                  <td className="px-4 py-2">{room.description}</td>
                  <td className="px-4 py-2">{room.capacity}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => handleEditClick(room)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomListEditor;
