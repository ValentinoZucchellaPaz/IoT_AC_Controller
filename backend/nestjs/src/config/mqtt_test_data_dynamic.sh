#!/bin/bash
# El siguiente codigo publica al broker una serie de mediciones, de manera que cuando levante el backend va a poblar la db, permitiendo hacer pruebas

BROKER="localhost"
DATA_TOPIC="sensor/datos"
HEALTH_TOPIC="sensor/status"

# Ayer a las 00:00:00
BASE_TS=$(date -d "yesterday 00:00:00" +%s)

publish() {
  mosquitto_pub -h "$BROKER" -t "$DATA_TOPIC" -m "$1"
}

publish_health() {
  mosquitto_pub -h "$BROKER" -t "$HEALTH_TOPIC" -m "$1"
}

# Simula conexión inicial del ESP32
publish_health "{\"device_id\":\"ESP32_01\",\"status\":true}"

# OFF
publish "{\"device_id\":\"ESP32_01\",\"ac_state\":false,\"desired_temperature\":[22],\"current_humidity\":22,\"current_temperature\":[28],\"valid_samples\":1,\"ts_end\":$((BASE_TS + 0))}"
publish "{\"device_id\":\"ESP32_01\",\"ac_state\":false,\"desired_temperature\":[22],\"current_humidity\":22,\"current_temperature\":[28.1],\"valid_samples\":1,\"ts_end\":$((BASE_TS + 300))}"

# HIGH EFFICIENCY
publish "{\"device_id\":\"ESP32_01\",\"ac_state\":true,\"desired_temperature\":[22],\"current_humidity\":22,\"current_temperature\":[28],\"valid_samples\":1,\"ts_end\":$((BASE_TS + 600))}"
publish "{\"device_id\":\"ESP32_01\",\"ac_state\":true,\"desired_temperature\":[22],\"current_humidity\":22,\"current_temperature\":[24],\"valid_samples\":1,\"ts_end\":$((BASE_TS + 900))}"
publish "{\"device_id\":\"ESP32_01\",\"ac_state\":true,\"desired_temperature\":[22],\"current_humidity\":22,\"current_temperature\":[22],\"valid_samples\":1,\"ts_end\":$((BASE_TS + 1200))}"
publish "{\"device_id\":\"ESP32_01\",\"ac_state\":false,\"desired_temperature\":[22],\"current_humidity\":22,\"current_temperature\":[22],\"valid_samples\":1,\"ts_end\":$((BASE_TS + 1500))}"

# MEDIUM EFFICIENCY
publish "{\"device_id\":\"ESP32_01\",\"ac_state\":true,\"desired_temperature\":[22],\"current_humidity\":22,\"current_temperature\":[30],\"valid_samples\":1,\"ts_end\":$((BASE_TS + 1800))}"
publish "{\"device_id\":\"ESP32_01\",\"ac_state\":true,\"desired_temperature\":[22],\"current_humidity\":22,\"current_temperature\":[28],\"valid_samples\":1,\"ts_end\":$((BASE_TS + 2100))}"
publish "{\"device_id\":\"ESP32_01\",\"ac_state\":true,\"desired_temperature\":[22],\"current_humidity\":22,\"current_temperature\":[26],\"valid_samples\":1,\"ts_end\":$((BASE_TS + 2400))}"
publish "{\"device_id\":\"ESP32_01\",\"ac_state\":true,\"desired_temperature\":[22],\"current_humidity\":22,\"current_temperature\":[24],\"valid_samples\":1,\"ts_end\":$((BASE_TS + 2700))}"
publish "{\"device_id\":\"ESP32_01\",\"ac_state\":true,\"desired_temperature\":[22],\"current_humidity\":22,\"current_temperature\":[22],\"valid_samples\":1,\"ts_end\":$((BASE_TS + 3300))}"
publish "{\"device_id\":\"ESP32_01\",\"ac_state\":false,\"desired_temperature\":[22],\"current_humidity\":22,\"current_temperature\":[22],\"valid_samples\":1,\"ts_end\":$((BASE_TS + 3600))}"

# LOW EFFICIENCY
publish "{\"device_id\":\"ESP32_01\",\"ac_state\":true,\"desired_temperature\":[22],\"current_humidity\":22,\"current_temperature\":[31],\"valid_samples\":1,\"ts_end\":$((BASE_TS + 3900))}"
publish "{\"device_id\":\"ESP32_01\",\"ac_state\":true,\"desired_temperature\":[22],\"current_humidity\":22,\"current_temperature\":[29],\"valid_samples\":1,\"ts_end\":$((BASE_TS + 4200))}"
publish "{\"device_id\":\"ESP32_01\",\"ac_state\":true,\"desired_temperature\":[22],\"current_humidity\":22,\"current_temperature\":[28],\"valid_samples\":1,\"ts_end\":$((BASE_TS + 4500))}"
publish "{\"device_id\":\"ESP32_01\",\"ac_state\":true,\"desired_temperature\":[22],\"current_humidity\":22,\"current_temperature\":[27],\"valid_samples\":1,\"ts_end\":$((BASE_TS + 4800))}"
publish "{\"device_id\":\"ESP32_01\",\"ac_state\":false,\"desired_temperature\":[22],\"current_humidity\":22,\"current_temperature\":[27],\"valid_samples\":1,\"ts_end\":$((BASE_TS + 5100))}"

echo "Test data published using BASE_TS=$BASE_TS"
