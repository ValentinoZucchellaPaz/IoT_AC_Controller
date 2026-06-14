package app.observer;

public class AlwaysAlertObserver implements AlertService {

    public AlwaysAlertObserver(){}

    @Override
    public boolean shouldAlertCost(double cost) { return true; }
    @Override
    public boolean shouldAlertETA(int eta)      { return true; }
}
