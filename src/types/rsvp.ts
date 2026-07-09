export type AttendanceStatus =
  | "attending"
  | "not_attending"

export type RSVP = {
  id: string;
  full_name: string;
  phone: string;
  attendance_status: AttendanceStatus;
  guest_count: number;
  note: string | null;
  created_at: string;
  updated_at: string;
};