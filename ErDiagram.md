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