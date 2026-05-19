import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
  role: z.enum(['super_admin', 'admin', 'staff', 'teacher', 'student', 'parent']).optional(),
});

export const teacherSchema = z.object({
  full_name: z.string().min(3, { message: 'Nama lengkap wajib diisi' }),
  teacher_code: z.string().min(3, { message: 'Kode guru wajib diisi' }),
  phone: z.string().min(9, { message: 'Nomor telepon tidak valid' }),
  address: z.string().min(5, { message: 'Alamat wajib diisi' }),
  salary_type: z.enum(['monthly', 'hourly']),
  base_salary: z.coerce.number().min(0, { message: 'Gaji pokok tidak boleh negatif' }),
  is_active: z.boolean().default(true),
});

export const staffSchema = z.object({
  full_name: z.string().min(3, { message: 'Nama lengkap wajib diisi' }),
  staff_code: z.string().min(3, { message: 'Kode staf wajib diisi' }),
  position: z.string().min(2, { message: 'Jabatan wajib diisi' }),
  phone: z.string().min(9, { message: 'Nomor telepon tidak valid' }),
  address: z.string().min(5, { message: 'Alamat wajib diisi' }),
  base_salary: z.coerce.number().min(0, { message: 'Gaji pokok tidak boleh negatif' }),
  is_active: z.boolean().default(true),
});

export const studentSchema = z.object({
  full_name: z.string().min(3, { message: 'Nama lengkap murid wajib diisi' }),
  student_code: z.string().min(3, { message: 'NIS / Kode murid wajib diisi' }),
  class_id: z.string().min(1, { message: 'Kelas wajib dipilih' }),
  parent_name: z.string().min(3, { message: 'Nama orang tua wajib diisi' }),
  parent_phone: z.string().min(9, { message: 'Nomor telepon orang tua tidak valid' }),
  address: z.string().min(5, { message: 'Alamat wajib diisi' }),
  is_active: z.boolean().default(true),
});

export const classSchema = z.object({
  name: z.string().min(2, { message: 'Nama kelas wajib diisi (misal: X-A)' }),
  level: z.string().min(1, { message: 'Tingkat wajib diisi (misal: 10)' }),
  homeroom_teacher_id: z.string().optional(),
  academic_year: z.string().min(4, { message: 'Tahun ajaran wajib diisi (misal: 2025/2026)' }),
  is_active: z.boolean().default(true),
});

export const subjectSchema = z.object({
  name: z.string().min(2, { message: 'Nama mata pelajaran wajib diisi' }),
  code: z.string().min(2, { message: 'Kode mata pelajaran wajib diisi' }),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

export const scheduleSchema = z.object({
  class_id: z.string().min(1, { message: 'Kelas wajib dipilih' }),
  subject_id: z.string().min(1, { message: 'Mata pelajaran wajib dipilih' }),
  teacher_id: z.string().min(1, { message: 'Guru pengajar wajib dipilih' }),
  day_of_week: z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']),
  start_time: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: 'Format waktu tidak valid (HH:MM)' }),
  end_time: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: 'Format waktu tidak valid (HH:MM)' }),
  room: z.string().min(1, { message: 'Ruangan wajib diisi' }),
  is_active: z.boolean().default(true),
});

export const assignmentSchema = z.object({
  class_id: z.string().min(1, { message: 'Kelas wajib dipilih' }),
  subject_id: z.string().min(1, { message: 'Mata pelajaran wajib dipilih' }),
  title: z.string().min(3, { message: 'Judul tugas wajib diisi' }),
  description: z.string().min(5, { message: 'Deskripsi tugas wajib diisi' }),
  due_date: z.string().min(1, { message: 'Batas waktu pengumpulan wajib diisi' }),
  attachment_url: z.string().optional(),
});

export const submissionSchema = z.object({
  submission_text: z.string().optional(),
  file_url: z.string().optional(),
}).refine(data => data.submission_text || data.file_url, {
  message: 'Wajib mengisi teks jawaban atau mengunggah file lampiran',
  path: ['submission_text'],
});

export const paymentSchema = z.object({
  bill_id: z.string().min(1, { message: 'Tagihan wajib dipilih' }),
  amount_paid: z.coerce.number().min(1, { message: 'Jumlah bayar wajib diisi' }),
  payment_method: z.string().min(2, { message: 'Metode pembayaran wajib diisi (misal: Transfer Bank)' }),
  proof_url: z.string().min(1, { message: 'Bukti pembayaran wajib diunggah/diisi' }),
});

export const payrollSchema = z.object({
  teacher_id: z.string().min(1, { message: 'Guru wajib dipilih' }),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2020).max(2030),
  base_salary: z.coerce.number().min(0),
  bonus: z.coerce.number().min(0),
  deduction: z.coerce.number().min(0),
  allowance: z.coerce.number().min(0),
  additional_honor: z.coerce.number().min(0),
  status: z.enum(['pending', 'paid']),
  note: z.string().optional(),
});

export const announcementSchema = z.object({
  title: z.string().min(3, { message: 'Judul pengumuman wajib diisi' }),
  content: z.string().min(5, { message: 'Isi pengumuman wajib diisi' }),
  target_role: z.enum(['all', 'teacher', 'staff', 'student', 'parent']),
  is_important: z.boolean().default(false),
  send_whatsapp: z.boolean().default(false),
});

export const qrCodeSchema = z.object({
  owner_type: z.enum(['teacher', 'staff', 'student']),
  owner_id: z.string().min(1, { message: 'Pemilik wajib dipilih' }),
  is_active: z.boolean().default(true),
});
