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

void PowerManager::onButtonPressed()
{
    state_ = AcState::LIGHT_SLEEP;
}

void PowerManager::onWakeUp()
{
    state_ = AcState::ACTIVE;
}

void PowerManager::update()
{
    if (!buttonPressed_)
    {
        return;
    }

    buttonPressed_ = false;

    if (millis() - lastButtonTime_ < DEBOUNCE_MS)
    {
        return;
    }

    lastButtonTime_ = millis();

    onButtonPressed();

    Serial.println("Entering LIGHT_SLEEP");

    while (digitalRead(buttonPin_) == LOW)
    {
        delay(10);
    }

    digitalWrite(STATUS_LED_PIN, LOW);

    esp_sleep_enable_ext0_wakeup(
        static_cast<gpio_num_t>(buttonPin_),
        0);

    esp_light_sleep_start();

    digitalWrite(STATUS_LED_PIN, HIGH);

    Serial.println("Woke up");

    while (digitalRead(buttonPin_) == LOW)
    {
        delay(10);
    }

    delay(250);

    lastButtonTime_ = millis();

    onWakeUp();
}

AcState PowerManager::state() const
{
    return state_;
}

}