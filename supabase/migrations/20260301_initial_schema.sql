-- ==========================================
-- SCHOOL MANAGEMENT SYSTEM - SUPABASE SCHEMA
-- Versi Lengkap dengan RLS, Triggers, Functions
-- ==========================================

-- Mengaktifkan ekstensi yang diperlukan
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. PROFILES
-- ==========================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'staff', 'teacher', 'student', 'parent')),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_is_active ON profiles(is_active);

-- ==========================================
-- 2. TEACHERS
-- ==========================================
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    teacher_code TEXT UNIQUE NOT NULL,
    address TEXT,
    phone TEXT,
    salary_type TEXT DEFAULT 'monthly' CHECK (salary_type IN ('monthly', 'hourly')),
    base_salary NUMERIC(12, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_teachers_profile_id ON teachers(profile_id);
CREATE INDEX idx_teachers_code ON teachers(teacher_code);
CREATE INDEX idx_teachers_is_active ON teachers(is_active);

-- ==========================================
-- 3. STAFF
-- ==========================================
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    staff_code TEXT UNIQUE NOT NULL,
    position TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    base_salary NUMERIC(12, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_staff_profile_id ON staff(profile_id);
CREATE INDEX idx_staff_code ON staff(staff_code);
CREATE INDEX idx_staff_is_active ON staff(is_active);

-- ==========================================
-- 7. CLASSES (Dideklarasikan lebih dulu untuk foreign key students)
-- ==========================================
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    level TEXT NOT NULL,
    homeroom_teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
    academic_year TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_classes_homeroom ON classes(homeroom_teacher_id);
CREATE INDEX idx_classes_name ON classes(name);
CREATE INDEX idx_classes_academic_year ON classes(academic_year);
CREATE INDEX idx_classes_is_active ON classes(is_active);

-- ==========================================
-- 4. STUDENTS
-- ==========================================
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    student_code TEXT UNIQUE NOT NULL,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    parent_name TEXT,
    parent_phone TEXT,
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_students_profile_id ON students(profile_id);
CREATE INDEX idx_students_code ON students(student_code);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_is_active ON students(is_active);

-- ==========================================
-- 5. PARENTS
-- ==========================================
CREATE TABLE parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_parents_profile_id ON parents(profile_id);
CREATE INDEX idx_parents_phone ON parents(phone);

-- ==========================================
-- 6. STUDENT_PARENTS
-- ==========================================
CREATE TABLE student_parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
    relationship TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, parent_id)
);

CREATE INDEX idx_student_parents_student ON student_parents(student_id);
CREATE INDEX idx_student_parents_parent ON student_parents(parent_id);

-- ==========================================
-- 8. SUBJECTS
-- ==========================================
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_subjects_code ON subjects(code);
CREATE INDEX idx_subjects_is_active ON subjects(is_active);

-- ==========================================
-- 9. SCHEDULES
-- ==========================================
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_schedules_class ON schedules(class_id);
CREATE INDEX idx_schedules_teacher ON schedules(teacher_id);
CREATE INDEX idx_schedules_day ON schedules(day_of_week);
CREATE INDEX idx_schedules_is_active ON schedules(is_active);

-- ==========================================
-- 10. QR_CODES
-- ==========================================
CREATE TABLE qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_type TEXT NOT NULL CHECK (owner_type IN ('teacher', 'staff', 'student')),
    owner_id UUID NOT NULL,
    qr_token TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_qr_codes_token ON qr_codes(qr_token);
CREATE INDEX idx_qr_codes_owner ON qr_codes(owner_type, owner_id);
CREATE INDEX idx_qr_codes_is_active ON qr_codes(is_active);

-- ==========================================
-- 11. TEACHER_ATTENDANCE
-- ==========================================
CREATE TABLE teacher_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE,
    check_out TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL CHECK (status IN ('present', 'late', 'absent', 'permission', 'sick')),
    scan_method TEXT DEFAULT 'qr',
    scanned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(teacher_id, date)
);

CREATE INDEX idx_teacher_att_teacher_date ON teacher_attendance(teacher_id, date);
CREATE INDEX idx_teacher_att_date ON teacher_attendance(date);
CREATE INDEX idx_teacher_att_status ON teacher_attendance(status);

-- ==========================================
-- 12. STAFF_ATTENDANCE
-- ==========================================
CREATE TABLE staff_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE,
    check_out TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL CHECK (status IN ('present', 'late', 'absent', 'permission', 'sick')),
    scan_method TEXT DEFAULT 'qr',
    scanned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(staff_id, date)
);

CREATE INDEX idx_staff_att_staff_date ON staff_attendance(staff_id, date);
CREATE INDEX idx_staff_att_date ON staff_attendance(date);
CREATE INDEX idx_staff_att_status ON staff_attendance(status);

