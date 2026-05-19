import React, { createContext, useContext, useState } from 'react';
import {
  Profile, Teacher, Staff, ClassRoom, Student, Parent, StudentParent,
  Subject, Schedule, TeacherAttendance, StaffAttendance, StudentDailyAttendance,
  StudentScheduleAttendance, QRCodeData, QRScanLog, Assignment, AssignmentSubmission,
  TeacherPayroll, FinanceTransaction, StudentBill, StudentPayment, Announcement,
  WhatsAppNotification, ScanResultStatus
} from '../types/database';

interface StoreContextType {
  currentUser: Profile;
  setCurrentUser: (profile: Profile) => void;
  profiles: Profile[];
  teachers: Teacher[];
  staff: Staff[];
  classes: ClassRoom[];
  students: Student[];
  parents: Parent[];
  studentParents: StudentParent[];
  subjects: Subject[];
  schedules: Schedule[];
  qrCodes: QRCodeData[];
  teacherAttendance: TeacherAttendance[];
  staffAttendance: StaffAttendance[];
  studentDailyAttendance: StudentDailyAttendance[];
  studentScheduleAttendance: StudentScheduleAttendance[];
  qrScanLogs: QRScanLog[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  payrolls: TeacherPayroll[];
  financeTransactions: FinanceTransaction[];
  studentBills: StudentBill[];
  studentPayments: StudentPayment[];
  announcements: Announcement[];
  whatsappLogs: WhatsAppNotification[];
  // Actions
  addTeacher: (teacher: Omit<Teacher, 'id' | 'created_at' | 'profile_id'>, profile: Omit<Profile, 'id' | 'created_at'>) => void;
  addStaff: (staffItem: Omit<Staff, 'id' | 'created_at' | 'profile_id'>, profile: Omit<Profile, 'id' | 'created_at'>) => void;
  addStudent: (studentItem: Omit<Student, 'id' | 'created_at' | 'profile_id'>, profile: Omit<Profile, 'id' | 'created_at'>) => void;
  addClass: (classItem: Omit<ClassRoom, 'id' | 'created_at'>) => void;
  addSubject: (subjectItem: Omit<Subject, 'id' | 'created_at'>) => void;
  addSchedule: (scheduleItem: Omit<Schedule, 'id' | 'created_at'>) => void;
  addAssignment: (assignmentItem: Omit<Assignment, 'id' | 'created_at'>) => void;
  addSubmission: (submissionItem: Omit<AssignmentSubmission, 'id' | 'created_at'>) => void;
  gradeSubmission: (id: string, grade: number, feedback: string) => void;
  addPayroll: (payrollItem: Omit<TeacherPayroll, 'id' | 'created_at'>) => void;
  updatePayrollStatus: (id: string, status: 'pending' | 'paid') => void;
  addFinanceTransaction: (transaction: Omit<FinanceTransaction, 'id' | 'created_at'>) => void;
  addStudentBill: (bill: Omit<StudentBill, 'id' | 'created_at'>) => void;
  addStudentPayment: (payment: Omit<StudentPayment, 'id' | 'created_at'>) => void;
  verifyStudentPayment: (paymentId: string, status: 'verified' | 'rejected') => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'created_at'>) => void;
  generateQRCode: (ownerType: 'teacher' | 'staff' | 'student', ownerId: string, token?: string) => QRCodeData;
  revokeQRCode: (id: string) => void;
  scanQRCode: (token: string, mode: string, scheduleId?: string) => { status: ScanResultStatus; message: string; log: QRScanLog };
}

// Initial Seed Data
const initialProfiles: Profile[] = [
  { id: 'p-super', full_name: 'Budi Santoso (Super Admin)', role: 'super_admin', is_active: true, created_at: '2026-01-01T10:00:00Z', phone: '081234567890' },
  { id: 'p-admin', full_name: 'Siti Rahma (Admin Utama)', role: 'admin', is_active: true, created_at: '2026-01-01T10:00:00Z', phone: '081234567891' },
  { id: 'p-staff', full_name: 'Agus Pratama (Staf Tata Usaha)', role: 'staff', is_active: true, created_at: '2026-01-01T10:00:00Z', phone: '081234567892' },
  { id: 'p-teacher1', full_name: 'Ahmad Dahlan, S.Pd (Guru Matpel)', role: 'teacher', is_active: true, created_at: '2026-01-01T10:00:00Z', phone: '081234567893' },
  { id: 'p-teacher2', full_name: 'Dewi Lestari, M.Si (Guru Matpel)', role: 'teacher', is_active: true, created_at: '2026-01-01T10:00:00Z', phone: '081234567894' },
  { id: 'p-student1', full_name: 'Rizky Kurniawan (Siswa X-IPA 1)', role: 'student', is_active: true, created_at: '2026-01-01T10:00:00Z', phone: '081234567895' },
  { id: 'p-student2', full_name: 'Putri Maharani (Siswa X-IPA 1)', role: 'student', is_active: true, created_at: '2026-01-01T10:00:00Z', phone: '081234567896' },
  { id: 'p-parent1', full_name: 'Hendra Wijaya (Ortu Rizky)', role: 'parent', is_active: true, created_at: '2026-01-01T10:00:00Z', phone: '081234567897' },
];

const initialTeachers: Teacher[] = [
  { id: 't-1', profile_id: 'p-teacher1', teacher_code: 'GUR-001', address: 'Jl. Merdeka No. 10', phone: '081234567893', salary_type: 'monthly', base_salary: 4500000, is_active: true, created_at: '2026-01-01T10:00:00Z' },
  { id: 't-2', profile_id: 'p-teacher2', teacher_code: 'GUR-002', address: 'Jl. Sudirman No. 45', phone: '081234567894', salary_type: 'monthly', base_salary: 4800000, is_active: true, created_at: '2026-01-01T10:00:00Z' },
];

