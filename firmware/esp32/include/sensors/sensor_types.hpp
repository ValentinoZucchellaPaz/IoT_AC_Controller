#ifndef FIRMWARE_ESP32_INCLUDE_SENSORS_SENSOR_TYPES_HPP
#define FIRMWARE_ESP32_INCLUDE_SENSORS_SENSOR_TYPES_HPP

#include <Arduino.h>
#include "power/power_types.hpp"

namespace sensors {

/**
 * @brief Normalized sensor payload sent by the device.
 *
 * This structure represents a single telemetry sample ready to be
 * serialized and published to the backend service.
 */
struct SensorReading {
  String deviceId;
  //int current_temperature[60];
  //int desired_temperature[60];
  //int valid_samples;
  //time_t ts_end;
  power::AcState ac_state;
};

}  // namespace sensors

#endif  // FIRMWARE_ESP32_INCLUDE_SENSORS_SENSOR_TYPES_HPP
