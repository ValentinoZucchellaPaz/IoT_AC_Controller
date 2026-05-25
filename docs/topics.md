## Topics MQTT

### ESP32 → Backend

| Topic                | QoS | Retained | Description                         | Payload                                 |
|----------------------|-----|----------|-------------------------------------|-----------------------------------------|
| `data/{device_id}`   |  1  | No       | Sensor readings batch sent every 1  | [See example](#example-data-payload)    |
|                      |     |          | min (AC on) or 5 min (AC off)       |                                         |
| `status/{device_id}` |  0  | Yes      | Heartbeat to signal the device is   | [See examples](#examples-status-payload)|
|                      |     |          | online                              |                                         |


### Backend → ESP32

| Topic                | QoS | Retained | Description                         | Payload                                 |
|----------------------|-----|----------|-------------------------------------|-----------------------------------------|
| `cmd/{device_id}`    |  1  | No       | Commands sent to a specific device  | [See examples](#examples-cmd-payload)   |


#### Available commands:

| Command     | Description                                                        |
|-------------|--------------------------------------------------------------------|
| `get_data`  | Forces the immediate sending of data, even if 60 samples have not  |
|             | been reached since the last shipment.                              |
| `get_status`| Requests an immediate status publish on `status/{device_id}`       |



### Example data payload:
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

### Examples status payload:
```json
{
    "online": true,  
    "ts": 1634567890 
}

{
    "online": false,  
    "ts": 1634567890 
}
```

### Examples cmd payload:
```json
{ 
    "cmd": "get_data" 
}

{ 
    "cmd": "get_status" 
}
```