const initialStaff: Staff[] = [
  { id: 'st-1', profile_id: 'p-staff', staff_code: 'STF-001', position: 'Kepala Tata Usaha', address: 'Jl. Veteran No. 12', phone: '081234567892', base_salary: 3800000, is_active: true, created_at: '2026-01-01T10:00:00Z' },
];

const initialClasses: ClassRoom[] = [
  { id: 'c-1', name: 'X-IPA 1', level: '10', homeroom_teacher_id: 't-1', academic_year: '2025/2026', is_active: true, created_at: '2026-01-01T10:00:00Z' },
  { id: 'c-2', name: 'XI-IPS 2', level: '11', homeroom_teacher_id: 't-2', academic_year: '2025/2026', is_active: true, created_at: '2026-01-01T10:00:00Z' },
];

const initialStudents: Student[] = [
  { id: 's-1', profile_id: 'p-student1', student_code: 'NIS-2026001', class_id: 'c-1', parent_name: 'Hendra Wijaya', parent_phone: '081234567897', address: 'Jl. Mawar No. 3', is_active: true, created_at: '2026-01-01T10:00:00Z' },
  { id: 's-2', profile_id: 'p-student2', student_code: 'NIS-2026002', class_id: 'c-1', parent_name: 'Bambang Pamungkas', parent_phone: '081234567898', address: 'Jl. Melati No. 7', is_active: true, created_at: '2026-01-01T10:00:00Z' },
];

const initialParents: Parent[] = [
  { id: 'pr-1', profile_id: 'p-parent1', full_name: 'Hendra Wijaya', phone: '081234567897', address: 'Jl. Mawar No. 3', created_at: '2026-01-01T10:00:00Z' },
];

const initialStudentParents: StudentParent[] = [
  { id: 'sp-1', student_id: 's-1', parent_id: 'pr-1', relationship: 'Ayah', created_at: '2026-01-01T10:00:00Z' },
];

const initialSubjects: Subject[] = [
  { id: 'sub-1', name: 'Matematika Lanjut', code: 'MAT-101', description: 'Aljabar, Kalkulus Dasar, dan Trigonometri', is_active: true, created_at: '2026-01-01T10:00:00Z' },
  { id: 'sub-2', name: 'Fisika Dasar', code: 'FIS-102', description: 'Mekanika, Termodinamika, dan Gelombang', is_active: true, created_at: '2026-01-01T10:00:00Z' },
  { id: 'sub-3', name: 'Bahasa Inggris', code: 'ENG-103', description: 'Grammar, Reading comprehension, dan Conversation', is_active: true, created_at: '2026-01-01T10:00:00Z' },
];

const initialSchedules: Schedule[] = [
  { id: 'sch-1', class_id: 'c-1', subject_id: 'sub-1', teacher_id: 't-1', day_of_week: 'Senin', start_time: '08:00', end_time: '09:30', room: 'Ruang 101', is_active: true, created_at: '2026-01-01T10:00:00Z' },
  { id: 'sch-2', class_id: 'c-1', subject_id: 'sub-2', teacher_id: 't-2', day_of_week: 'Senin', start_time: '09:45', end_time: '11:15', room: 'Lab Fisika', is_active: true, created_at: '2026-01-01T10:00:00Z' },
  { id: 'sch-3', class_id: 'c-2', subject_id: 'sub-3', teacher_id: 't-1', day_of_week: 'Selasa', start_time: '08:00', end_time: '09:30', room: 'Ruang 202', is_active: true, created_at: '2026-01-01T10:00:00Z' },
];

const initialQRCodes: QRCodeData[] = [
  { id: 'qr-1', owner_type: 'teacher', owner_id: 't-1', qr_token: 'QR-TEACHER-2026-X9K2L8M4', is_active: true, issued_at: '2026-01-01T10:00:00Z', created_at: '2026-01-01T10:00:00Z', owner_name: 'Ahmad Dahlan, S.Pd', owner_code: 'GUR-001', owner_details: 'Guru Matpel' },
  { id: 'qr-2', owner_type: 'teacher', owner_id: 't-2', qr_token: 'QR-TEACHER-2026-T7K2L9M1', is_active: true, issued_at: '2026-01-01T10:00:00Z', created_at: '2026-01-01T10:00:00Z', owner_name: 'Dewi Lestari, M.Si', owner_code: 'GUR-002', owner_details: 'Guru Matpel' },
  { id: 'qr-3', owner_type: 'staff', owner_id: 'st-1', qr_token: 'QR-STAFF-2026-A3N8V6B2', is_active: true, issued_at: '2026-01-01T10:00:00Z', created_at: '2026-01-01T10:00:00Z', owner_name: 'Agus Pratama', owner_code: 'STF-001', owner_details: 'Kepala Tata Usaha' },
  { id: 'qr-4', owner_type: 'student', owner_id: 's-1', qr_token: 'QR-STUDENT-2026-H7Q2P1Z9', is_active: true, issued_at: '2026-01-01T10:00:00Z', created_at: '2026-01-01T10:00:00Z', owner_name: 'Rizky Kurniawan', owner_code: 'NIS-2026001', owner_details: 'X-IPA 1' },
  { id: 'qr-5', owner_type: 'student', owner_id: 's-2', qr_token: 'QR-STUDENT-2026-S4Q9P2Z1', is_active: true, issued_at: '2026-01-01T10:00:00Z', created_at: '2026-01-01T10:00:00Z', owner_name: 'Putri Maharani', owner_code: 'NIS-2026002', owner_details: 'X-IPA 1' },
];

