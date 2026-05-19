import { Teacher } from './user';

export interface TeacherPayroll {
  id: string;
  teacher_id: string;
  teacher?: Teacher;
  month: number; // 1 - 12
  year: number;
  base_salary: number;
  bonus: number;
  deduction: number;
  allowance: number;
  additional_honor: number;
  total_salary: number;
  status: 'pending' | 'paid';
  paid_at?: string;
  note?: string;
  created_at: string;
}
