# API calls

## GET

### Vacation

- `/api/vacation?id=<id>&query=<query>`
    - gets all vacations
    - if `id` is given, it gets vacation with given `id`
    - if `query` is given, it searches vacations containing `query` in name or
    description
    - `id` and `query` won't work together, `id` has priority
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

## POST

### Vacation

- `/api/vacation`
    - saves or updates given vacation in the database
    - if vacation contains `id`, it's edited, else added

### Trip

- `/api/trip`
    - saves or updates given trip in the database
    - if trip contains `id`, it's edited, else added

### Stop

- `/api/stop`
    - saves or updates given stop in the database
    - if stop contains `id`, it's edited, else added

## DELETE

### Vacation

- `/api/vacation?id=<id>`
    - deletes vacation with given `id`
    - deletes its trips and stops as well

### Trip

- `/api/trip?id=<id>`
    - deletes trip with given `id`
    - deletes its stops as well

### Stop

- `/api/stop?id=<id>`
    - deletes stop with given `id`