const initialAssignments: Assignment[] = [
  { id: 'ass-1', teacher_id: 't-1', class_id: 'c-1', subject_id: 'sub-1', title: 'Tugas 1: Persamaan Kuadrat & Aljabar', description: 'Kerjakan soal latihan halaman 45 nomor 1 sampai 10 beserta cara penyelesaiannya.', due_date: '2026-03-15T23:59:59Z', attachment_url: 'https://files.sekolah.edu/tugas/matematika-kd1.pdf', created_at: '2026-03-01T08:00:00Z' },
  { id: 'ass-2', teacher_id: 't-2', class_id: 'c-1', subject_id: 'sub-2', title: 'Laporan Praktikum Hukum Newton', description: 'Buat laporan hasil praktikum gerak jatuh bebas sesuai format standar laboratorium.', due_date: '2026-03-18T23:59:59Z', attachment_url: 'https://files.sekolah.edu/tugas/fisika-lab.pdf', created_at: '2026-03-02T09:00:00Z' },
];

const initialSubmissions: AssignmentSubmission[] = [
  { id: 'subm-1', assignment_id: 'ass-1', student_id: 's-1', submission_text: 'Berikut adalah jawaban untuk latihan soal halaman 45. Semua langkah telah dijabarkan dengan lengkap.', file_url: 'https://files.sekolah.edu/submissions/rizky-matematika.pdf', submitted_at: '2026-03-10T14:30:00Z', grade: 92, feedback: 'Pekerjaan sangat rapi dan langkah penyelesaian tepat. Pertahankan!', status: 'graded', created_at: '2026-03-10T14:30:00Z' },
];

const initialPayrolls: TeacherPayroll[] = [
  { id: 'pay-1', teacher_id: 't-1', month: 3, year: 2026, base_salary: 4500000, bonus: 500000, deduction: 0, allowance: 300000, additional_honor: 250000, total_salary: 5550000, status: 'paid', paid_at: '2026-03-01T09:00:00Z', note: 'Gaji bulan Maret 2026 beserta tunjangan wali kelas', created_at: '2026-03-01T09:00:00Z' },
  { id: 'pay-2', teacher_id: 't-2', month: 3, year: 2026, base_salary: 4800000, bonus: 400000, deduction: 50000, allowance: 300000, additional_honor: 0, total_salary: 5450000, status: 'pending', note: 'Gaji bulan Maret 2026', created_at: '2026-03-01T09:00:00Z' },
];

const initialFinance: FinanceTransaction[] = [
  { id: 'fin-1', type: 'income', category: 'SPP Bulanan', title: 'Pembayaran SPP Maret - Rizky Kurniawan', amount: 500000, transaction_date: '2026-03-02', payment_method: 'Transfer Bank', note: 'SPP Kelas X-IPA 1', created_by: 'p-admin', created_at: '2026-03-02T10:00:00Z' },
  { id: 'fin-2', type: 'income', category: 'Uang Gedung', title: 'Cicilan Gedung - Siswa Baru', amount: 2500000, transaction_date: '2026-03-03', payment_method: 'Tunai', note: 'Gelombang 1', created_by: 'p-staff', created_at: '2026-03-03T11:00:00Z' },
  { id: 'fin-3', type: 'expense', category: 'Operasional', title: 'Pembayaran Tagihan Listrik & Internet Sekolah', amount: 1800000, transaction_date: '2026-03-05', payment_method: 'Transfer Bank', note: 'Bulan Februari 2026', created_by: 'p-admin', created_at: '2026-03-05T09:00:00Z' },
  { id: 'fin-4', type: 'expense', category: 'Peralatan Lab', title: 'Pengadaan Mikroskop & Tabung Reaksi', amount: 3200000, transaction_date: '2026-03-08', payment_method: 'Transfer Bank', note: 'Kebutuhan Lab Biologi & Fisika', created_by: 'p-admin', created_at: '2026-03-08T14:00:00Z' },
];

const initialStudentBills: StudentBill[] = [
  { id: 'bill-1', student_id: 's-1', title: 'SPP Bulan Maret 2026', category: 'SPP Bulanan', amount: 500000, due_date: '2026-03-10', status: 'paid', created_at: '2026-03-01T07:00:00Z' },
  { id: 'bill-2', student_id: 's-1', title: 'Iuran Kegiatan Ekstrakurikuler & Studi Wisata', category: 'Kegiatan', amount: 350000, due_date: '2026-03-25', status: 'unpaid', created_at: '2026-03-01T07:00:00Z' },
  { id: 'bill-3', student_id: 's-2', title: 'SPP Bulan Maret 2026', category: 'SPP Bulanan', amount: 500000, due_date: '2026-03-10', status: 'pending', created_at: '2026-03-01T07:00:00Z' },
];

const initialStudentPayments: StudentPayment[] = [
  { id: 'spay-1', bill_id: 'bill-1', student_id: 's-1', amount_paid: 500000, payment_method: 'Transfer Bank BCA', payment_date: '2026-03-02T10:00:00Z', proof_url: 'https://files.sekolah.edu/proofs/rizky-spp-mar.jpg', verified_by: 'p-admin', status: 'verified', created_at: '2026-03-02T10:00:00Z' },
  { id: 'spay-2', bill_id: 'bill-3', student_id: 's-2', amount_paid: 500000, payment_method: 'Transfer Bank Mandiri', payment_date: '2026-03-09T15:20:00Z', proof_url: 'https://files.sekolah.edu/proofs/putri-spp-mar.jpg', status: 'pending', created_at: '2026-03-09T15:20:00Z' },
];

