#include "network/network_client.hpp"

#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <PubSubClient.h>
#include <ctime>

auto constexpr WIFI_CONNECTION_TIMEOUT_MS = 15000UL;


namespace network {

    WiFiClient wifiClient;
    PubSubClient mqttClient(wifiClient);    

    NetworkClient::NetworkClient(const app::AppConfig& config)
        : config_(config)
    {
    }
    static bool ledEnabled = false;

    void mqttCallback(
        char* topic,
        byte* payload,
        unsigned int length)
    {
        String msg;

        for (unsigned int i = 0; i < length; i++)
        {
            msg += (char)payload[i];
        }

        JsonDocument doc;

        if (deserializeJson(doc, msg))
        {
            return;
        }

        ledEnabled = doc["enabled"] | false;
    }

    void NetworkClient::begin()
    {
        connectToWifi();

        mqttClient.setServer(
        config_.mqttBroker,
        config_.mqttPort);

        mqttClient.setCallback(mqttCallback);

        mqttClient.setBufferSize(1024);

    }

    void NetworkClient::ensureMqttConnection()
    {
        while (!mqttClient.connected())
        {
            Serial.println("[ESP32] Connecting MQTT...");

            String willPayload =
            String("{\"device_id\":\"") +
            config_.deviceId +
            "\",\"status\":\"false\"}";
            
            if (mqttClient.connect(
                config_.deviceId,
                statusTopic.c_str(),
                1,
                true,
                willPayload.c_str()))
            {
                Serial.println("[ESP32] MQTT connected");
                /*
                    Subscribe to sensor/datos
                */
                String topic =
                    String("devices/")
                    + config_.deviceId
                    + "/led";

                mqttClient.subscribe(topic.c_str());

                JsonDocument payload;

                payload["device_id"] = "ESP32_01";
                payload["status"] = "true";

                String body;

                serializeJson(payload, body);

                bool ok = mqttClient.publish(statusTopic.c_str(), body.c_str());
            }
            else
            {
                delay(2000);
            }
        }
    }

    void NetworkClient::ensureWifiConnection()
    {
        if (WiFi.status() != WL_CONNECTED)
        {
            connectToWifi();
        }
    }

    bool NetworkClient::isConnected() const
    {
        return WiFi.status() == WL_CONNECTED;
    }

    bool NetworkClient::postSensorReading(
        const sensors::SensorReading& reading)
    {
        
        

        JsonDocument payload;

        time_t timestamp = std::time(nullptr);

        payload["device_id"] = reading.deviceId;
        payload["valid_samples"] = reading.valid_samples;
        payload["ts_end"] = (long long)timestamp;
        payload["ac_state"] = static_cast<bool>(reading.ac_state);
        payload["current_humidity"] = reading.current_humidity;

        JsonArray currentTemps =
            payload["current_temperature"].to<JsonArray>();

        for (int i = 0; i < 20; i++) {
            currentTemps.add(reading.current_temperature[i]);
        }

        JsonArray desiredTemps =
            payload["desired_temperature"].to<JsonArray>();

        for (int i = 0; i < 20; i++) {
            desiredTemps.add(reading.desired_temperature[i]);
        }

        
        String body;
        serializeJson(payload, body);

        bool ok = mqttClient.publish(dataTopic.c_str(), body.c_str());

        Serial.print("Publish result: ");
        Serial.println(ok);

        return ok;
    }


    void NetworkClient::connectToWifi()
    {
        if (WiFi.status() == WL_CONNECTED)
        {
            return;
        }

        logMessage("Connecting to Wi-Fi...");
        WiFi.mode(WIFI_STA);
        WiFi.begin(config_.wifiSsid, config_.wifiPassword);

        const unsigned long startedAt = millis();
        while (WiFi.status() != WL_CONNECTED && millis() - startedAt < WIFI_CONNECTION_TIMEOUT_MS)
        {
            delay(500);
            Serial.print('.');
        }
        Serial.println();

        if (WiFi.status() == WL_CONNECTED)
        {
            logMessage("Wi-Fi connected. IP: " + WiFi.localIP().toString());
            return;
        }

        logMessage("Wi-Fi connection failed. Will retry on next loop.");
    }

    void NetworkClient::logMessage(const String& message)
    {
        Serial.println(String("[ESP32] ") + message);
    }

    void NetworkClient::loop()
    {
        mqttClient.loop();
    }
}  // namespace network
