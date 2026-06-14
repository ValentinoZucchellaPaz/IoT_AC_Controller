package app.observer;

public class ThresholdAlertService implements AlertService{
    double maxCost;
    int maxEta;

    public ThresholdAlertService(double maxCost, int maxEta){
        this.maxCost = maxCost;
        this.maxEta = maxEta;
    }

    public boolean shouldAlertCost(double cost){
        if(cost>=maxCost){
            return true;
        }
        return false;
    }
    public boolean shouldAlertETA(int eta){
        if(eta>=maxEta){
            return true;
        }
        return false;
    }  
}
