package app.observer;
import app.logger.Logger;

public class AlertObserver implements TransportObserver {
    AlertService alertService;
    private Logger logger;

    public AlertObserver(AlertService alertService, Logger logger){
        this.alertService = alertService;
        this.logger =logger;
    }
    @Override
    public void onUpdate(TransportSnapshot snapshot){
        if(alertService.shouldAlertCost(snapshot.cost())){
            logger.logWarning("[ALERTA] Costo excedido: $"+snapshot.cost());
        }
        if(alertService.shouldAlertETA(snapshot.eta())){
            logger.logError("[CRITICO] ETA demasiado alto: "+snapshot.eta()+ " min");
        }
    }
}
