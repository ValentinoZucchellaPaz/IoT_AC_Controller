#include <Arduino.h>

#include "app_config.hpp"
#include "network/network_client.hpp"
#include "network/network_types.hpp"
#include "power/power_manager.hpp"
#include "sensors/sensor_service.hpp"

auto constexpr SERIAL_BAUD_RATE = 115200;
auto constexpr DELAY_BETWEEN_TASKS_MS = 100;

auto constexpr HYSTERESIS_BAND = 1.5f;
auto constexpr HYSTERESIS_HALF = HYSTERESIS_BAND / 2.0f;

unsigned long lastSampleTime = 0;

unsigned long sleepInterval = 300000;
unsigned long activeInterval = 60000;

namespace
{

    sensors::SensorService sensorService(app::CONFIG);
    power::PowerManager powerManager(app::CONFIG.buttonPin);
    network::NetworkClient networkClient(app::CONFIG, sensorService);

    unsigned long lastTelemetryAt = -activeInterval;

    void handleTelemetryTask()
    {

        networkClient.ensureWifiConnection();

        if (!networkClient.isConnected())
        {
            Serial.println("[ESP32] Skipping telemetry because Wi-Fi is offline.");
            return;
        }
        const auto acState = powerManager.state();
        const sensors::SensorReading reading = sensorService.read(acState);
        networkClient.ensureMqttConnection();
        networkClient.postSensorReading(reading);
    }

    void syncTime()
    {
        configTime(-3 * 3600, 0, "pool.ntp.org", "time.nist.gov");

        if (!networkClient.isConnected())
        {
            Serial.println("[ESP32] Skipping NTP sync: Wi-Fi not connected.");
            return;
        }

        struct tm timeinfo;

        for (int attempt = 0; attempt < 3; attempt++)
        {
            if (getLocalTime(&timeinfo, 5000))
            {
                Serial.println("[ESP32] Time synced");
                return;
            }
            Serial.println("[ESP32] NTP timeout, retrying...");
        }

        Serial.println("[ESP32] NTP sync failed after 3 attempts.");
    }

    bool coolingActive = false;
    bool lastCoolingActive = false;

} // namespace
void setup()
{
    Serial.begin(SERIAL_BAUD_RATE);

    delay(DELAY_BETWEEN_TASKS_MS * 10); // Allow time for the serial monitor to connect before printing logs.
    Serial.println("[ESP32] Booting firmware...");

    pinMode(app::CONFIG.greenLedPin, OUTPUT);
    digitalWrite(app::CONFIG.greenLedPin, LOW);

    powerManager.begin();
    sensorService.begin();
    networkClient.begin();
    syncTime();
    if (networkClient.isConnected())
    {
        networkClient.ensureMqttConnection();
    }
}

void loop()
{
    networkClient.loop();

    sensorService.updateButtons();

    static unsigned long lastWifiRetry = 0;
    if (!networkClient.isConnected() && millis() - lastWifiRetry > 30000)
    {
        lastWifiRetry = millis();
        networkClient.ensureWifiConnection();
    }

    bool stateChanged = powerManager.update();

    if (stateChanged)
    {
        if (powerManager.state() == power::AcState::SLEEP)
        {
            coolingActive = false;
            lastCoolingActive = false;
            digitalWrite(app::CONFIG.greenLedPin, LOW);
        }
        handleTelemetryTask();
        sensorService.clearSamples();
    }

    const unsigned long samplingPeriod = powerManager.getSamplingPeriod();

    if (millis() - lastSampleTime >= samplingPeriod)
    {
        lastSampleTime += samplingPeriod;

        sensorService.temperatureSample();

        if (sensorService.isBufferFull())
        {
            sensorService.sampleCurrentHumidity();
            Serial.print(" Hum: ");
            Serial.println(sensorService.currentHumidity());
            Serial.println("BUFFER FULL");
            networkClient.ensureWifiConnection();

            handleTelemetryTask();

            sensorService.clearSamples();
        }

        size_t i = 0;

        if (sensorService.validSamples() > 0)
        {
            i = sensorService.validSamples() - 1;
        }

        Serial.print("Desired: ");
        Serial.print(sensorService.desiredTemperatures()[i]);

        Serial.print(" Temp: ");
        Serial.print(sensorService.currentTemperatures()[i]);

        float currentTemp = sensorService.currentTemperatures()[i];
        float desiredTemp = static_cast<float>(sensorService.desiredTemperatures()[i]);

        if (powerManager.state() == power::AcState::ACTIVE)
        {
            if (!coolingActive && currentTemp > desiredTemp + HYSTERESIS_HALF)
            {
                coolingActive = true;
            }
            else if (coolingActive && currentTemp < desiredTemp - HYSTERESIS_HALF)
            {
                coolingActive = false;
            }
        }
        else
        {
            coolingActive = false;
        }

        if (coolingActive != lastCoolingActive)
        {
            lastCoolingActive = coolingActive;
            digitalWrite(app::CONFIG.greenLedPin, coolingActive ? HIGH : LOW);
            Serial.print(" | ");
            Serial.print(coolingActive ? "COOLING ON" : "COOLING OFF");
        }

        Serial.println();
    }
}