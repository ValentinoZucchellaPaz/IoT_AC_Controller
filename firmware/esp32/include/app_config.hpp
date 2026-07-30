#ifndef FIRMWARE_ESP32_INCLUDE_APP_CONFIG_HPP
#define FIRMWARE_ESP32_INCLUDE_APP_CONFIG_HPP

#include <Arduino.h>
#include <stdint.h>

#include "config_local.hpp"

namespace app {

/**
 * @brief Runtime configuration for the ESP32 firmware.
 *
 * This structure centralizes device identity, network settings,
 * GPIO selection, and polling intervals used by the application.
 */
struct AppConfig {
  const char* wifiSsid;
  const char* wifiPassword;
  const char* backendBaseUrl;
  const char* deviceId;
  const char* sensorId;

  const char* mqttBroker;
  uint16_t mqttPort;
  uint8_t ledPin;
  uint8_t buttonPin;
  uint8_t buttonUpPin;
  uint8_t buttonDownPin;
  uint8_t greenLedPin;
  uint8_t dhtSensorPin;
  
  unsigned long telemetryIntervalMs;
  unsigned long ledPollIntervalMs;
};

/**
 * @brief Default firmware configuration.
 *
 * Replace these placeholder values with your local Wi-Fi credentials,
 * backend base URL, and device identifiers before deploying.
 */
inline constexpr AppConfig CONFIG{
    WIFI_SSID,
    WIFI_PASS,
    BACKEND_URL,
    DEVICE_ID,
    SENSOR_ID,
    MQTT_BROKER,
    1883,
    2,
    4,
    13, // Button UP (increase desired temperature)
     14, // Button DOWN (decrease desired temperature)
    16, // Green LED (relay / cooling active)
    27, // DHT11 sensor
    10000UL,
    3000UL,
};

}  // namespace app
#endif  // FIRMWARE_ESP32_INCLUDE_APP_CONFIG_HPP