const initialAnnouncements: Announcement[] = [
  { id: 'ann-1', title: 'Pelaksanaan Ujian Tengah Semester (UTS) Genap 2026', content: 'Diberitahukan kepada seluruh siswa dan guru bahwa UTS Genap Tahun Ajaran 2025/2026 akan dilaksanakan mulai tanggal 20 Maret hingga 28 Maret 2026. Harap mempersiapkan diri dengan baik.', target_role: 'all', is_important: true, send_whatsapp: true, created_by: 'p-admin', created_at: '2026-03-01T08:00:00Z' },
  { id: 'ann-2', title: 'Rapat Koordinasi Persiapan Akreditasi Sekolah', content: 'Kepada seluruh Guru dan Staf Tata Usaha, diwajibkan hadir dalam rapat koordinasi persiapan akreditasi yang akan diadakan pada hari Jumat, 13 Maret 2026 pukul 13.30 WIB di Ruang Rapat Utama.', target_role: 'teacher', is_important: true, send_whatsapp: true, created_by: 'p-super', created_at: '2026-03-05T09:00:00Z' },
  { id: 'ann-3', title: 'Jadwal Pengambilan Raport Siswa', content: 'Pengambilan raport bayangan akan dilaksanakan oleh orang tua/wali murid pada tanggal 4 April 2026 mulai pukul 08.00 WIB di kelas masing-masing.', target_role: 'parent', is_important: false, send_whatsapp: true, created_by: 'p-admin', created_at: '2026-03-06T10:00:00Z' },
];

const initialWhatsAppLogs: WhatsAppNotification[] = [
  { id: 'wa-1', recipient_phone: '081234567895', message: '[PENTING] Pelaksanaan Ujian Tengah Semester (UTS) Genap 2026 akan dilaksanakan mulai 20 Maret 2026.', status: 'sent', related_type: 'announcement', related_id: 'ann-1', sent_at: '2026-03-01T08:01:00Z', created_at: '2026-03-01T08:00:00Z' },
  { id: 'wa-2', recipient_phone: '081234567897', message: '[TAGIHAN] Yth. Orang Tua Rizky Kurniawan, terdapat tagihan baru: Iuran Kegiatan Ekstrakurikuler sebesar Rp350.000 jatuh tempo 25 Maret 2026.', status: 'sent', related_type: 'bill', related_id: 'bill-2', sent_at: '2026-03-01T07:05:00Z', created_at: '2026-03-01T07:00:00Z' },
  { id: 'wa-3', recipient_phone: '081234567893', message: '[RAPAT] Yth. Ahmad Dahlan, S.Pd, Rapat Koordinasi Persiapan Akreditasi diadakan Jumat, 13 Maret 2026 pukul 13.30 WIB.', status: 'sent', related_type: 'announcement', related_id: 'ann-2', sent_at: '2026-03-05T09:02:00Z', created_at: '2026-03-05T09:00:00Z' },
];

