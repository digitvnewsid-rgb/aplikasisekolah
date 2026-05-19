export type UserRole = 'super_admin' | 'admin' | 'staff' | 'teacher' | 'student' | 'parent';

export interface Profile {
  id: string;
  user_id?: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Teacher {
  id: string;
  profile_id: string;
  profile?: Profile;
  teacher_code: string;
  address?: string;
  phone?: string;
  salary_type: 'monthly' | 'hourly';
  base_salary: number;
  is_active: boolean;
  created_at: string;
}

export interface Staff {
  id: string;
  profile_id: string;
  profile?: Profile;
  staff_code: string;
  position: string;
  address?: string;
  phone?: string;
  base_salary: number;
  is_active: boolean;
  created_at: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  level: string;
  homeroom_teacher_id?: string;
  homeroom_teacher?: Teacher;
  academic_year: string;
  is_active: boolean;
  created_at: string;
}

export interface Student {
  id: string;
  profile_id: string;
  profile?: Profile;
  student_code: string;
  class_id?: string;
  class_room?: ClassRoom;
  parent_name?: string;
  parent_phone?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
}

export interface Parent {
  id: string;
  profile_id: string;
  profile?: Profile;
  full_name: string;
  phone?: string;
  address?: string;
  created_at: string;
}

export interface StudentParent {
  id: string;
  student_id: string;
  parent_id: string;
  relationship: string;
  created_at: string;
  student?: Student;
  parent?: Parent;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface Schedule {
  id: string;
  class_id: string;
  class_room?: ClassRoom;
  subject_id: string;
  subject?: Subject;
  teacher_id: string;
  teacher?: Teacher;
  day_of_week: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
  start_time: string;
  end_time: string;
  room: string;
  is_active: boolean;
  created_at: string;
}