-- ==========================================
-- 13. STUDENT_DAILY_ATTENDANCE
-- ==========================================
CREATE TABLE student_daily_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE,
    check_out TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL CHECK (status IN ('present', 'late', 'absent', 'permission', 'sick')),
    scan_method TEXT DEFAULT 'qr',
    scanned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, date)
);

CREATE INDEX idx_student_daily_att_student_date ON student_daily_attendance(student_id, date);
CREATE INDEX idx_student_daily_att_class ON student_daily_attendance(class_id, date);
CREATE INDEX idx_student_daily_att_date ON student_daily_attendance(date);
CREATE INDEX idx_student_daily_att_status ON student_daily_attendance(status);

-- ==========================================
-- 14. STUDENT_SCHEDULE_ATTENDANCE
-- ==========================================
CREATE TABLE student_schedule_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'late', 'absent', 'permission', 'sick')),
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    scanned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, schedule_id, attendance_date)
);

CREATE INDEX idx_student_sched_att ON student_schedule_attendance(student_id, schedule_id, attendance_date);
CREATE INDEX idx_student_sched_teacher ON student_schedule_attendance(teacher_id, attendance_date);
CREATE INDEX idx_student_sched_date ON student_schedule_attendance(attendance_date);

-- ==========================================
-- 15. QR_SCAN_LOGS
-- ==========================================
CREATE TABLE qr_scan_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_token TEXT NOT NULL,
    owner_type TEXT NOT NULL,
    owner_id UUID,
    scan_type TEXT NOT NULL,
    scan_result TEXT NOT NULL CHECK (scan_result IN ('success', 'invalid_qr', 'inactive_qr', 'already_checked_in', 'already_checked_out', 'duplicate_scan', 'wrong_schedule', 'not_in_class', 'unauthorized')),
    scanned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    device_info TEXT,
    ip_address TEXT,
    note TEXT
);

CREATE INDEX idx_qr_scan_logs_token ON qr_scan_logs(qr_token);
CREATE INDEX idx_qr_scan_logs_time ON qr_scan_logs(scanned_at);
CREATE INDEX idx_qr_scan_logs_result ON qr_scan_logs(scan_result);

-- ==========================================
-- 16. ASSIGNMENTS
-- ==========================================
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_assignments_class ON assignments(class_id);
CREATE INDEX idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);

-- ==========================================
-- 17. ASSIGNMENT_SUBMISSIONS
-- ==========================================
CREATE TABLE assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    submission_text TEXT,
    file_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    grade NUMERIC(5, 2),
    feedback TEXT,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'late')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(assignment_id, student_id)
);

CREATE INDEX idx_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_submissions_student ON assignment_submissions(student_id);
CREATE INDEX idx_submissions_status ON assignment_submissions(status);

-- ==========================================
-- 18. TEACHER_PAYROLLS
-- ==========================================
CREATE TABLE teacher_payrolls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INT NOT NULL,
    base_salary NUMERIC(12, 2) DEFAULT 0.00,
    bonus NUMERIC(12, 2) DEFAULT 0.00,
    deduction NUMERIC(12, 2) DEFAULT 0.00,
    allowance NUMERIC(12, 2) DEFAULT 0.00,
    additional_honor NUMERIC(12, 2) DEFAULT 0.00,
    total_salary NUMERIC(12, 2) DEFAULT 0.00,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
    paid_at TIMESTAMP WITH TIME ZONE,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(teacher_id, month, year)
);

CREATE INDEX idx_payrolls_teacher ON teacher_payrolls(teacher_id, month, year);
CREATE INDEX idx_payrolls_status ON teacher_payrolls(status);
CREATE INDEX idx_payrolls_year_month ON teacher_payrolls(year, month);

-- ==========================================
-- 19. FINANCE_TRANSACTIONS
-- ==========================================
CREATE TABLE finance_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    payment_method TEXT NOT NULL,
    note TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_finance_date ON finance_transactions(transaction_date);
CREATE INDEX idx_finance_type ON finance_transactions(type);
CREATE INDEX idx_finance_category ON finance_transactions(category);
CREATE INDEX idx_finance_created_by ON finance_transactions(created_by);

-- ==========================================
-- 20. STUDENT_BILLS
-- ==========================================
CREATE TABLE student_bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    due_date DATE NOT NULL,
    status TEXT DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'pending', 'verified', 'rejected', 'overdue', 'paid')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_student_bills_student ON student_bills(student_id);
CREATE INDEX idx_student_bills_status ON student_bills(status);
CREATE INDEX idx_student_bills_due_date ON student_bills(due_date);

