import { Profile } from './user';

export type QROwnerType = 'teacher' | 'staff' | 'student';

export interface QRCodeData {
  id: string;
  owner_type: QROwnerType;
  owner_id: string; // UUID of teacher, staff, or student
  qr_token: string; // Unique token like QR-TEACHER-2026-X9K2L8M4
  is_active: boolean;
  issued_at: string;
  revoked_at?: string;
  created_at: string;
  // Denormalized/populated fields for display
  owner_name?: string;
  owner_code?: string;
  owner_details?: string;
}

export type ScanResultStatus =
  | 'success'
  | 'invalid_qr'
  | 'inactive_qr'
  | 'already_checked_in'
  | 'already_checked_out'
  | 'duplicate_scan'
  | 'wrong_schedule'
  | 'not_in_class'
  | 'unauthorized';

export interface QRScanLog {
  id: string;
  qr_token: string;
  owner_type: string;
  owner_id?: string;
  scan_type: string; // e.g. 'Absensi Guru', 'Absensi Siswa Harian', 'Absensi Kelas'
  scan_result: ScanResultStatus;
  scanned_by?: string;
  scanned_by_profile?: Profile;
  scanned_at: string;
  device_info?: string;
  ip_address?: string;
  note?: string;
  owner_name?: string;
}
