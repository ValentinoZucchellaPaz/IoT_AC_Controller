## Payload ESP32 -> Backend

| Field                 | Type      | Description                                            |
|-----------------------|-----------|--------------------------------------------------------|
| device_id             | string    | Device identifier                                      |
|                       |           |                                                        |
| ac_state              | boolean   | AC state at the time of sending                        |
|                       |           |                                                        |
| desired_temperatures  | number[]  | Desired temperatures (max 60 samples). Only the first  |
|                       |           | valid_samples entries must be considered valid         |
|                       |           |                                                        |
| measured_temperatures | number[]  | Measured temperatures (max 60 samples). Only the first |
|                       |           | valid_samples entries must be considered valid         |
|                       |           |                                                        |
| valid_samples         | integer   | Number of valid samples in arrays                      |
|                       |           |                                                        |
| ts_end                | integer   | Unix timestamp of the last sample                      |

### Example payload:
```json
{
    "device_id": "ESP32_01",
    "ac_state": true,
    "desired_temperature": [22.0, 22.5, 23.0, ... ],
    "current_temperature": [23.4, 22.8, 22.5, ... ],
    "valid_samples": 3,
    "ts_end": 1634567890
}
```