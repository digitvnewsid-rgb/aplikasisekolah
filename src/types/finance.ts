import { Student, Profile } from './user';

export interface FinanceTransaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  title: string;
  amount: number;
  transaction_date: string;
  payment_method: string;
  note?: string;
  created_by?: string;
  created_by_profile?: Profile;
  created_at: string;
}

export type StudentBillStatus = 'unpaid' | 'pending' | 'verified' | 'rejected' | 'overdue' | 'paid';

export interface StudentBill {
  id: string;
  student_id: string;
  student?: Student;
  title: string;
  category: string;
  amount: number;
  due_date: string;
  status: StudentBillStatus;
  created_at: string;
}

export interface StudentPayment {
  id: string;
  bill_id: string;
  bill?: StudentBill;
  student_id: string;
  student?: Student;
  amount_paid: number;
  payment_method: string;
  payment_date: string;
  proof_url?: string;
  verified_by?: string;
  verified_by_profile?: Profile;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target_role: 'all' | 'teacher' | 'staff' | 'student' | 'parent';
  is_important: boolean;
  send_whatsapp: boolean;
  created_by?: string;
  created_by_profile?: Profile;
  created_at: string;
}

export interface WhatsAppNotification {
  id: string;
  recipient_phone: string;
  message: string;
  status: 'pending' | 'sent' | 'failed';
  related_type?: string;
  related_id?: string;
  sent_at?: string;
  created_at: string;
}
