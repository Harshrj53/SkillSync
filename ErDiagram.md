# ER Diagram – SkillSync Database Design

## Tables

### Users
- user_id (PK)
- name
- email
- password
- role

### Resumes
- resume_id (PK)
- user_id (FK)
- education
- skills
- experience

### InterviewSessions
- session_id (PK)
- user_id (FK)
- questions
- score
- date

### Skills
- skill_id (PK)
- user_id (FK)
- skill_name
- progress

## Relationships
- Users → Resumes (1:1)
- Users → InterviewSessions (1:N)
- Users → Skills (1:N)