import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeCardProps {
  ownerType: 'teacher' | 'staff' | 'student';
  ownerName: string;
  ownerCode: string;
  ownerDetails: string;
  qrToken: string;
  schoolName?: string;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({
  ownerType,
  ownerName,
  ownerCode,
  ownerDetails,
  qrToken,
  schoolName = 'SMA KEBANGSAAN MODERN',
}) => {
  let headerBg = 'bg-blue-600';
  let codeLabel = 'NIS';
  let detailLabel = 'Kelas';

  if (ownerType === 'teacher') {
    headerBg = 'bg-indigo-600';
    codeLabel = 'Kode Guru';
    detailLabel = 'Jabatan';
  } else if (ownerType === 'staff') {
    headerBg = 'bg-emerald-600';
    codeLabel = 'Kode Staf';
    detailLabel = 'Jabatan';
  }

  return (
    <div className="w-72 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col items-center p-0 text-center font-sans">
      <div className={`w-full py-3 ${headerBg} text-white font-bold text-sm tracking-wider uppercase`}>
        {schoolName}
      </div>
      
      <div className="py-6 px-4 flex flex-col items-center bg-gradient-to-b from-gray-50 to-white w-full">
        <div className="bg-white p-3 rounded-xl shadow-inner border border-gray-100 mb-4 inline-block">
          <QRCodeSVG value={qrToken} size={130} level="H" includeMargin={false} />
        </div>
        <p className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded mb-4">
          {qrToken}
        </p>

        <div className="w-full text-left space-y-1.5 px-2 border-t border-gray-100 pt-4">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-medium">Nama:</span>
            <span className="font-bold text-gray-800">{ownerName}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-medium">{codeLabel}:</span>
            <span className="font-bold text-gray-800">{ownerCode}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-medium">{detailLabel}:</span>
            <span className="font-bold text-gray-800">{ownerDetails}</span>
          </div>
        </div>
      </div>

      <div className="w-full py-2 bg-gray-100 text-[10px] text-gray-500 font-medium border-t border-gray-200">
        Gunakan kartu ini untuk absensi.
      </div>
    </div>
  );
};
