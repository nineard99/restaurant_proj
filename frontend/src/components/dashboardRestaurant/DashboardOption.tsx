"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { editRestaurantName } from "@/services/restaurantService";

interface DashboardOptionsProps {
  restaurantId:string;
  restaurantName: string;
  onUpdateName: (newName: string) => void;
  onDelete: () => void;
}

export default function DashboardOptions({
  restaurantId,
  restaurantName,
  onUpdateName,
  onDelete,
}: DashboardOptionsProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nameInput, setNameInput] = useState(restaurantName);

  // ปิด dropdown เวลากด modal
  const openEdit = async() => {
    setNameInput(restaurantName);
    setShowDropdown(false);
    setShowEditModal(true);
  };
  const openDelete = () => {
    setShowDropdown(false);
    setShowDeleteModal(true);
  };

  return (
    <>
      {/* Dropdown Button */}
      <div className="relative inline-block text-left">
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200"
          aria-haspopup="true"
          aria-expanded={showDropdown}
        >
          ⋯
        </button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 z-20 mt-2 w-52 origin-top-right rounded-xl bg-white shadow-xl border border-gray-200"
            >
              <button
                onClick={openEdit}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                ✏️ Edit restaurant name
              </button>
              <button
                onClick={openDelete}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
              >
                🗑️ Delete restaurant
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold mb-4">
                Edit Restaurant Name
              </h2>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => {
                    onUpdateName(nameInput.trim());
                    setShowEditModal(false);
                  }}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold mb-4 text-red-600">
                Confirm Deletion
              </h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this restaurant? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  onClick={() => {
                    onDelete();
                    setShowDeleteModal(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
