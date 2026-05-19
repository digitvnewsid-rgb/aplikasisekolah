import React from 'react';
import { QRCodeCard } from './QRCodeCard';

interface PrintItem {
  id: string;
  ownerType: 'teacher' | 'staff' | 'student';
  ownerName: string;
  ownerCode: string;
  ownerDetails: string;
  qrToken: string;
}

interface QRCodePrintLayoutProps {
  items: PrintItem[];
  title?: string;
  onBack: () => void;
}

export const QRCodePrintLayout: React.FC<QRCodePrintLayoutProps> = ({ items, title = 'Cetak QR Code', onBack }) => {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      {/* Tombol Kontrol Cetak (Akan disembunyikan saat mode cetak browser) */}
      <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-200 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">Total {items.length} kartu siap dicetak</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Kembali
          </button>
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
          >
            Cetak Sekarang (Ctrl+P)
          </button>
        </div>
      </div>

      {/* Grid Kartu untuk Cetak */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 print:grid-cols-3 print:gap-4 print:p-0 print:bg-white">
        {items.map((item) => (
          <div key={item.id} className="flex justify-center print:break-inside-avoid">
            <QRCodeCard
              ownerType={item.ownerType}
              ownerName={item.ownerName}
              ownerCode={item.ownerCode}
              ownerDetails={item.ownerDetails}
              qrToken={item.qrToken}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
