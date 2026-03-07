alter table profiles enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table chat_rooms enable row level security;
alter table chat_messages enable row level security;
alter table notifications_previous_exams enable row level security;
alter table exams enable row level security;

create policy "read exams for all authenticated users"
on exams for select
to authenticated
using (true);

create policy "users read own profile"
on profiles for select
to authenticated
using (auth.uid() = id);

create policy "users update own profile"
on profiles for update
to authenticated
using (auth.uid() = id);

create policy "authenticated users read posts"
on posts for select
to authenticated
using (true);

create policy "authenticated users create posts"
on posts for insert
to authenticated
with check (auth.uid() = author_id);

create policy "authenticated users read comments"
on comments for select
to authenticated
using (true);

create policy "authenticated users create comments"
on comments for insert
to authenticated
with check (auth.uid() = author_id);

create policy "authenticated users read chat rooms"
on chat_rooms for select
to authenticated
using (true);

create policy "authenticated users read chat messages"
on chat_messages for select
to authenticated
using (true);

create policy "authenticated users create chat messages"
on chat_messages for insert
to authenticated
with check (auth.uid() = author_id);

create policy "authenticated users read notifications"
on notifications_previous_exams for select
to authenticated
using (true);
