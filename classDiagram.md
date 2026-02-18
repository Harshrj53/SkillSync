
---

# ✅ 3️⃣ `classDiagram.md`

```md
# Class Diagram – SkillSync

```mermaid
classDiagram
    class User {
        userId
        name
        email
        password
    }

    class Resume {
        resumeId
        education
        skills
        experience
    }

    class InterviewSession {
        sessionId
        questions
        score
    }

    User --> Resume
    User --> InterviewSession


# Class Diagram – MediAlert

## Main Classes

### User
- userId
- name
- email
- password
- role

### Medicine
- medicineId
- name
- dosage
- frequency
- userId

### Reminder
- reminderId
- medicineId
- time
- status

### HealthLog
- logId
- userId
- metricType
- value
- date

## Relationships
- User → Medicines (One-to-Many)
- Medicine → Reminders (One-to-Many)
- User → HealthLogs (One-to-Many)