const initialQRScanLogs: QRScanLog[] = [
  { id: 'log-1', qr_token: 'QR-TEACHER-2026-X9K2L8M4', owner_type: 'teacher', owner_id: 't-1', scan_type: 'Absensi Guru', scan_result: 'success', scanned_by: 'p-staff', scanned_at: '2026-03-10T06:55:00Z', device_info: 'Scanner Admin Ruang TU', ip_address: '192.168.1.10', note: 'Check-in berhasil', owner_name: 'Ahmad Dahlan, S.Pd' },
  { id: 'log-2', qr_token: 'QR-STUDENT-2026-H7Q2P1Z9', owner_type: 'student', owner_id: 's-1', scan_type: 'Absensi Siswa Harian', scan_result: 'success', scanned_by: 'p-staff', scanned_at: '2026-03-10T06:58:00Z', device_info: 'Scanner Gerbang Utama', ip_address: '192.168.1.12', note: 'Check-in berhasil', owner_name: 'Rizky Kurniawan' },
  { id: 'log-3', qr_token: 'QR-TEACHER-2026-X9K2L8M4', owner_type: 'teacher', owner_id: 't-1', scan_type: 'Absensi Guru', scan_result: 'already_checked_in', scanned_by: 'p-staff', scanned_at: '2026-03-10T07:05:00Z', device_info: 'Scanner Admin Ruang TU', ip_address: '192.168.1.10', note: 'Duplicate scan check-in', owner_name: 'Ahmad Dahlan, S.Pd' },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Profile>(initialProfiles[0]); // Default Super Admin
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [classes, setClasses] = useState<ClassRoom[]>(initialClasses);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [parents, _setParents] = useState<Parent[]>(initialParents);
  const [studentParents, _setStudentParents] = useState<StudentParent[]>(initialStudentParents);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [qrCodes, setQRCodes] = useState<QRCodeData[]>(initialQRCodes);
  const [teacherAttendance, setTeacherAttendance] = useState<TeacherAttendance[]>([]);
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendance[]>([]);
  const [studentDailyAttendance, setStudentDailyAttendance] = useState<StudentDailyAttendance[]>([]);
  const [studentScheduleAttendance, setStudentScheduleAttendance] = useState<StudentScheduleAttendance[]>([]);
  const [qrScanLogs, setQRScanLogs] = useState<QRScanLog[]>(initialQRScanLogs);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(initialSubmissions);
  const [payrolls, setPayrolls] = useState<TeacherPayroll[]>(initialPayrolls);
  const [financeTransactions, setFinanceTransactions] = useState<FinanceTransaction[]>(initialFinance);
  const [studentBills, setStudentBills] = useState<StudentBill[]>(initialStudentBills);
  const [studentPayments, setStudentPayments] = useState<StudentPayment[]>(initialStudentPayments);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [whatsappLogs, setWhatsappLogs] = useState<WhatsAppNotification[]>(initialWhatsAppLogs);

  // Populasikan relasi pada get/render
  const getPopulatedTeachers = () => teachers.map(t => ({
    ...t,
    profile: profiles.find(p => p.id === t.profile_id)
  }));

  const getPopulatedStaff = () => staff.map(st => ({
    ...st,
    profile: profiles.find(p => p.id === st.profile_id)
  }));

  const getPopulatedClasses = () => classes.map(c => ({
    ...c,
    homeroom_teacher: getPopulatedTeachers().find(t => t.id === c.homeroom_teacher_id)
  }));

  const getPopulatedStudents = () => students.map(s => ({
    ...s,
    profile: profiles.find(p => p.id === s.profile_id),
    class_room: getPopulatedClasses().find(c => c.id === s.class_id)
  }));

  const getPopulatedSchedules = () => schedules.map(sch => ({
    ...sch,
    class_room: getPopulatedClasses().find(c => c.id === sch.class_id),
    subject: subjects.find(sub => sub.id === sch.subject_id),
    teacher: getPopulatedTeachers().find(t => t.id === sch.teacher_id)
  }));

  const getPopulatedAssignments = () => assignments.map(a => ({
    ...a,
    teacher: getPopulatedTeachers().find(t => t.id === a.teacher_id),
    class_room: getPopulatedClasses().find(c => c.id === a.class_id),
    subject: subjects.find(sub => sub.id === a.subject_id)
  }));

  const getPopulatedSubmissions = () => submissions.map(subm => ({
    ...subm,
    assignment: getPopulatedAssignments().find(a => a.id === subm.assignment_id),
    student: getPopulatedStudents().find(s => s.id === subm.student_id)
  }));

  const getPopulatedPayrolls = () => payrolls.map(pay => ({
    ...pay,
    teacher: getPopulatedTeachers().find(t => t.id === pay.teacher_id)
  }));

  const getPopulatedBills = () => studentBills.map(b => ({
    ...b,
    student: getPopulatedStudents().find(s => s.id === b.student_id)
  }));

  const getPopulatedPayments = () => studentPayments.map(p => ({
    ...p,
    bill: getPopulatedBills().find(b => b.id === p.bill_id),
    student: getPopulatedStudents().find(s => s.id === p.student_id),
    verified_by_profile: profiles.find(pr => pr.id === p.verified_by)
  }));

  const getPopulatedAnnouncements = () => announcements.map(a => ({
    ...a,
    created_by_profile: profiles.find(p => p.id === a.created_by)
  }));

  // Actions
  const addTeacher = (teacherItem: Omit<Teacher, 'id' | 'created_at' | 'profile_id'>, profileItem: Omit<Profile, 'id' | 'created_at'>) => {
    const pId = `p-${Date.now()}`;
    const tId = `t-${Date.now()}`;
    const newProfile: Profile = { ...profileItem, id: pId, created_at: new Date().toISOString() };
    const newTeacher: Teacher = { ...teacherItem, id: tId, profile_id: pId, created_at: new Date().toISOString() };
    
    setProfiles(prev => [...prev, newProfile]);
    setTeachers(prev => [...prev, newTeacher]);

    // Generate QR
    generateQRCode('teacher', tId, `QR-TEACHER-2026-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
  };

  const addStaff = (staffItem: Omit<Staff, 'id' | 'created_at' | 'profile_id'>, profileItem: Omit<Profile, 'id' | 'created_at'>) => {
    const pId = `p-${Date.now()}`;
    const stId = `st-${Date.now()}`;
    const newProfile: Profile = { ...profileItem, id: pId, created_at: new Date().toISOString() };
    const newStaff: Staff = { ...staffItem, id: stId, profile_id: pId, created_at: new Date().toISOString() };
    
    setProfiles(prev => [...prev, newProfile]);
    setStaff(prev => [...prev, newStaff]);

    // Generate QR
    generateQRCode('staff', stId, `QR-STAFF-2026-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
  };

  const addStudent = (studentItem: Omit<Student, 'id' | 'created_at' | 'profile_id'>, profileItem: Omit<Profile, 'id' | 'created_at'>) => {
    const pId = `p-${Date.now()}`;
    const sId = `s-${Date.now()}`;
    const newProfile: Profile = { ...profileItem, id: pId, created_at: new Date().toISOString() };
    const newStudent: Student = { ...studentItem, id: sId, profile_id: pId, created_at: new Date().toISOString() };
    
    setProfiles(prev => [...prev, newProfile]);
    setStudents(prev => [...prev, newStudent]);

    // Generate QR
    generateQRCode('student', sId, `QR-STUDENT-2026-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
  };

  const addClass = (classItem: Omit<ClassRoom, 'id' | 'created_at'>) => {
    const newClass: ClassRoom = { ...classItem, id: `c-${Date.now()}`, created_at: new Date().toISOString() };
    setClasses(prev => [...prev, newClass]);
  };

  const addSubject = (subjectItem: Omit<Subject, 'id' | 'created_at'>) => {
    const newSub: Subject = { ...subjectItem, id: `sub-${Date.now()}`, created_at: new Date().toISOString() };
    setSubjects(prev => [...prev, newSub]);
  };

  const addSchedule = (scheduleItem: Omit<Schedule, 'id' | 'created_at'>) => {
    const newSch: Schedule = { ...scheduleItem, id: `sch-${Date.now()}`, created_at: new Date().toISOString() };
    setSchedules(prev => [...prev, newSch]);
  };

  const addAssignment = (assignmentItem: Omit<Assignment, 'id' | 'created_at'>) => {
    const newAss: Assignment = { ...assignmentItem, id: `ass-${Date.now()}`, created_at: new Date().toISOString() };
    setAssignments(prev => [newAss, ...prev]);

    // Send WA Notification to students of this class
    const classStudents = students.filter(s => s.class_id === assignmentItem.class_id);
    classStudents.forEach(st => {
      if (st.parent_phone) {
        const wa: WhatsAppNotification = {
          id: `wa-${Date.now()}-${Math.random()}`,
          recipient_phone: st.parent_phone,
          message: `[TUGAS BARU] Yth. Orang Tua, tugas baru "${assignmentItem.title}" telah diberikan kepada kelas anak Anda. Batas waktu: ${new Date(assignmentItem.due_date).toLocaleDateString()}`,
          status: 'sent',
          related_type: 'assignment',
          related_id: newAss.id,
          sent_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };
        setWhatsappLogs(prev => [wa, ...prev]);
      }
    });
  };

  const addSubmission = (submissionItem: Omit<AssignmentSubmission, 'id' | 'created_at'>) => {
    const newSubm: AssignmentSubmission = { ...submissionItem, id: `subm-${Date.now()}`, created_at: new Date().toISOString() };
    setSubmissions(prev => [newSubm, ...prev]);
  };

  const gradeSubmission = (id: string, grade: number, feedback: string) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, grade, feedback, status: 'graded' } : s));
  };

  const addPayroll = (payrollItem: Omit<TeacherPayroll, 'id' | 'created_at'>) => {
    const newPay: TeacherPayroll = { ...payrollItem, id: `pay-${Date.now()}`, created_at: new Date().toISOString() };
    setPayrolls(prev => [newPay, ...prev]);
  };

  const updatePayrollStatus = (id: string, status: 'pending' | 'paid') => {
    setPayrolls(prev => prev.map(p => p.id === id ? { ...p, status, paid_at: status === 'paid' ? new Date().toISOString() : undefined } : p));
  };

  const addFinanceTransaction = (transaction: Omit<FinanceTransaction, 'id' | 'created_at'>) => {
    const newFin: FinanceTransaction = { ...transaction, id: `fin-${Date.now()}`, created_at: new Date().toISOString() };
    setFinanceTransactions(prev => [newFin, ...prev]);
  };

  const addStudentBill = (bill: Omit<StudentBill, 'id' | 'created_at'>) => {
    const newBill: StudentBill = { ...bill, id: `bill-${Date.now()}`, created_at: new Date().toISOString() };
    setStudentBills(prev => [newBill, ...prev]);

    // Send WA
    const student = students.find(s => s.id === bill.student_id);
    if (student?.parent_phone) {
      const wa: WhatsAppNotification = {
        id: `wa-${Date.now()}`,
        recipient_phone: student.parent_phone,
        message: `[TAGIHAN BARU] Yth. Orang Tua ${student.profile?.full_name || ''}, terdapat tagihan baru: ${bill.title} sebesar Rp${bill.amount.toLocaleString('id-ID')} jatuh tempo ${bill.due_date}.`,
        status: 'sent',
        related_type: 'bill',
        related_id: newBill.id,
        sent_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      setWhatsappLogs(prev => [wa, ...prev]);
    }
  };

  const addStudentPayment = (payment: Omit<StudentPayment, 'id' | 'created_at'>) => {
    const newPay: StudentPayment = { ...payment, id: `spay-${Date.now()}`, created_at: new Date().toISOString() };
    setStudentPayments(prev => [newPay, ...prev]);

    // Update bill status to pending
    setStudentBills(prev => prev.map(b => b.id === payment.bill_id ? { ...b, status: 'pending' } : b));
  };

  const verifyStudentPayment = (paymentId: string, status: 'verified' | 'rejected') => {
    const payment = studentPayments.find(p => p.id === paymentId);
    if (!payment) return;

    setStudentPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status, verified_by: currentUser.id } : p));

    if (status === 'verified') {
      setStudentBills(prev => prev.map(b => b.id === payment.bill_id ? { ...b, status: 'paid' } : b));

      // Record income finance transaction
      const bill = studentBills.find(b => b.id === payment.bill_id);
      const student = students.find(s => s.id === payment.student_id);
      const studentProfile = profiles.find(p => p.id === student?.profile_id);

      if (bill) {
        addFinanceTransaction({
          type: 'income',
          category: bill.category,
          title: `Pembayaran ${bill.title} - ${studentProfile?.full_name || 'Siswa'}`,
          amount: payment.amount_paid,
          transaction_date: new Date().toISOString().split('T')[0],
          payment_method: payment.payment_method,
          note: `Terverifikasi oleh ${currentUser.full_name}`,
          created_by: currentUser.id,
        });

        // Send WA verification
        if (student?.parent_phone) {
          const wa: WhatsAppNotification = {
            id: `wa-${Date.now()}`,
            recipient_phone: student.parent_phone,
            message: `[PEMBAYARAN BERHASIL] Yth. Orang Tua ${studentProfile?.full_name || ''}, pembayaran untuk ${bill.title} sebesar Rp${payment.amount_paid.toLocaleString('id-ID')} telah berhasil DIVERIFIKASI. Terima kasih.`,
            status: 'sent',
            related_type: 'payment',
            related_id: payment.id,
            sent_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          };
          setWhatsappLogs(prev => [wa, ...prev]);
        }
      }
    } else {
      setStudentBills(prev => prev.map(b => b.id === payment.bill_id ? { ...b, status: 'rejected' } : b));
    }
  };

  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'created_at'>) => {
    const newAnn: Announcement = { ...ann, id: `ann-${Date.now()}`, created_by: currentUser.id, created_at: new Date().toISOString() };
    setAnnouncements(prev => [newAnn, ...prev]);

    if (ann.send_whatsapp) {
      // Broadcast to matching targets
      let targetPhones: string[] = [];
      if (ann.target_role === 'all' || ann.target_role === 'parent' || ann.target_role === 'student') {
        students.forEach(s => s.parent_phone && targetPhones.push(s.parent_phone));
      }
      if (ann.target_role === 'all' || ann.target_role === 'teacher') {
        teachers.forEach(t => t.phone && targetPhones.push(t.phone));
      }
      if (ann.target_role === 'all' || ann.target_role === 'staff') {
        staff.forEach(st => st.phone && targetPhones.push(st.phone));
      }

      // Deduplicate
      targetPhones = Array.from(new Set(targetPhones));

      targetPhones.forEach((phone, idx) => {
        const wa: WhatsAppNotification = {
          id: `wa-${Date.now()}-${idx}`,
          recipient_phone: phone,
          message: `[PENGUMUMAN ${ann.is_important ? 'PENTING' : 'SEKOLAH'}] ${ann.title}\n\n${ann.content}`,
          status: 'sent',
          related_type: 'announcement',
          related_id: newAnn.id,
          sent_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };
        setWhatsappLogs(prev => [wa, ...prev]);
      });
    }
  };

  const generateQRCode = (ownerType: 'teacher' | 'staff' | 'student', ownerId: string, token?: string) => {
    const qrToken = token || `QR-${ownerType.toUpperCase()}-2026-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    
    let ownerName = '';
    let ownerCode = '';
    let ownerDetails = '';

    if (ownerType === 'teacher') {
      const t = teachers.find(item => item.id === ownerId);
      const p = profiles.find(item => item.id === t?.profile_id);
      ownerName = p?.full_name || 'Guru';
      ownerCode = t?.teacher_code || '';
      ownerDetails = 'Guru Matpel';
    } else if (ownerType === 'staff') {
      const st = staff.find(item => item.id === ownerId);
      const p = profiles.find(item => item.id === st?.profile_id);
      ownerName = p?.full_name || 'Staf';
      ownerCode = st?.staff_code || '';
      ownerDetails = st?.position || 'Staf TU';
    } else if (ownerType === 'student') {
      const s = students.find(item => item.id === ownerId);
      const p = profiles.find(item => item.id === s?.profile_id);
      const c = classes.find(item => item.id === s?.class_id);
      ownerName = p?.full_name || 'Siswa';
      ownerCode = s?.student_code || '';
      ownerDetails = c?.name || 'Kelas Siswa';
    }

    const newQR: QRCodeData = {
      id: `qr-${Date.now()}`,
      owner_type: ownerType,
      owner_id: ownerId,
      qr_token: qrToken,
      is_active: true,
      issued_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      owner_name: ownerName,
      owner_code: ownerCode,
      owner_details: ownerDetails,
    };

    setQRCodes(prev => [...prev, newQR]);
    return newQR;
  };

  const revokeQRCode = (id: string) => {
    setQRCodes(prev => prev.map(qr => qr.id === id ? { ...qr, is_active: false, revoked_at: new Date().toISOString() } : qr));
  };

  const scanQRCode = (token: string, mode: string, scheduleId?: string) => {
    const qr = qrCodes.find(q => q.qr_token === token);
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toISOString();

    let scanResult: ScanResultStatus = 'success';
    let message = '';
    let ownerName = qr?.owner_name || 'Tidak Diketahui';

    if (!qr) {
      scanResult = 'invalid_qr';
      message = 'QR Code tidak ditemukan dalam sistem.';
    } else if (!qr.is_active) {
      scanResult = 'inactive_qr';
      message = 'QR Code sudah tidak aktif / di-revoke.';
    } else {
      // Cek kesesuaian mode dengan owner_type
      if (mode === 'Absensi Guru' && qr.owner_type !== 'teacher') {
        scanResult = 'unauthorized';
        message = `Gagal: Mode Absensi Guru tetapi QR milik ${qr.owner_type}.`;
      } else if (mode === 'Absensi Staf' && qr.owner_type !== 'staff') {
        scanResult = 'unauthorized';
        message = `Gagal: Mode Absensi Staf tetapi QR milik ${qr.owner_type}.`;
      } else if (mode === 'Absensi Siswa Harian' && qr.owner_type !== 'student') {
        scanResult = 'unauthorized';
        message = `Gagal: Mode Absensi Siswa Harian tetapi QR milik ${qr.owner_type}.`;
      } else if (mode === 'Absensi Siswa Per Jadwal Pelajaran' && qr.owner_type !== 'student') {
        scanResult = 'unauthorized';
        message = `Gagal: Mode Absensi Kelas tetapi QR milik ${qr.owner_type}.`;
      } else {
        // Proses absensi berdasarkan mode
        if (mode === 'Absensi Guru') {
          const existingAtt = teacherAttendance.find(a => a.teacher_id === qr.owner_id && a.date === today);
          if (!existingAtt) {
            // Check-in
            const newAtt: TeacherAttendance = {
              id: `tatt-${Date.now()}`,
              teacher_id: qr.owner_id,
              date: today,
              check_in: nowTime,
              status: 'present',
              scan_method: 'qr',
              scanned_by: currentUser.id,
              created_at: nowTime
            };
            setTeacherAttendance(prev => [...prev, newAtt]);
            message = `Check-in Guru Berhasil: ${ownerName}`;
          } else if (existingAtt.check_in && !existingAtt.check_out) {
            // Check-out
            setTeacherAttendance(prev => prev.map(a => a.id === existingAtt.id ? { ...a, check_out: nowTime } : a));
            message = `Check-out Guru Berhasil: ${ownerName}`;
            scanResult = 'already_checked_out'; // Status informasi
          } else {
            scanResult = 'duplicate_scan';
            message = `Guru ${ownerName} sudah melakukan check-in dan check-out hari ini.`;
          }
        } else if (mode === 'Absensi Staf') {
          const existingAtt = staffAttendance.find(a => a.staff_id === qr.owner_id && a.date === today);
          if (!existingAtt) {
            // Check-in
            const newAtt: StaffAttendance = {
              id: `statt-${Date.now()}`,
              staff_id: qr.owner_id,
              date: today,
              check_in: nowTime,
              status: 'present',
              scan_method: 'qr',
              scanned_by: currentUser.id,
              created_at: nowTime
            };
            setStaffAttendance(prev => [...prev, newAtt]);
            message = `Check-in Staf Berhasil: ${ownerName}`;
          } else if (existingAtt.check_in && !existingAtt.check_out) {
            // Check-out
            setStaffAttendance(prev => prev.map(a => a.id === existingAtt.id ? { ...a, check_out: nowTime } : a));
            message = `Check-out Staf Berhasil: ${ownerName}`;
            scanResult = 'already_checked_out';
          } else {
            scanResult = 'duplicate_scan';
            message = `Staf ${ownerName} sudah melakukan check-in dan check-out hari ini.`;
          }
        } else if (mode === 'Absensi Siswa Harian') {
          const student = students.find(s => s.id === qr.owner_id);
          const existingAtt = studentDailyAttendance.find(a => a.student_id === qr.owner_id && a.date === today);
          if (!existingAtt) {
            // Check-in
            const newAtt: StudentDailyAttendance = {
              id: `sdatt-${Date.now()}`,
              student_id: qr.owner_id,
              class_id: student?.class_id || '',
              date: today,
              check_in: nowTime,
              status: 'present',
              scan_method: 'qr',
              scanned_by: currentUser.id,
              created_at: nowTime
            };
            setStudentDailyAttendance(prev => [...prev, newAtt]);
            message = `Check-in Siswa Berhasil: ${ownerName}`;
          } else if (existingAtt.check_in && !existingAtt.check_out) {
            // Check-out
            setStudentDailyAttendance(prev => prev.map(a => a.id === existingAtt.id ? { ...a, check_out: nowTime } : a));
            message = `Check-out Siswa Berhasil: ${ownerName}`;
            scanResult = 'already_checked_out';
          } else {
            scanResult = 'duplicate_scan';
            message = `Siswa ${ownerName} sudah melakukan check-in dan check-out harian.`;
          }
        } else if (mode === 'Absensi Siswa Per Jadwal Pelajaran') {
          if (!scheduleId) {
            scanResult = 'wrong_schedule';
            message = 'Jadwal pelajaran aktif belum dipilih.';
          } else {
            const schedule = schedules.find(sch => sch.id === scheduleId);
            const student = students.find(s => s.id === qr.owner_id);

            if (!schedule) {
              scanResult = 'wrong_schedule';
              message = 'Jadwal pelajaran tidak valid.';
            } else if (student?.class_id !== schedule.class_id) {
              scanResult = 'not_in_class';
              message = `Ditolak: Siswa ${ownerName} bukan dari kelas jadwal ini.`;
            } else {
              const existingAtt = studentScheduleAttendance.find(
                a => a.student_id === qr.owner_id && a.schedule_id === scheduleId && a.attendance_date === today
              );
              if (existingAtt) {
                scanResult = 'duplicate_scan';
                message = `Siswa ${ownerName} sudah tercatat hadir di jadwal pelajaran ini.`;
              } else {
                const newAtt: StudentScheduleAttendance = {
                  id: `ssatt-${Date.now()}`,
                  student_id: qr.owner_id,
                  class_id: schedule.class_id,
                  schedule_id: scheduleId,
                  teacher_id: schedule.teacher_id,
                  attendance_date: today,
                  status: 'present',
                  scanned_at: nowTime,
                  scanned_by: currentUser.id,
                  created_at: nowTime
                };
                setStudentScheduleAttendance(prev => [...prev, newAtt]);
                message = `Kehadiran Kelas Berhasil: ${ownerName} (Hadir)`;
              }
            }
          }
        }
      }
    }

    // Catat log
    const newLog: QRScanLog = {
      id: `log-${Date.now()}`,
      qr_token: token,
      owner_type: qr?.owner_type || 'unknown',
      owner_id: qr?.owner_id,
      scan_type: mode,
      scan_result: scanResult,
      scanned_by: currentUser.id,
      scanned_by_profile: currentUser,
      scanned_at: nowTime,
      device_info: 'Web Camera Scanner / Simulator',
      ip_address: '127.0.0.1',
      note: message,
      owner_name: ownerName
    };

    setQRScanLogs(prev => [newLog, ...prev]);

    return { status: scanResult, message, log: newLog };
  };

  const value: StoreContextType = {
    currentUser,
    setCurrentUser,
    profiles,
    teachers: getPopulatedTeachers(),
    staff: getPopulatedStaff(),
    classes: getPopulatedClasses(),
    students: getPopulatedStudents(),
    parents,
    studentParents,
    subjects,
    schedules: getPopulatedSchedules(),
    qrCodes,
    teacherAttendance,
    staffAttendance,
    studentDailyAttendance,
    studentScheduleAttendance,
    qrScanLogs,
    assignments: getPopulatedAssignments(),
    submissions: getPopulatedSubmissions(),
    payrolls: getPopulatedPayrolls(),
    financeTransactions,
    studentBills: getPopulatedBills(),
    studentPayments: getPopulatedPayments(),
    announcements: getPopulatedAnnouncements(),
    whatsappLogs,
    addTeacher,
    addStaff,
    addStudent,
    addClass,
    addSubject,
    addSchedule,
    addAssignment,
    addSubmission,
    gradeSubmission,
    addPayroll,
    updatePayrollStatus,
    addFinanceTransaction,
    addStudentBill,
    addStudentPayment,
    verifyStudentPayment,
    addAnnouncement,
    generateQRCode,
    revokeQRCode,
    scanQRCode,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
