import { Teacher, Staff, Student, ClassRoom, Schedule, Profile } from './user';

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'permission' | 'sick';

export interface TeacherAttendance {
  id: string;
  teacher_id: string;
  teacher?: Teacher;
  date: string;
  check_in?: string;
  check_out?: string;
  status: AttendanceStatus;
  scan_method: string;
  scanned_by?: string;
  scanned_by_profile?: Profile;
  note?: string;
  created_at: string;
}

export interface StaffAttendance {
  id: string;
  staff_id: string;
  staff?: Staff;
  date: string;
  check_in?: string;
  check_out?: string;
  status: AttendanceStatus;
  scan_method: string;
  scanned_by?: string;
  scanned_by_profile?: Profile;
  note?: string;
  created_at: string;
}

export interface StudentDailyAttendance {
  id: string;
  student_id: string;
  student?: Student;
  class_id: string;
  class_room?: ClassRoom;
  date: string;
  check_in?: string;
  check_out?: string;
  status: AttendanceStatus;
  scan_method: string;
  scanned_by?: string;
  scanned_by_profile?: Profile;
  note?: string;
  created_at: string;
}

export interface StudentScheduleAttendance {
  id: string;
  student_id: string;
  student?: Student;
  class_id: string;
  class_room?: ClassRoom;
  schedule_id: string;
  schedule?: Schedule;
  teacher_id: string;
  teacher?: Teacher;
  attendance_date: string;
  status: AttendanceStatus;
  scanned_at: string;
  scanned_by?: string;
  scanned_by_profile?: Profile;
  note?: string;
  created_at: string;
}
