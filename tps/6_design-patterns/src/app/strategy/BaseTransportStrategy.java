package app.strategy;

public abstract class BaseTransportStrategy implements TransportStrategy {
    protected String name;
    protected double distance;
    protected int eta;

    public BaseTransportStrategy(String name, double distance, int eta) {
        this.name = name;
        this.distance = distance;
        this.eta = eta;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public double getDistance() {
        return distance;
    }

    @Override
    public int getEta() {
        return eta;
    }
}