-- ==========================================
-- 21. STUDENT_PAYMENTS
-- ==========================================
CREATE TABLE student_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID REFERENCES student_bills(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    amount_paid NUMERIC(12, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    proof_url TEXT,
    verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_student_payments_bill ON student_payments(bill_id);
CREATE INDEX idx_student_payments_student ON student_payments(student_id);
CREATE INDEX idx_student_payments_status ON student_payments(status);
CREATE INDEX idx_student_payments_verified_by ON student_payments(verified_by);

-- ==========================================
-- 22. ANNOUNCEMENTS
-- ==========================================
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target_role TEXT NOT NULL CHECK (target_role IN ('all', 'teacher', 'staff', 'student', 'parent')),
    is_important BOOLEAN DEFAULT false,
    send_whatsapp BOOLEAN DEFAULT false,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_announcements_target ON announcements(target_role);
CREATE INDEX idx_announcements_created ON announcements(created_at);
CREATE INDEX idx_announcements_is_important ON announcements(is_important);

-- ==========================================
-- 23. WHATSAPP_NOTIFICATIONS
-- ==========================================
CREATE TABLE whatsapp_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_phone TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    related_type TEXT,
    related_id UUID,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_whatsapp_status ON whatsapp_notifications(status);
CREATE INDEX idx_whatsapp_related ON whatsapp_notifications(related_type, related_id);
CREATE INDEX idx_whatsapp_recipient ON whatsapp_notifications(recipient_phone);

-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

-- Function: Auto-update total_salary pada payroll
CREATE OR REPLACE FUNCTION calculate_total_salary()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_salary := COALESCE(NEW.base_salary, 0) + COALESCE(NEW.bonus, 0) + COALESCE(NEW.allowance, 0) + COALESCE(NEW.additional_honor, 0) - COALESCE(NEW.deduction, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_total_salary
    BEFORE INSERT OR UPDATE ON teacher_payrolls
    FOR EACH ROW
    EXECUTE FUNCTION calculate_total_salary();

-- Function: Auto-update bill status saat payment diverifikasi
CREATE OR REPLACE FUNCTION update_bill_on_payment_verification()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'verified' THEN
        UPDATE student_bills SET status = 'paid' WHERE id = NEW.bill_id;
    ELSIF NEW.status = 'rejected' THEN
        UPDATE student_bills SET status = 'rejected' WHERE id = NEW.bill_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_bill_on_payment
    AFTER UPDATE ON student_payments
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION update_bill_on_payment_verification();

-- Function: Audit log untuk aktivitas penting
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    record_id UUID,
    action TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    performed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_performed_at ON audit_logs(performed_at);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) - ENABLE
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_daily_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_schedule_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scan_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_payrolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS POLICIES - PROFILES
-- ==========================================

-- Super Admin & Admin: Full access
CREATE POLICY profiles_admin_all ON profiles
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

-- Staff: Read all profiles, update non-admin profiles
CREATE POLICY profiles_staff_read ON profiles
    FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

-- Teacher: Read own profile + students in their classes
CREATE POLICY profiles_teacher_read ON profiles
    FOR SELECT
    USING (
        auth.uid() IN (SELECT user_id FROM profiles WHERE role = 'teacher')
        AND (
            user_id = auth.uid()
            OR role IN ('student', 'teacher')
        )
    );

-- Student: Read own profile only
CREATE POLICY profiles_student_read ON profiles
    FOR SELECT
    USING (user_id = auth.uid());

-- Parent: Read own profile + children's profiles
CREATE POLICY profiles_parent_read ON profiles
    FOR SELECT
    USING (
        user_id = auth.uid()
        OR id IN (
            SELECT s.profile_id FROM students s
            JOIN student_parents sp ON sp.student_id = s.id
            JOIN parents p ON p.id = sp.parent_id
            WHERE p.user_id = auth.uid()
        )
    );

-- ==========================================
-- RLS POLICIES - TEACHERS
-- ==========================================

CREATE POLICY teachers_admin_all ON teachers
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY teachers_staff_read ON teachers
    FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

-- Teacher: Read own data only
CREATE POLICY teachers_self_read ON teachers
    FOR SELECT
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- ==========================================
-- RLS POLICIES - STAFF
-- ==========================================

CREATE POLICY staff_admin_all ON staff
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY staff_staff_read ON staff
    FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

-- Staff: Read own data
CREATE POLICY staff_self_read ON staff
    FOR SELECT
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- ==========================================
-- RLS POLICIES - STUDENTS
-- ==========================================

CREATE POLICY students_admin_all ON students
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY students_staff_read ON students
    FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

-- Teacher: Read students in their scheduled classes
CREATE POLICY students_teacher_read ON students
    FOR SELECT
    USING (
        auth.uid() IN (SELECT user_id FROM profiles WHERE role = 'teacher')
        AND class_id IN (
            SELECT class_id FROM schedules
            WHERE teacher_id IN (SELECT id FROM teachers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
        )
    );

-- Student: Read own data only
CREATE POLICY students_self_read ON students
    FOR SELECT
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Parent: Read children's data only
CREATE POLICY students_parent_read ON students
    FOR SELECT
    USING (
        id IN (
            SELECT sp.student_id FROM student_parents sp
            JOIN parents p ON p.id = sp.parent_id
            WHERE p.user_id = auth.uid()
        )
    );

-- ==========================================
-- RLS POLICIES - PARENTS & STUDENT_PARENTS
-- ==========================================

CREATE POLICY parents_admin_all ON parents
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY parents_staff_read ON parents
    FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

CREATE POLICY parents_self_read ON parents
    FOR SELECT
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY student_parents_admin_all ON student_parents
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY student_parents_staff_read ON student_parents
    FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

CREATE POLICY student_parents_parent_read ON student_parents
    FOR SELECT
    USING (
        parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid())
    );

-- ==========================================
-- RLS POLICIES - CLASSES & SUBJECTS
-- ==========================================

CREATE POLICY classes_admin_all ON classes
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY classes_staff_read ON classes
    FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

CREATE POLICY classes_teacher_read ON classes
    FOR SELECT
    USING (
        auth.uid() IN (SELECT user_id FROM profiles WHERE role = 'teacher')
        AND id IN (
            SELECT class_id FROM schedules
            WHERE teacher_id IN (SELECT id FROM teachers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
        )
    );

CREATE POLICY classes_student_read ON classes
    FOR SELECT
    USING (
        id IN (SELECT class_id FROM students WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
    );

CREATE POLICY classes_parent_read ON classes
    FOR SELECT
    USING (
        id IN (
            SELECT s.class_id FROM students s
            JOIN student_parents sp ON sp.student_id = s.id
            JOIN parents p ON p.id = sp.parent_id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY subjects_admin_all ON subjects
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY subjects_all_read ON subjects
    FOR SELECT
    USING (true);

-- ==========================================
-- RLS POLICIES - SCHEDULES
-- ==========================================

CREATE POLICY schedules_admin_all ON schedules
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY schedules_staff_read ON schedules
    FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

-- Teacher: Read own schedules
CREATE POLICY schedules_teacher_read ON schedules
    FOR SELECT
    USING (
        teacher_id IN (SELECT id FROM teachers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
    );

-- Student: Read class schedules
CREATE POLICY schedules_student_read ON schedules
    FOR SELECT
    USING (
        class_id IN (SELECT class_id FROM students WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
    );

-- Parent: Read children's class schedules
CREATE POLICY schedules_parent_read ON schedules
    FOR SELECT
    USING (
        class_id IN (
            SELECT s.class_id FROM students s
            JOIN student_parents sp ON sp.student_id = s.id
            JOIN parents p ON p.id = sp.parent_id
            WHERE p.user_id = auth.uid()
        )
    );

-- ==========================================
-- RLS POLICIES - QR CODES
-- ==========================================

CREATE POLICY qr_codes_admin_all ON qr_codes
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY qr_codes_staff_read ON qr_codes
    FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

-- Teacher: Read own QR code only
CREATE POLICY qr_codes_teacher_read ON qr_codes
    FOR SELECT
    USING (
        owner_type = 'teacher'
        AND owner_id IN (SELECT id FROM teachers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
    );

-- Student: Read own QR code only
CREATE POLICY qr_codes_student_read ON qr_codes
    FOR SELECT
    USING (
        owner_type = 'student'
        AND owner_id IN (SELECT id FROM students WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
    );

-- ==========================================
-- RLS POLICIES - ATTENDANCE TABLES
-- ==========================================

-- Teacher Attendance
CREATE POLICY teacher_att_admin_all ON teacher_attendance
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY teacher_att_staff_all ON teacher_attendance
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

CREATE POLICY teacher_att_teacher_read ON teacher_attendance
    FOR SELECT
    USING (
        teacher_id IN (SELECT id FROM teachers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
    );

-- Staff Attendance
CREATE POLICY staff_att_admin_all ON staff_attendance
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY staff_att_staff_all ON staff_attendance
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

CREATE POLICY staff_att_self_read ON staff_attendance
    FOR SELECT
    USING (
        staff_id IN (SELECT id FROM staff WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
    );

-- Student Daily Attendance
CREATE POLICY student_daily_att_admin_all ON student_daily_attendance
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY student_daily_att_staff_all ON student_daily_attendance
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

CREATE POLICY student_daily_att_teacher_read ON student_daily_attendance
    FOR SELECT
    USING (
        auth.uid() IN (SELECT user_id FROM profiles WHERE role = 'teacher')
        AND class_id IN (
            SELECT class_id FROM schedules
            WHERE teacher_id IN (SELECT id FROM teachers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
        )
    );

CREATE POLICY student_daily_att_student_read ON student_daily_attendance
    FOR SELECT
    USING (
        student_id IN (SELECT id FROM students WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
    );

CREATE POLICY student_daily_att_parent_read ON student_daily_attendance
    FOR SELECT
    USING (
        student_id IN (
            SELECT sp.student_id FROM student_parents sp
            JOIN parents p ON p.id = sp.parent_id
            WHERE p.user_id = auth.uid()
        )
    );

-- Student Schedule Attendance
CREATE POLICY student_sched_att_admin_all ON student_schedule_attendance
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY student_sched_att_staff_all ON student_schedule_attendance
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

CREATE POLICY student_sched_att_teacher_all ON student_schedule_attendance
    FOR ALL
    USING (
        teacher_id IN (SELECT id FROM teachers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
    );

CREATE POLICY student_sched_att_student_read ON student_schedule_attendance
    FOR SELECT
    USING (
        student_id IN (SELECT id FROM students WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
    );

CREATE POLICY student_sched_att_parent_read ON student_schedule_attendance
    FOR SELECT
    USING (
        student_id IN (
            SELECT sp.student_id FROM student_parents sp
            JOIN parents p ON p.id = sp.parent_id
            WHERE p.user_id = auth.uid()
        )
    );

-- QR Scan Logs
CREATE POLICY qr_scan_logs_admin_all ON qr_scan_logs
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY qr_scan_logs_staff_read ON qr_scan_logs
    FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

CREATE POLICY qr_scan_logs_teacher_read ON qr_scan_logs
    FOR SELECT
    USING (
        auth.uid() IN (SELECT user_id FROM profiles WHERE role = 'teacher')
        AND scanned_by IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- ==========================================
-- RLS POLICIES - ASSIGNMENTS & SUBMISSIONS
-- ==========================================

CREATE POLICY assignments_admin_all ON assignments
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY assignments_teacher_all ON assignments
    FOR ALL
    USING (
        teacher_id IN (SELECT id FROM teachers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
    );

CREATE POLICY assignments_staff_read ON assignments
    FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

CREATE POLICY assignments_student_read ON assignments
    FOR SELECT
    USING (
        class_id IN (SELECT class_id FROM students WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
    );

CREATE POLICY assignments_parent_read ON assignments
    FOR SELECT
    USING (
        class_id IN (
            SELECT s.class_id FROM students s
            JOIN student_parents sp ON sp.student_id = s.id
            JOIN parents p ON p.id = sp.parent_id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY submissions_admin_all ON assignment_submissions
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY submissions_teacher_all ON assignment_submissions
    FOR ALL
    USING (
        assignment_id IN (
            SELECT id FROM assignments
            WHERE teacher_id IN (SELECT id FROM teachers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
        )
    );

CREATE POLICY submissions_student_all ON assignment_submissions
    FOR ALL
    USING (
        student_id IN (SELECT id FROM students WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
    );

CREATE POLICY submissions_parent_read ON assignment_submissions
    FOR SELECT
    USING (
        student_id IN (
            SELECT sp.student_id FROM student_parents sp
            JOIN parents p ON p.id = sp.parent_id
            WHERE p.user_id = auth.uid()
        )
    );

-- ==========================================
-- RLS POLICIES - TEACHER PAYROLLS
-- ==========================================

CREATE POLICY payrolls_admin_all ON teacher_payrolls
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY payrolls_staff_read ON teacher_payrolls
    FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

-- Teacher: Read own payroll only
CREATE POLICY payrolls_teacher_read ON teacher_payrolls
    FOR SELECT
    USING (
        teacher_id IN (SELECT id FROM teachers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
    );

-- ==========================================
-- RLS POLICIES - FINANCE TRANSACTIONS
-- ==========================================

CREATE POLICY finance_admin_all ON finance_transactions
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY finance_staff_all ON finance_transactions
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

-- No read access for teacher, student, parent

-- ==========================================
-- RLS POLICIES - STUDENT BILLS & PAYMENTS
-- ==========================================

CREATE POLICY student_bills_admin_all ON student_bills
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY student_bills_staff_all ON student_bills
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

CREATE POLICY student_bills_student_read ON student_bills
    FOR SELECT
    USING (
        student_id IN (SELECT id FROM students WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
    );

CREATE POLICY student_bills_parent_read ON student_bills
    FOR SELECT
    USING (
        student_id IN (
            SELECT sp.student_id FROM student_parents sp
            JOIN parents p ON p.id = sp.parent_id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY student_payments_admin_all ON student_payments
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY student_payments_staff_all ON student_payments
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

CREATE POLICY student_payments_student_read ON student_payments
    FOR SELECT
    USING (
        student_id IN (SELECT id FROM students WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
    );

CREATE POLICY student_payments_parent_read ON student_payments
    FOR SELECT
    USING (
        student_id IN (
            SELECT sp.student_id FROM student_parents sp
            JOIN parents p ON p.id = sp.parent_id
            WHERE p.user_id = auth.uid()
        )
    );

-- ==========================================
-- RLS POLICIES - ANNOUNCEMENTS
-- ==========================================

CREATE POLICY announcements_admin_all ON announcements
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY announcements_staff_all ON announcements
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

CREATE POLICY announcements_teacher_read ON announcements
    FOR SELECT
    USING (
        target_role IN ('all', 'teacher')
    );

CREATE POLICY announcements_staff_read ON announcements
    FOR SELECT
    USING (
        target_role IN ('all', 'staff')
    );

CREATE POLICY announcements_student_read ON announcements
    FOR SELECT
    USING (
        target_role IN ('all', 'student')
    );

CREATE POLICY announcements_parent_read ON announcements
    FOR SELECT
    USING (
        target_role IN ('all', 'parent')
    );

-- ==========================================
-- RLS POLICIES - WHATSAPP NOTIFICATIONS
-- ==========================================

CREATE POLICY whatsapp_admin_all ON whatsapp_notifications
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY whatsapp_staff_read ON whatsapp_notifications
    FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

-- ==========================================
-- RLS POLICIES - AUDIT LOGS
-- ==========================================

CREATE POLICY audit_logs_admin_all ON audit_logs
    FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin')));

CREATE POLICY audit_logs_staff_read ON audit_logs
    FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE role IN ('super_admin', 'admin', 'staff')));

-- ==========================================
-- SEED DATA - CONTOH DATA AWAL
-- ==========================================

-- Insert Profiles
INSERT INTO profiles (id, user_id, full_name, phone, role, is_active, created_at) VALUES
('p-super', '00000000-0000-0000-0000-000000000001', 'Budi Santoso (Super Admin)', '081234567890', 'super_admin', true, NOW()),
('p-admin', '00000000-0000-0000-0000-000000000002', 'Siti Rahma (Admin Utama)', '081234567891', 'admin', true, NOW()),
('p-staff', '00000000-0000-0000-0000-000000000003', 'Agus Pratama (Staf TU)', '081234567892', 'staff', true, NOW()),
('p-teacher1', '00000000-0000-0000-0000-000000000004', 'Ahmad Dahlan, S.Pd', '081234567893', 'teacher', true, NOW()),
('p-teacher2', '00000000-0000-0000-0000-000000000005', 'Dewi Lestari, M.Si', '081234567894', 'teacher', true, NOW()),
('p-student1', '00000000-0000-0000-0000-000000000006', 'Rizky Kurniawan', '081234567895', 'student', true, NOW()),
('p-student2', '00000000-0000-0000-0000-000000000007', 'Putri Maharani', '081234567896', 'student', true, NOW()),
('p-parent1', '00000000-0000-0000-0000-000000000008', 'Hendra Wijaya', '081234567897', 'parent', true, NOW());

-- Insert Teachers
INSERT INTO teachers (id, profile_id, teacher_code, address, phone, salary_type, base_salary, is_active, created_at) VALUES
('t-1', 'p-teacher1', 'GUR-001', 'Jl. Merdeka No. 10', '081234567893', 'monthly', 4500000, true, NOW()),
('t-2', 'p-teacher2', 'GUR-002', 'Jl. Sudirman No. 45', '081234567894', 'monthly', 4800000, true, NOW());

-- Insert Staff
INSERT INTO staff (id, profile_id, staff_code, position, address, phone, base_salary, is_active, created_at) VALUES
('st-1', 'p-staff', 'STF-001', 'Kepala Tata Usaha', 'Jl. Veteran No. 12', '081234567892', 3800000, true, NOW());

-- Insert Classes
INSERT INTO classes (id, name, level, homeroom_teacher_id, academic_year, is_active, created_at) VALUES
('c-1', 'X-IPA 1', '10', 't-1', '2025/2026', true, NOW()),
('c-2', 'XI-IPS 2', '11', 't-2', '2025/2026', true, NOW());

-- Insert Students
INSERT INTO students (id, profile_id, student_code, class_id, parent_name, parent_phone, address, is_active, created_at) VALUES
('s-1', 'p-student1', 'NIS-2026001', 'c-1', 'Hendra Wijaya', '081234567897', 'Jl. Mawar No. 3', true, NOW()),
('s-2', 'p-student2', 'NIS-2026002', 'c-1', 'Bambang Pamungkas', '081234567898', 'Jl. Melati No. 7', true, NOW());

-- Insert Parents
INSERT INTO parents (id, profile_id, full_name, phone, address, created_at) VALUES
('pr-1', 'p-parent1', 'Hendra Wijaya', '081234567897', 'Jl. Mawar No. 3', NOW());

-- Insert Student Parents
INSERT INTO student_parents (id, student_id, parent_id, relationship, created_at) VALUES
('sp-1', 's-1', 'pr-1', 'Ayah', NOW());

-- Insert Subjects
INSERT INTO subjects (id, name, code, description, is_active, created_at) VALUES
('sub-1', 'Matematika Lanjut', 'MAT-101', 'Aljabar, Kalkulus Dasar, dan Trigonometri', true, NOW()),
('sub-2', 'Fisika Dasar', 'FIS-102', 'Mekanika, Termodinamika, dan Gelombang', true, NOW()),
('sub-3', 'Bahasa Inggris', 'ENG-103', 'Grammar, Reading comprehension, dan Conversation', true, NOW());

-- Insert Schedules
INSERT INTO schedules (id, class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room, is_active, created_at) VALUES
('sch-1', 'c-1', 'sub-1', 't-1', 'Senin', '08:00', '09:30', 'Ruang 101', true, NOW()),
('sch-2', 'c-1', 'sub-2', 't-2', 'Senin', '09:45', '11:15', 'Lab Fisika', true, NOW()),
('sch-3', 'c-2', 'sub-3', 't-1', 'Selasa', '08:00', '09:30', 'Ruang 202', true, NOW());

-- Insert QR Codes (Token Unik Tanpa Data Sensitif)
INSERT INTO qr_codes (id, owner_type, owner_id, qr_token, is_active, issued_at, created_at) VALUES
('qr-1', 'teacher', 't-1', 'QR-TEACHER-2026-X9K2L8M4', true, NOW(), NOW()),
('qr-2', 'teacher', 't-2', 'QR-TEACHER-2026-T7K2L9M1', true, NOW(), NOW()),
('qr-3', 'staff', 'st-1', 'QR-STAFF-2026-A3N8V6B2', true, NOW(), NOW()),
('qr-4', 'student', 's-1', 'QR-STUDENT-2026-H7Q2P1Z9', true, NOW(), NOW()),
('qr-5', 'student', 's-2', 'QR-STUDENT-2026-S4Q9P2Z1', true, NOW(), NOW());

-- Insert Assignments
INSERT INTO assignments (id, teacher_id, class_id, subject_id, title, description, due_date, attachment_url, created_at) VALUES
('ass-1', 't-1', 'c-1', 'sub-1', 'Tugas 1: Persamaan Kuadrat & Aljabar', 'Kerjakan soal latihan halaman 45 nomor 1 sampai 10 beserta cara penyelesaiannya.', '2026-03-15T23:59:59Z', 'https://files.sekolah.edu/tugas/matematika-kd1.pdf', NOW()),
('ass-2', 't-2', 'c-1', 'sub-2', 'Laporan Praktikum Hukum Newton', 'Buat laporan hasil praktikum gerak jatuh bebas sesuai format standar laboratorium.', '2026-03-18T23:59:59Z', 'https://files.sekolah.edu/tugas/fisika-lab.pdf', NOW());

-- Insert Assignment Submissions
INSERT INTO assignment_submissions (id, assignment_id, student_id, submission_text, file_url, submitted_at, grade, feedback, status, created_at) VALUES
('subm-1', 'ass-1', 's-1', 'Berikut adalah jawaban untuk latihan soal halaman 45. Semua langkah telah dijabarkan dengan lengkap.', 'https://files.sekolah.edu/submissions/rizky-matematika.pdf', '2026-03-10T14:30:00Z', 92, 'Pekerjaan sangat rapi dan langkah penyelesaian tepat. Pertahankan!', 'graded', NOW());

-- Insert Teacher Payrolls
INSERT INTO teacher_payrolls (id, teacher_id, month, year, base_salary, bonus, deduction, allowance, additional_honor, total_salary, status, paid_at, note, created_at) VALUES
('pay-1', 't-1', 3, 2026, 4500000, 500000, 0, 300000, 250000, 5550000, 'paid', '2026-03-01T09:00:00Z', 'Gaji bulan Maret 2026 beserta tunjangan wali kelas', NOW()),
('pay-2', 't-2', 3, 2026, 4800000, 400000, 50000, 300000, 0, 5450000, 'pending', NULL, 'Gaji bulan Maret 2026', NOW());

-- Insert Finance Transactions
INSERT INTO finance_transactions (id, type, category, title, amount, transaction_date, payment_method, note, created_by, created_at) VALUES
('fin-1', 'income', 'SPP Bulanan', 'Pembayaran SPP Maret - Rizky Kurniawan', 500000, '2026-03-02', 'Transfer Bank', 'SPP Kelas X-IPA 1', 'p-admin', NOW()),
('fin-2', 'income', 'Uang Gedung', 'Cicilan Gedung - Siswa Baru', 2500000, '2026-03-03', 'Tunai', 'Gelombang 1', 'p-staff', NOW()),
('fin-3', 'expense', 'Operasional', 'Pembayaran Tagihan Listrik & Internet Sekolah', 1800000, '2026-03-05', 'Transfer Bank', 'Bulan Februari 2026', 'p-admin', NOW()),
('fin-4', 'expense', 'Peralatan Lab', 'Pengadaan Mikroskop & Tabung Reaksi', 3200000, '2026-03-08', 'Transfer Bank', 'Kebutuhan Lab Biologi & Fisika', 'p-admin', NOW());

-- Insert Student Bills
INSERT INTO student_bills (id, student_id, title, category, amount, due_date, status, created_at) VALUES
('bill-1', 's-1', 'SPP Bulan Maret 2026', 'SPP Bulanan', 500000, '2026-03-10', 'paid', NOW()),
('bill-2', 's-1', 'Iuran Kegiatan Ekstrakurikuler & Studi Wisata', 'Kegiatan', 350000, '2026-03-25', 'unpaid', NOW()),
('bill-3', 's-2', 'SPP Bulan Maret 2026', 'SPP Bulanan', 500000, '2026-03-10', 'pending', NOW());

-- Insert Student Payments
INSERT INTO student_payments (id, bill_id, student_id, amount_paid, payment_method, payment_date, proof_url, verified_by, status, created_at) VALUES
('spay-1', 'bill-1', 's-1', 500000, 'Transfer Bank BCA', '2026-03-02T10:00:00Z', 'https://files.sekolah.edu/proofs/rizky-spp-mar.jpg', 'p-admin', 'verified', NOW()),
('spay-2', 'bill-3', 's-2', 500000, 'Transfer Bank Mandiri', '2026-03-09T15:20:00Z', 'https://files.sekolah.edu/proofs/putri-spp-mar.jpg', NULL, 'pending', NOW());

-- Insert Announcements
INSERT INTO announcements (id, title, content, target_role, is_important, send_whatsapp, created_by, created_at) VALUES
('ann-1', 'Pelaksanaan Ujian Tengah Semester (UTS) Genap 2026', 'Diberitahukan kepada seluruh siswa dan guru bahwa UTS Genap Tahun Ajaran 2025/2026 akan dilaksanakan mulai tanggal 20 Maret hingga 28 Maret 2026. Harap mempersiapkan diri dengan baik.', 'all', true, true, 'p-admin', NOW()),
('ann-2', 'Rapat Koordinasi Persiapan Akreditasi Sekolah', 'Kepada seluruh Guru dan Staf Tata Usaha, diwajibkan hadir dalam rapat koordinasi persiapan akreditasi yang akan diadakan pada hari Jumat, 13 Maret 2026 pukul 13.30 WIB di Ruang Rapat Utama.', 'teacher', true, true, 'p-super', NOW()),
('ann-3', 'Jadwal Pengambilan Raport Siswa', 'Pengambilan raport bayangan akan dilaksanakan oleh orang tua/wali murid pada tanggal 4 April 2026 mulai pukul 08.00 WIB di kelas masing-masing.', 'parent', false, true, 'p-admin', NOW());

-- Insert WhatsApp Notifications
INSERT INTO whatsapp_notifications (id, recipient_phone, message, status, related_type, related_id, sent_at, created_at) VALUES
('wa-1', '081234567895', '[PENTING] Pelaksanaan Ujian Tengah Semester (UTS) Genap 2026 akan dilaksanakan mulai 20 Maret 2026.', 'sent', 'announcement', 'ann-1', '2026-03-01T08:01:00Z', NOW()),
('wa-2', '081234567897', '[TAGIHAN] Yth. Orang Tua Rizky Kurniawan, terdapat tagihan baru: Iuran Kegiatan Ekstrakurikuler sebesar Rp350.000 jatuh tempo 25 Maret 2026.', 'sent', 'bill', 'bill-2', '2026-03-01T07:05:00Z', NOW()),
('wa-3', '081234567893', '[RAPAT] Yth. Ahmad Dahlan, S.Pd, Rapat Koordinasi Persiapan Akreditasi diadakan Jumat, 13 Maret 2026 pukul 13.30 WIB.', 'sent', 'announcement', 'ann-2', '2026-03-05T09:02:00Z', NOW());

-- Insert QR Scan Logs
INSERT INTO qr_scan_logs (id, qr_token, owner_type, owner_id, scan_type, scan_result, scanned_by, scanned_at, device_info, ip_address, note) VALUES
('log-1', 'QR-TEACHER-2026-X9K2L8M4', 'teacher', 't-1', 'Absensi Guru', 'success', 'p-staff', '2026-03-10T06:55:00Z', 'Scanner Admin Ruang TU', '192.168.1.10', 'Check-in berhasil'),
('log-2', 'QR-STUDENT-2026-H7Q2P1Z9', 'student', 's-1', 'Absensi Siswa Harian', 'success', 'p-staff', '2026-03-10T06:58:00Z', 'Scanner Gerbang Utama', '192.168.1.12', 'Check-in berhasil'),
('log-3', 'QR-TEACHER-2026-X9K2L8M4', 'teacher', 't-1', 'Absensi Guru', 'already_checked_in', 'p-staff', '2026-03-10T07:05:00Z', 'Scanner Admin Ruang TU', '192.168.1.10', 'Duplicate scan check-in');
