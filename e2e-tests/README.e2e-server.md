# Local backend for e2e-test

[./lib/mock-backend.ts](mock-backend.ts) implements a simple backend that allows
the end-to-end tests to be run without needing a real backend.

You can also use this for local development.

```bash
# Start
npm run start:e2e
```

## API examples

### Create a new device

```bash
http POST http://localhost:8080/api/devices <<< '{"model":"PCA20065"}'
```

### Create a device that has already sent in data

```bash
LAST_SEEN=$(date --iso-8601=seconds)
http POST http://localhost:8080/api/devices <<< '{"model":"PCA20065","lastSeen":"'$LAST_SEEN'"}'
```
