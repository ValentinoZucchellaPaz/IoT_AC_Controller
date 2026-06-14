package app.observer;

import java.util.Random;
import org.junit.jupiter.api.Test;

import app.logger.Logger;

class FakeAlertObserverTest {

    @Test
    void fakeLogOnUpdate() {
        AlwaysAlertObserver service = new AlwaysAlertObserver();
        
        AlertObserver observer = new AlertObserver(service,Logger.getInstance());

        Random random = new Random();

        TransportSnapshot snapshot =
        new TransportSnapshot(
                "Bus",
                random.nextDouble() * 1000, // cost
                random.nextDouble() * 50,   // distance
                random.nextInt(120)         // eta
        );

        observer.onUpdate(snapshot);
    }

    @Test
    void fakeNotLogOnUpdate() {
        NeverAlertObserver service = new NeverAlertObserver();
        
        AlertObserver observer = new AlertObserver(service,Logger.getInstance());

        Random random = new Random();

        TransportSnapshot snapshot =
        new TransportSnapshot(
                "Bus",
                random.nextDouble() * 1000, // cost
                random.nextDouble() * 50,   // distance
                random.nextInt(120)         // eta
        );

        observer.onUpdate(snapshot);
    }
}
