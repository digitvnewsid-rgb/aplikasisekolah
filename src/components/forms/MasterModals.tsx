import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  teacherSchema, staffSchema, studentSchema, classSchema, subjectSchema,
  scheduleSchema, assignmentSchema, announcementSchema
} from '../../lib/validations';
import { useStore } from '../../lib/store';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTeacherModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { addTeacher } = useStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(teacherSchema),
    defaultValues: { full_name: '', teacher_code: '', phone: '', address: '', salary_type: 'monthly' as const, base_salary: 4500000, is_active: true }
  });

  if (!isOpen) return null;

  const onSubmit = (data: any) => {
    addTeacher(
      { teacher_code: data.teacher_code, address: data.address, phone: data.phone, salary_type: data.salary_type, base_salary: data.base_salary, is_active: data.is_active },
      { full_name: data.full_name, phone: data.phone, role: 'teacher', is_active: data.is_active }
    );
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg overflow-hidden animate-scale">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-base">Tambah Data Guru Baru</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Nama Lengkap</label>
            <input {...register('full_name')} placeholder="Ahmad Dahlan, S.Pd" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name.message as string}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Kode Guru</label>
              <input {...register('teacher_code')} placeholder="GUR-003" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.teacher_code && <p className="text-xs text-red-500 mt-1">{errors.teacher_code.message as string}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Nomor HP / WA</label>
              <input {...register('phone')} placeholder="081234567890" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message as string}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Alamat Lengkap</label>
            <input {...register('address')} placeholder="Jl. Pendidikan No. 1" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message as string}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Tipe Gaji</label>
              <select {...register('salary_type')} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="monthly">Bulanan (Monthly)</option>
                <option value="hourly">Per Jam (Hourly)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Gaji Pokok (Rp)</label>
              <input type="number" {...register('base_salary')} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600">Batal</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm">Simpan Guru & Generate QR</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AddStaffModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { addStaff } = useStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(staffSchema),
    defaultValues: { full_name: '', staff_code: '', position: 'Staf Tata Usaha', phone: '', address: '', base_salary: 3500000, is_active: true }
  });

  if (!isOpen) return null;

  const onSubmit = (data: any) => {
    addStaff(
      { staff_code: data.staff_code, position: data.position, address: data.address, phone: data.phone, base_salary: data.base_salary, is_active: data.is_active },
      { full_name: data.full_name, phone: data.phone, role: 'staff', is_active: data.is_active }
    );
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg overflow-hidden animate-scale">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-base">Tambah Data Staf / Admin</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Nama Lengkap</label>
            <input {...register('full_name')} placeholder="Rini Yuliana" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name.message as string}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Kode Staf</label>
              <input {...register('staff_code')} placeholder="STF-002" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.staff_code && <p className="text-xs text-red-500 mt-1">{errors.staff_code.message as string}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Posisi / Jabatan</label>
              <input {...register('position')} placeholder="Staf Keuangan" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.position && <p className="text-xs text-red-500 mt-1">{errors.position.message as string}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Nomor HP / WA</label>
              <input {...register('phone')} placeholder="081234567891" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Gaji Pokok (Rp)</label>
              <input type="number" {...register('base_salary')} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Alamat Lengkap</label>
            <input {...register('address')} placeholder="Jl. Anggrek No. 5" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600">Batal</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm">Simpan Staf & Generate QR</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AddStudentModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { addStudent, classes } = useStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: { full_name: '', student_code: '', class_id: classes[0]?.id || '', parent_name: '', parent_phone: '', address: '', is_active: true }
  });

  if (!isOpen) return null;

  const onSubmit = (data: any) => {
    addStudent(
      { student_code: data.student_code, class_id: data.class_id, parent_name: data.parent_name, parent_phone: data.parent_phone, address: data.address, is_active: data.is_active },
      { full_name: data.full_name, phone: data.parent_phone, role: 'student', is_active: data.is_active }
    );
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg overflow-hidden animate-scale">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-base">Tambah Data Murid Baru</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Nama Lengkap Murid</label>
            <input {...register('full_name')} placeholder="Bima Arya" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name.message as string}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">NIS / Kode Murid</label>
              <input {...register('student_code')} placeholder="NIS-2026003" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.student_code && <p className="text-xs text-red-500 mt-1">{errors.student_code.message as string}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Pilih Kelas</label>
              <select {...register('class_id')} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                {classes.map(c => <option key={c.id} value={c.id}>{c.name} (Tingkat {c.level})</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Nama Orang Tua</label>
              <input {...register('parent_name')} placeholder="Surya Wijaya" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.parent_name && <p className="text-xs text-red-500 mt-1">{errors.parent_name.message as string}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Nomor HP / WA Ortu</label>
              <input {...register('parent_phone')} placeholder="081234567899" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.parent_phone && <p className="text-xs text-red-500 mt-1">{errors.parent_phone.message as string}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Alamat Lengkap</label>
            <input {...register('address')} placeholder="Jl. Kenari No. 12" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600">Batal</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm">Simpan Murid & Generate QR</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AddClassModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { addClass, teachers } = useStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(classSchema),
    defaultValues: { name: '', level: '10', homeroom_teacher_id: teachers[0]?.id || '', academic_year: '2025/2026', is_active: true }
  });

  if (!isOpen) return null;

  const onSubmit = (data: any) => {
    addClass(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg overflow-hidden animate-scale">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-base">Tambah Kelas Baru</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Nama Kelas</label>
              <input {...register('name')} placeholder="X-IPA 2" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message as string}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Tingkat / Level</label>
              <input {...register('level')} placeholder="10" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Wali Kelas</label>
            <select {...register('homeroom_teacher_id')} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              {teachers.map(t => <option key={t.id} value={t.id}>{t.profile?.full_name} ({t.teacher_code})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Tahun Ajaran</label>
            <input {...register('academic_year')} placeholder="2025/2026" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600">Batal</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm">Simpan Kelas</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AddSubjectModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { addSubject } = useStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(subjectSchema),
    defaultValues: { name: '', code: '', description: '', is_active: true }
  });

  if (!isOpen) return null;

  const onSubmit = (data: any) => {
    addSubject(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg overflow-hidden animate-scale">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-base">Tambah Mata Pelajaran</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Nama Matpel</label>
              <input {...register('name')} placeholder="Biologi Dasar" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message as string}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Kode Matpel</label>
              <input {...register('code')} placeholder="BIO-104" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code.message as string}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Deskripsi</label>
            <textarea {...register('description')} rows={3} placeholder="Mempelajari anatomi dan sel biologi" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600">Batal</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm">Simpan Matpel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AddScheduleModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { addSchedule, classes, subjects, teachers } = useStore();
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues: { class_id: classes[0]?.id || '', subject_id: subjects[0]?.id || '', teacher_id: teachers[0]?.id || '', day_of_week: 'Senin', start_time: '08:00', end_time: '09:30', room: 'Ruang 101', is_active: true }
  });

  if (!isOpen) return null;

  const onSubmit = (data: any) => {
    addSchedule(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg overflow-hidden animate-scale">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-base">Tambah Jadwal Pelajaran</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Pilih Kelas</label>
              <select {...register('class_id')} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Mata Pelajaran</label>
              <select {...register('subject_id')} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Guru Pengajar</label>
            <select {...register('teacher_id')} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              {teachers.map(t => <option key={t.id} value={t.id}>{t.profile?.full_name} ({t.teacher_code})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Hari</label>
              <select {...register('day_of_week')} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Mulai (HH:MM)</label>
              <input {...register('start_time')} placeholder="08:00" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Selesai (HH:MM)</label>
              <input {...register('end_time')} placeholder="09:30" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Ruangan</label>
            <input {...register('room')} placeholder="Ruang 101" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600">Batal</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm">Simpan Jadwal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AddAssignmentModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { addAssignment, classes, subjects, currentUser, teachers } = useStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(assignmentSchema),
    defaultValues: { class_id: classes[0]?.id || '', subject_id: subjects[0]?.id || '', title: '', description: '', due_date: '2026-03-20T23:59', attachment_url: '' }
  });

  if (!isOpen) return null;

  const onSubmit = (data: any) => {
    const teacher = teachers.find(t => t.profile_id === currentUser.id) || teachers[0];
    addAssignment({
      teacher_id: teacher.id,
      class_id: data.class_id,
      subject_id: data.subject_id,
      title: data.title,
      description: data.description,
      due_date: new Date(data.due_date).toISOString(),
      attachment_url: data.attachment_url
    });
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg overflow-hidden animate-scale">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-base">Buat Tugas Baru & Notif WA</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Pilih Kelas</label>
              <select {...register('class_id')} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Mata Pelajaran</label>
              <select {...register('subject_id')} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Judul Tugas</label>
            <input {...register('title')} placeholder="Tugas Makalah Biologi" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message as string}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Deskripsi / Instruksi</label>
            <textarea {...register('description')} rows={3} placeholder="Jelaskan proses fotosintesis secara lengkap..." className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Batas Waktu (Deadline)</label>
              <input type="datetime-local" {...register('due_date')} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">URL Lampiran (Opsional)</label>
              <input {...register('attachment_url')} placeholder="https://files.sekolah.edu/tugas.pdf" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600">Batal</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm">Simpan & Kirim WA</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AddAnnouncementModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { addAnnouncement } = useStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(announcementSchema),
    defaultValues: { title: '', content: '', target_role: 'all', is_important: false, send_whatsapp: true }
  });

  if (!isOpen) return null;

  const onSubmit = (data: any) => {
    addAnnouncement(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg overflow-hidden animate-scale">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-base">Buat Pengumuman & Broadcast WA</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Judul Pengumuman</label>
            <input {...register('title')} placeholder="Libur Nasional Hari Raya" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message as string}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Isi Pengumuman</label>
            <textarea {...register('content')} rows={4} placeholder="Diberitahukan kepada seluruh siswa dan guru..." className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message as string}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Target Penerima</label>
            <select {...register('target_role')} className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="all">Semua Warga Sekolah (All)</option>
              <option value="teacher">Hanya Guru (Teacher)</option>
              <option value="staff">Hanya Staf (Staff)</option>
              <option value="student">Hanya Murid (Student)</option>
              <option value="parent">Hanya Orang Tua (Parent)</option>
            </select>
          </div>
          <div className="flex items-center space-x-6 pt-2">
            <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer font-medium">
              <input type="checkbox" {...register('is_important')} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
              <span>Tandai Sangat Penting</span>
            </label>
            <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer font-medium">
              <input type="checkbox" {...register('send_whatsapp')} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
              <span>Broadcast ke WhatsApp Gateway</span>
            </label>
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600">Batal</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm">Simpan & Broadcast</button>
          </div>
        </form>
      </div>
    </div>
  );
};
