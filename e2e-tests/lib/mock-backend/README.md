# Local backend for e2e-test

[./mock-backend.ts](mock-backend.ts) implements a simple backend that allows the
end-to-end tests to be run without needing a real backend.

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
export LAST_SEEN=$(date --iso-8601=seconds)
export NOW_TS=$(date +%s)
http POST http://localhost:8080/api/devices <<< '{"model":"PCA20065","lastSeen":"'$LAST_SEEN'"}' > working-device.json
export DEVICE_ID=`cat working-device.json | jq '.id' -r | tr -d '\n'`
export FINGERPRINT=`cat working-device.json | jq '.fingerprint' -r | tr -d '\n'`
# Report FOTA eligibility
http PUT http://localhost:8080/api/devices/state/$DEVICE_ID <<< '{
  "reported": {
    "14401:1.0": {
    "0": {
      "0": ["BOOT", "MODEM", "APP", "MDM_FULL"],
      "99": '$NOW_TS'
    }}
  }
}'
# Connection Information
http PUT http://localhost:8080/api/devices/state/$DEVICE_ID <<< '{
  "reported": {
    "14203:1.0": {
      "0": {
        "0": "LTE-M GPS",
        "1": 20,
        "2": -70,
        "3": 33181,
        "4": 52379652,
        "5": 24201,
        "6": "10.117.45.31",
        "11": 9,
        "99": '$NOW_TS'
      }
    }
  }
}'
echo http://localhost:8080/$FINGERPRINT
```
