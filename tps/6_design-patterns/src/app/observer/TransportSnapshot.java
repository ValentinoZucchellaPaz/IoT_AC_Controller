package app.observer;

public record TransportSnapshot(
        String name, double cost, double distance, int eta
) {
}
