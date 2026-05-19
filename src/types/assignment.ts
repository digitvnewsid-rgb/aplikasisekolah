import { Teacher, ClassRoom, Subject, Student } from './user';

export interface Assignment {
  id: string;
  teacher_id: string;
  teacher?: Teacher;
  class_id: string;
  class_room?: ClassRoom;
  subject_id: string;
  subject?: Subject;
  title: string;
  description?: string;
  due_date: string;
  attachment_url?: string;
  created_at: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  assignment?: Assignment;
  student_id: string;
  student?: Student;
  submission_text?: string;
  file_url?: string;
  submitted_at: string;
  grade?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late';
  created_at: string;
}
