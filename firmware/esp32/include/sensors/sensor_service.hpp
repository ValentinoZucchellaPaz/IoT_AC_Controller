#ifndef FIRMWARE_ESP32_INCLUDE_SENSORS_SENSOR_SERVICE_HPP
#define FIRMWARE_ESP32_INCLUDE_SENSORS_SENSOR_SERVICE_HPP

#include <DHT.h>
#include "app_config.hpp"
#include "sensors/sensor_types.hpp"


namespace sensors {

/**
 * @brief Provides sensor lifecycle management and reading acquisition.
 *
 * The current implementation produces mock telemetry values for
 * integration purposes. A real sensor driver can replace the
 * implementation without affecting the rest of the application.
 */
class SensorService {
public:

    /**
     * @brief Creates the service with the shared application configuration.
     *
     * @param config Immutable firmware configuration.
     */
    SensorService(const app::AppConfig& config);

    /**
     * @brief Initializes the sensor subsystem.
     */
    void begin();

    /**
     * @brief Reads the current sensor values.
     *
     * @return SensorReading Telemetry sample ready to publish.
     */
    SensorReading read(power::AcState acState) const;

    /**
     * @brief Overrides the desired temperature with a value received
     * from the backend via MQTT command topic.
     *
     * When active, readDesiredTemperature() returns this value
     * instead of reading the potentiometer. Resets on reboot.
     */
    void applyRemoteDesiredTemperature(int temp);

    /**
     * @brief Reverts to local potentiometer control.
     */
    void revertToLocalControl();

    /**
     * @brief Polls the temperature-adjustment buttons with debounce.
     *
     * Should be called frequently from loop(). Reads the UP/DOWN
     * button states, applies debounce, and adjusts the local desired
     * temperature accordingly. Also reverts from remote control to
     * local when a button is pressed.
     */
    void updateButtons();

    /**
     * @brief Returns the current desired temperature.
     *
     * Returns the locally stored value (adjusted by buttons) or the
     * remote override if one has been applied via the MQTT command topic.
     *
     * @return Desired temperature in degrees Celsius.
     */
    int readDesiredTemperature() const;

    /**
     * @brief Reads the current ambient temperature from the DHT11 sensor.
     *
     * @return Temperature in degrees Celsius, or -999.0 if reading fails.
     */
    float readCurrentTemperature();

    /**
     * @brief Samples and stores current humidity from DHT11.
     *
     * Updates the internal humidity value with the latest
     * sensor reading, or stores -999.0 if reading fails.
     */
    float sampleCurrentHumidity();

    /**
     * @brief Captures and stores one telemetry sample.
     *
     * Each sample contains:
     * - desired temperature from the potentiometer
     * - measured temperature from the DHT11
     *
     * Samples are appended to the internal buffers until
     * MAX_SAMPLES is reached. Once full, no additional
     * samples are stored until clearSamples() is called.
     */
    void temperatureSample();

    /**
     * @brief Indicates whether the sample buffer is full.
     *
     * @return true if MAX_SAMPLES have been collected.
     */
    bool isBufferFull() const;

    /**
     * @brief Resets the valid sample counter.
     *
     * Marks all previously stored samples as invalid by setting
     * the number of valid samples to zero.
     *
     * Buffer contents are not erased and may still contain old data.
     */
    void clearSamples();

    /**
     * @brief Returns the number of valid samples currently stored.
     *
     * @return Number of valid samples.
     */
    size_t validSamples() const;

    /**
     * @brief Returns a pointer to the internal sample buffer.
     *
     * Only the first validSamples() positions contain valid data.
     *
     * @return Pointer to desired temperature samples.
     */
    const int* desiredTemperatures() const;

    /**
     * @brief Reads current temperature from DHT11.
     * 
     * Only the first validSamples() positions contain valid data.
     *
     * @return Temperature in Celsius, or -999.0 if reading fails.
     */
    const float* currentTemperatures() const;

    /**
     * @brief Reads current humidity from DHT11.
     * 
     * Only the first validSamples() positions contain valid data.
     *
     * @return Humidity percentage, or -999.0 if reading fails.
     */
    float currentHumidity() const;



private:
    static constexpr size_t MAX_SAMPLES = 20;

    int localDesiredTemperature_{24};
    int remoteDesiredTemperature_{0};
    bool useRemoteTemperature_{false};

    int desiredTemperatures_[MAX_SAMPLES];
    float currentTemperatures_[MAX_SAMPLES];
    float humiditySample_;

    size_t validSamples_;

    const app::AppConfig& config_;

    // Allowed user-selected temperature range.
    static constexpr int MIN_TEMPERATURE = 15;
    static constexpr int MAX_TEMPERATURE = 32;

    // Button debounce
    static constexpr unsigned long BUTTON_DEBOUNCE_MS = 200;
    unsigned long lastButtonTime_{0};
    static volatile bool buttonUpPressed_;
    static volatile bool buttonDownPressed_;

    // ISR trampolines
    static void IRAM_ATTR isrUp();
    static void IRAM_ATTR isrDown();

    // DHT sensor instance for reading temperature.
    DHT dht_;

};

}  // namespace sensors

#endif  // FIRMWARE_ESP32_INCLUDE_SENSORS_SENSOR_SERVICE_HPP