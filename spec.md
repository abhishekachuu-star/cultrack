# CulTrack - College Cultural Festival Management Platform

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Home/landing page with login and register options
- Role-based authentication: Admin, Student, Teacher, Judge
- Separate login and register pages (with role selection)
- Role-based dashboards after login:
  - Admin: manage programs, view all registrations, update scores
  - Student: register for programs, view live scoreboard
  - Teacher: view registrations, view scoreboard
  - Judge: submit scores for programs, view scoreboard
- Program Registration page: list of ongoing programs with available slots, register/get a slot
- Live Scoreboard page: real-time leaderboard showing program scores and rankings

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: User management (register/login with roles), Program management (CRUD), Slot booking, Score management
2. Frontend:
   - Home page with hero section, login and register CTAs
   - Login page with role selector (Admin/Student/Teacher/Judge)
   - Register page with role selector and form fields
   - Dashboard page (role-aware) with navigation cards for Program Registration and Live Scoreboard
   - Program Registration page: list programs with slot counts, register button
   - Live Scoreboard page: table/leaderboard of programs with scores
   - Admin panel: create programs, manage scores
   - Judge panel: submit scores per program
