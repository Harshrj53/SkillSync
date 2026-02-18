# Class Diagram – SkillSync

```mermaid
classDiagram
    class User {
        userId
        name
        email
        password
        role
    }

    class Resume {
        resumeId
        userId
        education
        skills
        experience
    }

    class InterviewSession {
        sessionId
        userId
        questions
        score
    }

    class SkillTracker {
        skillId
        userId
        skillName
        progress
    }

    User --> Resume
    User --> InterviewSession
    User --> SkillTracker