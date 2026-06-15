#include <Arduino.h>

#include "app_config.hpp"
#include "network/network_client.hpp"
#include "network/network_types.hpp"
#include "sensors/sensor_service.hpp"
#include "power/power_manager.hpp"

auto constexpr SERIAL_BAUD_RATE = 115200;
auto constexpr DELAY_BETWEEN_TASKS_MS = 100;
auto constexpr DEBOUNCE_MS = 200;
unsigned long lastSampleTime = 0;

unsigned long sleepInterval = 300000;
unsigned long activeInterval = 60000;

namespace {

    power::PowerManager powerManager(app::CONFIG.buttonPin);
    network::NetworkClient networkClient(app::CONFIG);
    sensors::SensorService sensorService(app::CONFIG);
   

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

    struct tm timeinfo;

    while (!getLocalTime(&timeinfo, 10000))
    {
        Serial.println("[ESP32] Waiting for NTP time...");
    }

    Serial.println("[ESP32] Time synced");
    }

}
    void setup()
    {
        Serial.begin(SERIAL_BAUD_RATE);

        delay(DELAY_BETWEEN_TASKS_MS*10);  // Allow time for the serial monitor to connect before printing logs.
        Serial.println("[ESP32] Booting firmware...");
        
        powerManager.begin();
        sensorService.begin();
        networkClient.begin();
        syncTime();   
        networkClient.ensureMqttConnection();
    }

void loop()
{
    networkClient.loop();

    bool stateChanged = powerManager.update();

    if (stateChanged)
    {
        handleTelemetryTask();
        sensorService.clearSamples();
    }
        

    const unsigned long samplingPeriod =
        powerManager.getSamplingPeriod();
        
    if (millis() - lastSampleTime >= samplingPeriod)
    {
        lastSampleTime += samplingPeriod;

        sensorService.temperatureSample();

        if(sensorService.isBufferFull())
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
         Serial.println(sensorService.currentTemperatures()[i]);
    }
}