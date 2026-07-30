#include "sensors/sensor_service.hpp"

#include "power/power_manager.hpp"
#include "sensors/mock_sensor_model.hpp"
#include <algorithm>

namespace sensors
{
    static constexpr float TEMP_FALLBACK = 30.0f;

    volatile bool SensorService::buttonUpPressed_ = false;
    volatile bool SensorService::buttonDownPressed_ = false;

    SensorService::SensorService(const app::AppConfig& config)
        : config_(config)
        , validSamples_(0)
        , dht_(config.dhtSensorPin, DHT11)
    {
    }

    void SensorService::begin()
    {
        pinMode(config_.buttonUpPin, INPUT_PULLUP);
        pinMode(config_.buttonDownPin, INPUT_PULLUP);
        attachInterrupt(digitalPinToInterrupt(config_.buttonUpPin), isrUp, FALLING);
        attachInterrupt(digitalPinToInterrupt(config_.buttonDownPin), isrDown, FALLING);

        dht_.begin();
    }

    void IRAM_ATTR SensorService::isrUp()
    {
        buttonUpPressed_ = true;
    }

    void IRAM_ATTR SensorService::isrDown()
    {
        buttonDownPressed_ = true;
    }

    void SensorService::updateButtons()
    {
        int step = 0;

        if (buttonUpPressed_ && buttonDownPressed_)
        {
            buttonUpPressed_ = false;
            buttonDownPressed_ = false;
            return;
        }

        if (buttonUpPressed_)
        {
            buttonUpPressed_ = false;
            step = 1;
        }
        else if (buttonDownPressed_)
        {
            buttonDownPressed_ = false;
            step = -1;
        }

        if (step == 0)
            return;

        unsigned long now = millis();
        if (now - lastButtonTime_ < BUTTON_DEBOUNCE_MS)
            return;
        lastButtonTime_ = now;

        if (useRemoteTemperature_)
        {
            revertToLocalControl();
        }

        localDesiredTemperature_ += step;
        if (localDesiredTemperature_ < MIN_TEMPERATURE)
        {
            localDesiredTemperature_ = MIN_TEMPERATURE;
        }
        else if (localDesiredTemperature_ > MAX_TEMPERATURE)
        {
            localDesiredTemperature_ = MAX_TEMPERATURE;
        }

        Serial.print("[BUTTON] Desired temp: ");
        Serial.println(localDesiredTemperature_);
    }

    SensorReading SensorService::read(power::AcState acState) const
    {

        SensorReading a = {.deviceId = config_.deviceId,
                           .current_humidity = humiditySample_,
                           .valid_samples = static_cast<int>(validSamples_),
                           .ac_state = acState};
        std::copy(std::begin(currentTemperatures_), std::end(currentTemperatures_), a.current_temperature);
        std::copy(std::begin(desiredTemperatures_), std::end(desiredTemperatures_), a.desired_temperature);
        return a;
    }

    void SensorService::applyRemoteDesiredTemperature(int temp)
    {
        localDesiredTemperature_ = temp;
        remoteDesiredTemperature_ = temp;
        useRemoteTemperature_ = true;
    }

    void SensorService::revertToLocalControl()
    {
        localDesiredTemperature_ = remoteDesiredTemperature_;
        useRemoteTemperature_ = false;
    }

    int SensorService::readDesiredTemperature() const
    {
        if (useRemoteTemperature_)
        {
            return remoteDesiredTemperature_;
        }

        return localDesiredTemperature_;
    }

    void SensorService::temperatureSample()
    {

        if (isBufferFull())
        {
            return;
        }

        desiredTemperatures_[validSamples_] = readDesiredTemperature();

        currentTemperatures_[validSamples_] = readCurrentTemperature();

        humiditySample_ = sampleCurrentHumidity();

        validSamples_++;
    }

    size_t SensorService::validSamples() const
    {
        return validSamples_;
    }

    const int* SensorService::desiredTemperatures() const
    {
        return desiredTemperatures_;
    }

    const float* SensorService::currentTemperatures() const
    {
        return currentTemperatures_;
    }

    float SensorService::currentHumidity() const
    {
        return humiditySample_;
    }

    bool SensorService::isBufferFull() const
    {
        return validSamples_ >= MAX_SAMPLES;
    }

    float SensorService::readCurrentTemperature()
    {
        float temp = dht_.readTemperature();

        if (isnan(temp))
        {
            Serial.println("Error reading DHT11, using fallback temp");
            return TEMP_FALLBACK;
        }

        return temp;
    }

    float SensorService::sampleCurrentHumidity()
    {
        float humidity = dht_.readHumidity();

        if (isnan(humidity))
        {
            Serial.println("Error reading DHT11 humidity");
            humiditySample_ = -999.0f;
            return -999.0f;
        }

        return humidity;
    }

    void SensorService::clearSamples()
    {
        validSamples_ = 0;
    }

} // namespace sensors
