package app;

import app.monitor.TransportMonitor;
import app.strategy.BusStrategy;
import app.strategy.BikeStrategy;

public class Main {
    public static void main(String[] args) {

        TransportMonitor monitor = new TransportMonitor();

        monitor.setStrategy(new BusStrategy());
        monitor.start(5, 1000);

        monitor.setStrategy(new BikeStrategy());
        monitor.start(5, 1000);
    }
}