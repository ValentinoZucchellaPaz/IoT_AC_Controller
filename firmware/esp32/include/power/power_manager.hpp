#ifndef POWER_MANAGER_HPP
#define POWER_MANAGER_HPP

#include <Arduino.h>
#include "app_config.hpp"
#include "power/power_types.hpp"

namespace power
{

/**
 * @brief Encapsulates the managing of ESP32 state of function
 */

class PowerManager
{
public:
    /**
     * @brief Configure the initial state of ESP32
     * 
     * @param buttonPin Physical pin who call the interrupt
     */
    explicit PowerManager(uint8_t buttonPin);
    
    /**
     * @brief Configure esp32 to allow a external interrupt
     */
    void begin();

    /**
     * @brief Switch the state of ESP32
     */
    bool update();

    /**
     * @brief Getter of state_ parameter
     * 
     * @return State of function of the ESP32
     */
    AcState state() const;

    /**
     * @brief Set state_ to SLEEP 
     */
    void turnOff();

    /**
     * @brief Returns the sampling period according to
     * the current power state.
     *
     * @return Sampling period in milliseconds.
     */
    unsigned long getSamplingPeriod() const;
     /**
     * @brief Set state_ to ACTIVE 
     */
    void turnOn();

    /**
     * @brief Getter of buttonPressed_
     * 
     * @return buttonPressed_ state
     */
    bool getButtonPressed();
private:
     /**
     * @brief ISV of external interrupt, set buttonPressed_
     */
    static void IRAM_ATTR isr();

    static volatile bool buttonPressed_;

    uint8_t buttonPin_;
    unsigned long lastButtonTime_;

    AcState state_;
};

}

#endif