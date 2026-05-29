package app.observer;
import app.logger.Logger;

public class AlertObserver implements TransportObserver {
    private double costLimit;
    private int etaLimit;
    private Logger logger = Logger.getInstance();

    public AlertObserver(double costLimit, int etaLimit){
        this.costLimit=costLimit;
        this.etaLimit=etaLimit;
    }
    @Override
    public void onUpdate(TransportSnapshot snapshot){
        if(snapshot.cost()>costLimit){
            logger.logWarning("[ALERTA] Costo excedido: $"+snapshot.cost());
        }
        if(snapshot.eta()>etaLimit){
            logger.logError("[CRITICO] ETA demasiado alto: "+snapshot.eta()+ " min");
        }
    }
}
