package app.monitor;

import app.strategy.TransportStrategy;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TransportMonitor {

    private TransportStrategy strategy;

    private static final DateTimeFormatter FORMATTER =
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

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

        log("INFO", String.format(
            "Type=%s | Cost=%.2f | Distance=%.2f | ETA=%d",
            name, cost, distance, eta
        ));
    }

    private void log(String level, String message) {
        String timestamp = LocalDateTime.now().format(FORMATTER);
        System.out.println("[" + timestamp + "] [" + level + "] " + message);
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