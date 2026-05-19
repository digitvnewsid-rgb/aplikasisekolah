import React, { useState } from 'react';
import { Camera, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useStore } from '../../lib/store';
import { ScanResultStatus } from '../../types/database';

interface QRScannerProps {
  mode: string;
  scheduleId?: string;
}

export const QRScanner: React.FC<QRScannerProps> = ({ mode, scheduleId }) => {
  const { scanQRCode, qrCodes, schedules } = useStore();
  const [tokenInput, setTokenInput] = useState('');
  const [scanResult, setScanResult] = useState<{ status: ScanResultStatus; message: string } | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  // Auto-fill helper untuk testing cepat
  const sampleTokens = qrCodes.map(q => ({ token: q.qr_token, name: q.owner_name, type: q.owner_type }));

  const handleScan = (tokenToScan: string) => {
    if (!tokenToScan) return;
    setIsScanning(false);
    const result = scanQRCode(tokenToScan, mode, scheduleId);
    setScanResult({ status: result.status, message: result.message });
    setTokenInput('');
  };

  const resetScanner = () => {
    setScanResult(null);
    setTokenInput('');
    setIsScanning(true);
  };

  const activeSchedule = schedules.find(s => s.id === scheduleId);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Kamera Scanner QR</h3>
          <p className="text-xs text-gray-500 mt-1">Mode aktif: <span className="font-semibold text-blue-600">{mode}</span></p>
        </div>
        <button
          onClick={resetScanner}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Scanner</span>
        </button>
      </div>

      {mode === 'Absensi Siswa Per Jadwal Pelajaran' && (
        <div className="mb-6 bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-sm text-blue-900">
          <p className="font-semibold mb-1">Informasi Jadwal Pelajaran Aktif:</p>
          {activeSchedule ? (
            <div className="grid grid-cols-2 gap-2 text-xs mt-2 bg-white p-3 rounded-lg border border-blue-100">
              <div><span className="text-gray-500">Mata Pelajaran:</span> <span className="font-bold">{activeSchedule.subject?.name}</span></div>
              <div><span className="text-gray-500">Kelas:</span> <span className="font-bold">{activeSchedule.class_room?.name}</span></div>
              <div><span className="text-gray-500">Guru:</span> <span className="font-bold">{activeSchedule.teacher?.profile?.full_name}</span></div>
              <div><span className="text-gray-500">Ruang/Waktu:</span> <span className="font-bold">{activeSchedule.room} ({activeSchedule.start_time} - {activeSchedule.end_time})</span></div>
            </div>
          ) : (
            <p className="text-red-600 font-medium text-xs mt-1">⚠️ Pilih jadwal pelajaran terlebih dahulu sebelum melakukan scan siswa.</p>
          )}
        </div>
      )}

      {/* Simulasi Kamera Layar */}
      <div className="relative w-full h-72 bg-gray-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center border-4 border-gray-800 shadow-inner mb-6">
        {isScanning ? (
          <>
            <div className="absolute inset-0 bg-blue-500/10 animate-pulse pointer-events-none" />
            <div className="absolute w-full h-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] animate-[bounce_2s_infinite] pointer-events-none" />
            <Camera className="w-16 h-16 text-gray-600 animate-bounce mb-3 pointer-events-none" />
            <p className="text-gray-400 text-sm font-medium z-10">Kamera Aktif — Arahkan QR Code ke Kotak Pemindai</p>
            <div className="absolute w-48 h-48 border-2 border-dashed border-blue-400/50 rounded-2xl pointer-events-none" />
          </>
        ) : (
          <div className="text-center p-6 z-10">
            {scanResult?.status === 'success' || scanResult?.status === 'already_checked_out' ? (
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3 animate-scale" />
            ) : scanResult?.status === 'already_checked_in' || scanResult?.status === 'duplicate_scan' ? (
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-3 animate-scale" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-3 animate-scale" />
            )}
            <h4 className="text-white font-bold text-lg mb-1">Hasil Pemindaian</h4>
            <p className={`text-sm px-4 py-2 rounded-xl inline-block mt-2 font-medium ${
              scanResult?.status === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
              scanResult?.status === 'already_checked_in' || scanResult?.status === 'duplicate_scan' || scanResult?.status === 'already_checked_out' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
              'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {scanResult?.message}
            </p>
          </div>
        )}
      </div>

      {/* Input Simulator Manual & Quick Test Buttons */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
            Simulasi Input Token Manual
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Masukkan token (misal: QR-TEACHER-2026-X9K2L8M4)"
              value={tokenInput}
              onChange={e => setTokenInput(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleScan(tokenInput)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors shadow-sm"
            >
              Scan Token
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-2.5 uppercase tracking-wider">
            Pilih Token Contoh untuk Uji Coba Cepat:
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleTokens.map((st, idx) => (
              <button
                key={idx}
                onClick={() => handleScan(st.token)}
                className="px-3 py-1.5 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-all text-left flex items-center space-x-2"
              >
                <span className={`w-2 h-2 rounded-full ${
                  st.type === 'teacher' ? 'bg-indigo-500' : st.type === 'staff' ? 'bg-emerald-500' : 'bg-blue-500'
                }`} />
                <span>{st.name} ({st.type})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
