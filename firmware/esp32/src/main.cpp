#include <Arduino.h>

#include "app_config.hpp"
#include "network/network_client.hpp"
#include "network/network_types.hpp"
#include "sensors/sensor_service.hpp"
#include "power/power_manager.hpp"

auto constexpr SERIAL_BAUD_RATE = 115200;
auto constexpr DELAY_BETWEEN_TASKS_MS = 100;
auto constexpr DEBOUNCE_MS = 200;

namespace {

    power::PowerManager powerManager(app::CONFIG.buttonPin);
    network::NetworkClient networkClient(app::CONFIG);
    sensors::SensorService sensorService(app::CONFIG, powerManager);
   

    unsigned long lastTelemetryAt = 0;
    unsigned long lastLedPollAt = 0;
    network::LedState currentLedState{false, false};

    void applyLedState(const network::LedState& ledState)
    {
        digitalWrite(app::CONFIG.ledPin, ledState.enabled ? HIGH : LOW);
    }

    void handleTelemetryTask()
    {
        if (millis() - lastTelemetryAt < app::CONFIG.telemetryIntervalMs)
        {
            return;
        }

        lastTelemetryAt = millis();
        networkClient.ensureWifiConnection();

        if (!networkClient.isConnected())
        {
            Serial.println("[ESP32] Skipping telemetry because Wi-Fi is offline.");
            return;
        }

        const sensors::SensorReading reading = sensorService.read();
        networkClient.postSensorReading(reading);
    }

    void handleLedPollingTask()
    {
        if (millis() - lastLedPollAt < app::CONFIG.ledPollIntervalMs)
        {
            return;
        }

        lastLedPollAt = millis();
        networkClient.ensureWifiConnection();

        if (!networkClient.isConnected())
        {
            Serial.println("[ESP32] Skipping LED polling because Wi-Fi is offline.");
            return;
        }

        const network::LedState nextState = networkClient.fetchLedState();
        if (!nextState.known)
        {
            return;
        }

        if (!currentLedState.known || currentLedState.enabled != nextState.enabled)
        {
            applyLedState(nextState);
            Serial.println(String("[ESP32] LED changed to ") + (nextState.enabled ? "ON" : "OFF"));
        }

        currentLedState = nextState;
    }

}  // namespace

void setup()
{
    Serial.begin(SERIAL_BAUD_RATE);

    delay(DELAY_BETWEEN_TASKS_MS*10);  // Allow time for the serial monitor to connect before printing logs.
    Serial.println("[ESP32] Booting firmware...");

    powerManager.begin();
    //sensorService.begin();
    //networkClient.begin();
}

void loop()
{
    powerManager.update();
}