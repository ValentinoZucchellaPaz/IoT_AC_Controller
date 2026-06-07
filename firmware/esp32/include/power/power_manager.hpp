#ifndef POWER_MANAGER_HPP
#define POWER_MANAGER_HPP

#include <Arduino.h>
#include "app_config.hpp"
#include "power/power_types.hpp"

namespace power
{

class PowerManager
{
public:
    explicit PowerManager(uint8_t buttonPin);

    void begin();

    void update();

    AcState state() const;

    void onButtonPressed();

    void onWakeUp();
private:
    static void IRAM_ATTR isr();

    static volatile bool buttonPressed_;

    uint8_t buttonPin_;
    unsigned long lastButtonTime_;

    AcState state_;
};

}

#endif