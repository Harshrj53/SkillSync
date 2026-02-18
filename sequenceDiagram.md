# Sequence Diagram – Resume Creation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database

    U->>F: Enter resume details
    F->>B: POST /resume
    B->>DB: Save resume
    DB-->>B: Success
    B-->>F: Confirmation
    F-->>U: Resume displayed