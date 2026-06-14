package app.observer;

public class NeverAlertObserver implements AlertService {
    public NeverAlertObserver(){};

    @Override
    public boolean shouldAlertCost(double cost) { return false; }
    @Override
    public boolean shouldAlertETA(int eta)      { return false; }
}
