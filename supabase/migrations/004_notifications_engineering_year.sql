-- Allows admin to scope notifications to a specific engineering year (FE / SE / TE / BE).
-- NULL means the notification is for all students of the target exam.
-- Safe to run multiple times.

ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS engineering_year TEXT;

CREATE INDEX IF NOT EXISTS idx_notifications_exam_eng_year
  ON notifications(exam_slug, engineering_year);

NOTIFY pgrst, 'reload schema';
