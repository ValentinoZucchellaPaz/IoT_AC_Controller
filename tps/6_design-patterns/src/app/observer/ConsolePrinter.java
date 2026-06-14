package app.observer;
import app.logger.Logger;

public class ConsolePrinter implements TransportObserver {
    private Logger logger= Logger.getInstance();
    @Override
    public void onUpdate(TransportSnapshot snapshot){
        logger.logInfo("ACTUALIZACION: "+ snapshot.name());
        logger.logDebug("Costo: $"+snapshot.cost()+ " | Distancia: "+snapshot.distance()+"km" + " | ETA: "+snapshot.eta());

    }
}
