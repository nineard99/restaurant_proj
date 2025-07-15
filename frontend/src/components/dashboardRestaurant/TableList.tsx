import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Table } from "@/types/table";
import FormTable from "./FormTable";
import { updateActiveTable } from "@/services/tableService";
import Link from "next/link";
import QRCode from "react-qr-code";

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
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [occupancyInput, setOccupancyInput] = useState<number | "">("");
  const [viewMode, setViewMode] = useState<"edit" | "qr" | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleOpenPopup = (table: Table) => {
    setSelectedTable(table);
    setOccupancyInput(table.currentOccupancy ?? "");
    setViewMode("edit");
  };

  const handleOpenQr = (table: Table) => {
    setSelectedTable(table);
    setViewMode("qr");
  };

  const handleSave = async () => {
    if (!selectedTable) return;

    await updateActiveTable({
      restaurantId,
      tableId: selectedTable.id,
      isActive: selectedTable.isActive,
      currentOccupancy: occupancyInput === "" ? undefined : Number(occupancyInput),
    });

    setSelectedTable(null);
    setOccupancyInput("");
    setViewMode(null);
    onChange();
  };

  const closeTable = async () => {
    if (!selectedTable) return;

    await updateActiveTable({
      restaurantId,
      tableId: selectedTable.id,
      isActive: false,
      currentOccupancy: undefined,
    });

    setSelectedTable(null);
    setOccupancyInput("");
    setViewMode(null);
    onChange();
  };

  const handleClose = () => {
    setSelectedTable(null);
    setOccupancyInput("");
    setViewMode(null);
  };

  // QR Code Actions
  const handleCopyQR = async () => {
    if (!selectedTable) return;
    
    const qrUrl = `${window.location.origin}/order/${restaurantId}/${selectedTable.sessionId}`;
    try {
      await navigator.clipboard.writeText(qrUrl);
      alert("Copy Link!");
    } catch (err) {
    }
  };

  const handlePrintQR = () => {
    if (!selectedTable || !qrRef.current) return;


   
  };

  const handleDownloadQR = () => {
    if (!selectedTable) return;

  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 max-h-[80vh] flex flex-col overflow-hidden"
      >
        {/* หัวข้อ Sticky Top */}
        <div className="p-6 border-b bg-white  top-0 ">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
              <span>Table</span>
            </h2>
          </div>
        </div>

        {/* Scrollable List */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          {tableList.map((table, index) => (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 1.2 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-300 transition-all duration-300 cursor-pointer"
              onClick={() => {
                if (table.isActive) {
                  handleOpenQr(table);
                } else {
                  handleOpenPopup(table);
                }
              }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{
                    backgroundColor: table.isActive
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
                  table.isActive
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {table.isActive ? "Active" : "InActive"}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sticky Bottom สำหรับปุ่มหรือฟอร์ม */}
        <div className="p-6 border-t bg-white  bottom-0 ">
          <FormTable restaurantId={restaurantId} addSuccess={onChange} />
        </div>
      </motion.section>

      {selectedTable && viewMode && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
          onClick={handleClose}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg w-96 max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {viewMode === "qr" ? (
              <>
                <h3 className="text-lg font-bold mb-4 text-center">
                  Table {selectedTable.name}
                </h3>
                <div ref={qrRef} className="w-40 h-40 bg-gray-200 flex justify-center items-center rounded-md mx-auto mb-4">
                  <QRCode
                    value={`${window.location.origin}/order/${restaurantId}/${selectedTable.sessionId}`}
                    size={160}
                  />
                </div>

                {/* QR Code Action Buttons */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    onClick={handleCopyQR}
                    className="bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition flex items-center justify-center"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={handlePrintQR}
                    className="bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600 transition flex items-center justify-center"
                  >
                    🖨️ Print
                  </button>
                  <button
                    onClick={handleDownloadQR}
                    className="bg-purple-500 text-white py-2 px-3 rounded text-sm hover:bg-purple-600 transition flex items-center justify-center"
                  >
                    💾 Download
                  </button>
                </div>

                <Link href={`/order/${restaurantId}/${selectedTable.sessionId}`}>
                  <p className="text-blue-500 underline cursor-pointer text-center mb-2">
                    {selectedTable.sessionId}
                  </p>
                </Link>
                <p className="mb-4 text-center">
                  People:{" "}
                  {selectedTable.currentOccupancy !== undefined
                    ? selectedTable.currentOccupancy
                    : "not specified"}
                </p>
                
                <button
                  onClick={closeTable}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-3"
                >
                  Check Bill
                </button>
                <button
                  onClick={handleClose}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-4">ตั้งค่า {selectedTable.name}</h3>

                <div className="mb-4">
                  <label className="block mb-1 font-semibold">
                    Set Status ( Active / InActive )
                  </label>
                  <input
                    type="checkbox"
                    checked={selectedTable.isActive}
                    onChange={(e) => {
                      setSelectedTable({
                        ...selectedTable,
                        isActive: e.target.checked,
                      });
                      if (!e.target.checked) setOccupancyInput("");
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-semibold">จำนวนคน (Optional)</label>
                  <input
                    type="number"
                    min={1}
                    value={occupancyInput}
                    onChange={(e) =>
                      setOccupancyInput(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    disabled={!selectedTable.isActive}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Optional"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                  >
                    Save
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