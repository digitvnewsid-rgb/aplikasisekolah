import React from 'react';
import {
  LayoutDashboard, Users, UserCheck, GraduationCap, School, BookOpen, Calendar,
  QrCode, Scan, ClipboardCheck, DollarSign, CreditCard, FileText, Bell, BarChart3,
  Settings, UserCircle, LogOut, ArrowRightLeft
} from 'lucide-react';
import { useStore } from '../../lib/store';

interface RoleBasedSidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export const RoleBasedSidebar: React.FC<RoleBasedSidebarProps> = ({ currentTab, onTabChange, onLogout }) => {
  const { currentUser, setCurrentUser, profiles } = useStore();
  const role = currentUser.role;

  // Daftar Menu Berdasarkan Role
  const getNavItems = () => {
    if (role === 'super_admin' || role === 'admin' || role === 'staff') {
      return [
        { label: 'Dashboard Utama', tab: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Data Guru', tab: '/admin/teachers', icon: UserCheck },
        { label: 'Data Staf', tab: '/admin/staff', icon: Users },
        { label: 'Data Murid', tab: '/admin/students', icon: GraduationCap },
        { label: 'Data Orang Tua', tab: '/admin/parents', icon: UserCircle },
        { label: 'Kelola Kelas', tab: '/admin/classes', icon: School },
        { label: 'Mata Pelajaran', tab: '/admin/subjects', icon: BookOpen },
        { label: 'Jadwal Pelajaran', tab: '/admin/schedules', icon: Calendar },
        { label: 'Pusat QR Code', tab: '/admin/qr-codes', icon: QrCode },
        { label: 'Scan Absensi QR', tab: '/admin/attendance/scan', icon: Scan },
        { label: 'Laporan Kehadiran', tab: '/admin/attendance/reports', icon: ClipboardCheck },
        { label: 'Gaji Guru (Payroll)', tab: '/admin/payroll/teachers', icon: DollarSign },
        { label: 'Finance Sekolah', tab: '/admin/finance', icon: BarChart3 },
        { label: 'Tagihan Murid', tab: '/admin/student-bills', icon: FileText },
        { label: 'Verifikasi Pembayaran', tab: '/admin/student-payments', icon: CreditCard },
        { label: 'Pengumuman & WA', tab: '/admin/announcements', icon: Bell },
        { label: 'Laporan & Audit', tab: '/admin/reports', icon: BarChart3 },
        { label: 'Setup Sistem & Docs', tab: '/admin/settings', icon: Settings },
      ];
    } else if (role === 'teacher') {
      return [
        { label: 'Dashboard Guru', tab: '/teacher/dashboard', icon: LayoutDashboard },
        { label: 'Riwayat Absensi Saya', tab: '/teacher/attendance', icon: ClipboardCheck },
        { label: 'Jadwal Mengajar', tab: '/teacher/schedules', icon: Calendar },
        { label: 'Scan Absensi Kelas', tab: '/teacher/class-attendance', icon: Scan },
        { label: 'Kelola Tugas Murid', tab: '/teacher/assignments', icon: BookOpen },
        { label: 'Slip Gaji Saya', tab: '/teacher/payroll', icon: DollarSign },
        { label: 'Pengumuman Sekolah', tab: '/teacher/announcements', icon: Bell },
      ];
    } else if (role === 'student') {
      return [
        { label: 'Dashboard Murid', tab: '/student/dashboard', icon: LayoutDashboard },
        { label: 'Data Absensi Saya', tab: '/student/attendance', icon: ClipboardCheck },
        { label: 'Jadwal Pelajaran', tab: '/student/schedules', icon: Calendar },
        { label: 'Mata Pelajaran', tab: '/student/subjects', icon: BookOpen },
        { label: 'Tugas & Submission', tab: '/student/assignments', icon: FileText },
        { label: 'Tagihan & Pembayaran', tab: '/student/payments', icon: CreditCard },
        { label: 'Pengumuman Sekolah', tab: '/student/announcements', icon: Bell },
      ];
    } else if (role === 'parent') {
      return [
        { label: 'Dashboard Ortu', tab: '/parent/dashboard', icon: LayoutDashboard },
        { label: 'Data Anak Saya', tab: '/parent/children', icon: Users },
        { label: 'Absensi Anak', tab: '/parent/attendance', icon: ClipboardCheck },
        { label: 'Tugas Anak', tab: '/parent/assignments', icon: BookOpen },
        { label: 'Tagihan & Pembayaran', tab: '/parent/payments', icon: CreditCard },
        { label: 'Pengumuman & Notif WA', tab: '/parent/announcements', icon: Bell },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  // Handler Ganti Akun Simulasi
  const handleSwitchUser = (selectedRoleId: string) => {
    const prof = profiles.find(p => p.id === selectedRoleId);
    if (prof) {
      setCurrentUser(prof);
      // Auto redirect ke dashboard default masing-masing
      if (prof.role === 'teacher') onTabChange('/teacher/dashboard');
      else if (prof.role === 'student') onTabChange('/student/dashboard');
      else if (prof.role === 'parent') onTabChange('/parent/dashboard');
      else onTabChange('/admin/dashboard');
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col justify-between border-r border-slate-800 shrink-0 font-sans select-none print:hidden">
      {/* Header Aplikasi */}
      <div>
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-md">
            SMS
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight leading-none">School Management</h1>
            <p className="text-[11px] text-slate-400 mt-1">Sistem Terintegrasi</p>
          </div>
        </div>

        {/* Daftar Navigasi Utama */}
        <div className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Menu Navigasi ({role.toUpperCase()})
          </p>
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = currentTab === item.tab;
            return (
              <button
                key={idx}
                onClick={() => onTabChange(item.tab)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bagian Bawah: Switcher Role & Info Pengguna */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="mb-4 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <ArrowRightLeft className="w-3 h-3 text-blue-400" />
              <span>Simulasi Ganti Role</span>
            </span>
          </div>
          <select
            value={currentUser.id}
            onChange={e => handleSwitchUser(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {profiles.map(p => (
              <option key={p.id} value={p.id}>
                {p.full_name} ({p.role})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between pt-2 px-1">
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center font-bold text-xs text-blue-200 shrink-0 uppercase">
              {currentUser.full_name.charAt(0)}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{currentUser.full_name}</p>
              <p className="text-[10px] text-blue-400 font-medium capitalize">{currentUser.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Keluar"
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
