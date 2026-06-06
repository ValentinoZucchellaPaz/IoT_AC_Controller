#include <Arduino.h>

#include "app_config.hpp"
#include "network/network_client.hpp"
#include "network/network_types.hpp"
#include "sensors/sensor_service.hpp"
#include "interrupt_handlers.hpp"

auto constexpr SERIAL_BAUD_RATE = 115200;
auto constexpr DELAY_BETWEEN_TASKS_MS = 100;
volatile AcState acState = AcState::ACTIVE;

namespace {

    network::NetworkClient networkClient(app::CONFIG);
    sensors::SensorService sensorService(app::CONFIG);

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

void IRAM_ATTR buttonHandler()
{
    if (acState == AcState::ACTIVE)
    {
        acState = AcState::LIGHT_SLEEP;
        digitalWrite(app::CONFIG.ledPin, LOW);
    }
    else
    {
        acState = AcState::ACTIVE;
        digitalWrite(app::CONFIG.ledPin, HIGH);
    }
}

void setup()
{
    Serial.begin(SERIAL_BAUD_RATE);
    pinMode(app::CONFIG.ledPin, OUTPUT);
    //digitalWrite(app::CONFIG.ledPin, LOW);

    delay(DELAY_BETWEEN_TASKS_MS*10);  // Allow time for the serial monitor to connect before printing logs.
    Serial.println("[ESP32] Booting firmware...");

    pinMode(app::CONFIG.buttonPin, INPUT_PULLUP);

    attachInterrupt(
        digitalPinToInterrupt(app::CONFIG.buttonPin),
        buttonHandler,
        FALLING);

    //sensorService.begin();
    //networkClient.begin();
}

void loop()
{
    //handleTelemetryTask();
    //handleLedPollingTask();
    //delay(DELAY_BETWEEN_TASKS_MS);
}
