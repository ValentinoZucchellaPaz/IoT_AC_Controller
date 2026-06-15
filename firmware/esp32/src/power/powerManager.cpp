#include "power/power_manager.hpp"

#include <esp_sleep.h>
#include <Arduino.h>

static constexpr uint8_t STATUS_LED_PIN = 2;

namespace power
{

volatile bool PowerManager::buttonPressed_ = false;

static constexpr unsigned long DEBOUNCE_MS = 200;

PowerManager::PowerManager(uint8_t buttonPin)
    : buttonPin_(buttonPin),
      lastButtonTime_(0),
      state_(AcState::ACTIVE)
{
}

void PowerManager::begin()
{
    pinMode(buttonPin_, INPUT_PULLUP);
    pinMode(STATUS_LED_PIN, OUTPUT);

    digitalWrite(STATUS_LED_PIN, HIGH);
    attachInterrupt(
        digitalPinToInterrupt(buttonPin_),
        isr,
        FALLING);
}

void IRAM_ATTR PowerManager::isr()
{
    buttonPressed_ = true;
}

void PowerManager::turnOff()
{
    state_ = AcState::SLEEP;
}

void PowerManager::turnOn()
{
    state_ = AcState::ACTIVE;
}

bool PowerManager::update()
{
    if (!buttonPressed_)
    {
        return false;
    }

    detachInterrupt(digitalPinToInterrupt(buttonPin_));

    buttonPressed_ = false;

    unsigned long now = millis();

    if (now - lastButtonTime_ < DEBOUNCE_MS)
    {
        attachInterrupt(digitalPinToInterrupt(buttonPin_), isr, FALLING);
       return false;
    }

    lastButtonTime_ = now;

    while (digitalRead(buttonPin_) == LOW)
    {
        delay(5);
    }

    delay(50);

    if (state_ == AcState::ACTIVE)
    {
        turnOff();
        Serial.println("Entering SLEEP");
        digitalWrite(STATUS_LED_PIN, LOW);
    }
    else
    {
        turnOn();
        Serial.println("Woke up");
        digitalWrite(STATUS_LED_PIN, HIGH);
    }

    buttonPressed_ = false;
    lastButtonTime_ = millis();

    attachInterrupt(digitalPinToInterrupt(buttonPin_), isr, FALLING);

    return true;
}

AcState PowerManager::state() const
{
    return state_;
}

unsigned long PowerManager::getSamplingPeriod() const
{
    if(state_ == AcState::ACTIVE)
    {
        return 3000UL;
    }
    else
    {
        return 15000UL;
    }
}
bool PowerManager::getButtonPressed()
{
    return buttonPressed_;
}

}