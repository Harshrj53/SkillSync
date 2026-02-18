
---

# ✅ 4️⃣ `ErDiagram.md`

```md
# ER Diagram – SkillSync

```mermaid
erDiagram
    USERS ||--|| RESUMES : has
    USERS ||--o{ INTERVIEW_SESSIONS : participates
    USERS ||--o{ SKILLS : tracks

    USERS {
        int user_id
        string name
        string email
    }

    RESUMES {
        int resume_id
        int user_id
        string education
    }

    INTERVIEW_SESSIONS {
        int session_id
        int user_id
        int score
    }

    SKILLS {
        int skill_id
        int user_id
        string skill_name
    }

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