package app.monitor;

import app.strategy.TransportStrategy;

public class TransportMonitor {

    private TransportStrategy strategy;

    public void setStrategy(TransportStrategy strategy) {
        this.strategy = strategy;
    }

    public TransportStrategy getStrategy() {
        return strategy;
    }

    public void getData() {
        if (strategy == null) {
            System.out.println("No strategy selected");
            return;
        }

        String name = strategy.getName();
        double cost = strategy.calculateCost();
        double distance = strategy.getDistance();
        int eta = strategy.getEta();

        log(name, cost, distance, eta);
    }

    private void log(String name, double cost, double distance, int eta) {
        System.out.println("---- Transport Update ----");
        System.out.println("Type: " + name);
        System.out.println("Cost: " + cost);
        System.out.println("Distance: " + distance);
        System.out.println("ETA: " + eta + " min");
        System.out.println("--------------------------");
    }

    public void start(int iterations, int delayMs) {
        if (strategy == null) {
            System.out.println("No strategy selected");
            return;
        }

        for (int i = 0; i < iterations; i++) {
            getData();

            try {
                Thread.sleep(delayMs);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.out.println("Monitor interrupted");
                break;
            }
        }
    }
}