
---

# ✅ 2️⃣ `sequenceDiagram.md`

```md
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

# Sequence Diagram – Resume Creation Flow

## Main Flow

1. User logs into the platform
2. Frontend sends authentication request to backend
3. Backend validates credentials and returns JWT token

Resume Creation:
4. User enters resume details
5. Frontend sends POST request to backend API
6. Controller validates input
7. Service layer processes business logic
8. Repository saves resume data in database
9. Backend returns success response
10. Resume displayed on dashboard

Outcome:
- Resume successfully stored
- User can edit/view anytime