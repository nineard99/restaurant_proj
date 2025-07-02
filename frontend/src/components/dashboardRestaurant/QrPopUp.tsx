import React from "react";
import { motion } from "framer-motion";

interface Props {
  tableId: string;
  onClose: () => void;
}

const QRPopup: React.FC<Props> = ({ tableId, onClose }) => {
  const qrData = `https://example.com/scan?table=${tableId}`;
  const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=150x150`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-xl p-6 shadow-lg text-center space-y-4"
      >
        <h3 className="text-lg font-semibold">QR สำหรับโต๊ะ {tableId}</h3>
        <img
          src={qrImgUrl}
          alt="QR Code"
          className="mx-auto w-40 h-40 border"
        />
        <p className="text-sm text-gray-600">{qrData}</p>
        <button onClick={onClose}>ปิด</button>
      </motion.div>
    </div>
  );
};

export default QRPopup;
