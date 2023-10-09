# API calls

## GET

### Vacation

- `/api/vacation`
    - gets all vacations
- `/api/vacation/upcoming`
    - gets all upcoming vacations (but also ongoing - might need change name)
- `/api/vacation/past`
    - gets all past vacations

### Trip

- `/api/trip?vacation_id=<id>`:
    - gets all trips
    - if `vacation_id` is given, gets all vacation trips

### Stop

- `/api/stop?trip_id=<id>`:
    - gets all stops
    - if `trip_id` is given, gets all trip stops
