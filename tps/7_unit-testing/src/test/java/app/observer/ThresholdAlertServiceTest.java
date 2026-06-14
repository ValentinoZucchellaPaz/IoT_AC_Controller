package app.observer;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

public class ThresholdAlertServiceTest {
    @Test
    void testShouldAlertCost() {
        ThresholdAlertService service = new ThresholdAlertService(20, 0);
         
        assertFalse(service.shouldAlertCost(10));

        assertTrue(service.shouldAlertCost(20));

        assertTrue(service.shouldAlertCost(21));
    }

    @Test
    void testShouldAlertETA() {
        ThresholdAlertService service = new ThresholdAlertService(0, 20);

        assertFalse(service.shouldAlertETA(19));

        assertTrue(service.shouldAlertETA(21));
    }
}
