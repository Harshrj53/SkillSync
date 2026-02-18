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