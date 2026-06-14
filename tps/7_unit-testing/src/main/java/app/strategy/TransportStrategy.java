package app.strategy;

public interface TransportStrategy {
    String getName();
    double calculateCost();
    double getDistance();
    int getEta();
}