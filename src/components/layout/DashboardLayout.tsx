import React, { useState } from 'react';
import { RoleBasedSidebar } from './RoleBasedSidebar';
import { ShieldCheck, MessageSquareCheck, AlertCircle } from 'lucide-react';
import { useStore } from '../../lib/store';

interface DashboardLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ currentTab, onTabChange, onLogout, children }) => {
  const { currentUser, whatsappLogs, announcements } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const importantAnns = announcements.filter(a => a.is_important);

  return (
    <div className="flex min-h-screen bg-slate-50/60 font-sans">
      {/* Sidebar Kiri */}
      <RoleBasedSidebar currentTab={currentTab} onTabChange={onTabChange} onLogout={onLogout} />

      {/* Konten Utama Kanan */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-sm print:hidden">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-600">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Supabase RLS & Edge Functions Active</span>
            </div>
            {importantAnns.length > 0 && (
              <div className="flex items-center space-x-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-xs text-amber-800 animate-pulse">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="font-semibold">{importantAnns.length} Pengumuman Penting</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-6">
            {/* Tombol Notifikasi WhatsApp & Sistem */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-xl transition-colors relative"
                title="Log Notifikasi WhatsApp"
              >
                <MessageSquareCheck className="w-5 h-5" />
                {whatsappLogs.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-ping" />
                )}
              </button>

              {/* Dropdown Notifikasi WA */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-xl border border-gray-200 py-4 z-50 animate-fadeIn">
                  <div className="px-6 pb-3 border-b border-gray-100 flex justify-between items-center">
                    <h4 className="font-bold text-sm text-gray-800">Log WhatsApp Gateway</h4>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                      {whatsappLogs.length} Terkirim
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                    {whatsappLogs.length === 0 ? (
                      <p className="p-6 text-center text-xs text-gray-400">Belum ada notifikasi WhatsApp terkirim.</p>
                    ) : (
                      whatsappLogs.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-gray-50/80 transition-colors text-xs">
                          <div className="flex justify-between font-semibold text-gray-800 mb-1">
                            <span>{log.recipient_phone}</span>
                            <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                              {log.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 line-clamp-2 mt-1">{log.message}</p>
                          <span className="text-[10px] text-gray-400 block mt-2">
                            {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-6 pt-3 border-t border-gray-100 text-center">
                    <button
                      onClick={() => { setShowNotifications(false); onTabChange('/admin/announcements'); }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Lihat Semua Pengumuman & WA
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Info Pengguna Topbar */}
            <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-sm uppercase">
                {currentUser.full_name.charAt(0)}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-bold text-gray-800 leading-tight">{currentUser.full_name}</p>
                <p className="text-[10px] text-blue-600 font-semibold capitalize mt-0.5">{currentUser.role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Area Konten Utama */}
        <main className="flex-1 p-8 print:p-0 print:bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};
