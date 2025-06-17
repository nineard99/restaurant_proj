import React, { useState } from "react";
import { motion } from "framer-motion";
import { Table } from "@/types/table";
import FormTable from "./FormTable";

interface TableListProps {
  tableList: Array<Table>;
  restaurantId: string;
  onChange: () => void;
}

export default function TableList({
  tableList,
  restaurantId,
  onChange,
}: TableListProps) {
//   const [tables, setTables] = useState<Table[]>(tableList);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [occupancyInput, setOccupancyInput] = useState<number | "">("");

  const handleOpenPopup = (table: Table) => {
    setSelectedTable(table);
    setOccupancyInput(table.currentOccupancy ?? "");
  };

  const handleSave = () => {
    if (!selectedTable) return;

    setSelectedTable(null);
    setOccupancyInput("");
    onChange();
  };

  const handleClose = () => {
    setSelectedTable(null);
    setOccupancyInput("");
  };

  // Mock QR code image (replace with actual QR generator later)
  const QRCodeMock = () => (
    <div className="w-40 h-40 bg-gray-200 flex justify-center items-center rounded-md mx-auto mb-4">
      <span className="text-gray-500">QR Code</span>
    </div>
  );

  return (
    <>
      <motion.section
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
              <span className="text-3xl">🪑</span>
              <span>โต๊ะลูกค้า</span>
            </h2>
          </div>

          <div className="space-y-4 mb-6">
            {tableList.map((table, index) => (
              <motion.div
                key={table.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 1.2 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-300 transition-all duration-300 cursor-pointer"
                onClick={() => handleOpenPopup(table)}
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{
                      backgroundColor: table.isOccupied
                        ? ["#10b981", "#06d6a0", "#10b981"]
                        : ["#ef4444", "#f87171", "#ef4444"],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 rounded-full"
                  />
                  <span className="font-medium text-gray-900">{table.name}</span>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    table.isOccupied
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}
                >
                  {table.isOccupied ? "Active" : "InActive"}
                </div>
              </motion.div>
            ))}
          </div>

          <FormTable restaurantId={restaurantId} addSuccess={onChange} />
        </div>
      </motion.section>

      {/* Popup */}
      {selectedTable && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
          onClick={handleClose}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg w-80 max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ถ้าโต๊ะ active ให้โชว์รายละเอียดและ QR code */}
            {selectedTable.isOccupied ? (
              <>
                <h3 className="text-lg font-bold mb-2">รายละเอียดโต๊ะ {selectedTable.name}</h3>
                <QRCodeMock />
                <p className="mb-2">
                  จำนวนคน:{" "}
                  {selectedTable.currentOccupancy !== undefined
                    ? selectedTable.currentOccupancy
                    : "ไม่ได้ระบุ"}
                </p>
                <button
                  onClick={() => alert("เช็คบิล mock")}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  เช็คบิล
                </button>
                <button
                  onClick={handleClose}
                  className="mt-3 w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
                >
                  ปิด
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-4">ตั้งค่าโต๊ะ {selectedTable.name}</h3>

                <div className="mb-4">
                  <label className="block mb-1 font-semibold">ตั้งโต๊ะเป็น Active</label>
                  <input
                    type="checkbox"
                    checked={selectedTable.isOccupied}
                    onChange={(e) => {
                      setSelectedTable({
                        ...selectedTable,
                        isOccupied: e.target.checked,
                      });
                      if (!e.target.checked) setOccupancyInput("");
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-semibold">จำนวนคน (ถ้ามี)</label>
                  <input
                    type="number"
                    min={1}
                    value={occupancyInput}
                    onChange={(e) =>
                      setOccupancyInput(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    disabled={!selectedTable.isOccupied}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="ไม่ใส่ก็ได้"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                  >
                    บันทึก
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
