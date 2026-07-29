#include "sensors/sensor_service.hpp"

#include "sensors/mock_sensor_model.hpp"
#include "power/power_manager.hpp"
#include <algorithm>

int a[60] = {};
int b[60] = {};

namespace sensors {

    SensorService::SensorService(const app::AppConfig& config)
        : config_(config),
          validSamples_(0), 
          dht_(config.dhtSensorPin, DHT11)
    {
    }

    void SensorService::begin()
    {
        //Configure ADC.
        analogReadResolution(12);

        // Initialize DHT11 sensor.
        dht_.begin();
    }

    SensorReading SensorService::read(power::AcState acState) const
    {

        SensorReading a = {
            .deviceId =config_.deviceId,
            .current_humidity = humiditySample_,
            .valid_samples = validSamples_,
            .ac_state =acState
        };
        std::copy (std::begin(currentTemperatures_), std::end(currentTemperatures_), a.current_temperature);
        std::copy (std::begin(desiredTemperatures_), std::end(desiredTemperatures_), a.desired_temperature);
        return a;
    }

    void SensorService::applyRemoteDesiredTemperature(int temp)
    {
        remoteDesiredTemperature_ = temp;
        useRemoteTemperature_ = true;
    }

    void SensorService::revertToLocalControl()
    {
        useRemoteTemperature_ = false;
    }

    int SensorService::readDesiredTemperature() const
    {
        if (useRemoteTemperature_)
        {
            return remoteDesiredTemperature_;
        }

        const int rawValue = analogRead(config_.desiredTemperaturePin);

        return MIN_TEMPERATURE +
               ((MAX_TEMPERATURE - MIN_TEMPERATURE) * 
               rawValue / ADC_MAX_VALUE);
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
            Serial.println("Error reading DHT11");
            return -999.0f;
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

}  // namespace sensors