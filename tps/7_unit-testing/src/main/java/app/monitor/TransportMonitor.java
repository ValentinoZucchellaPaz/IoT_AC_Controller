package app.monitor;
import java.util.ArrayList;
import java.util.List;
import app.strategy.*;
import app.observer.*;

public class TransportMonitor {
    private final List<TransportObserver> observers = new ArrayList<>();
    private TransportStrategy currentStrategy;

    // atributos para evitar duplicar thread
    private Thread monitorThread;
    private volatile boolean running = false;

    public TransportMonitor(){
        this.currentStrategy = null;
    }

    public TransportMonitor(TransportStrategy strategy){
        this.currentStrategy = strategy;
    }

    public void subscribe(TransportObserver observer){
        observers.add(observer);
    }

    public void unsubscribe(TransportObserver observer){
        observers.remove(observer);
    }

    public void setStrategy(TransportStrategy strategy){
        this.currentStrategy = strategy;
    }

    public synchronized void start(int intervalMs){
        // evita arrancar múltiples threads
        if(running) return;
        running = true;

        if(this.currentStrategy == null) return;

        monitorThread = new Thread(()->{
            while(running){
                TransportSnapshot snapshot = new TransportSnapshot( // no seria mejor tener esto adentro del strategy si siempre trae los datos de ahi?
                        currentStrategy.getName(),
                        currentStrategy.calculateCost(),
                        currentStrategy.getDistance(),
                        currentStrategy.getEta()
                );
                for(TransportObserver ob: observers){
                    ob.onUpdate(snapshot);
                }
                try{
                    Thread.sleep(intervalMs);
                }
                catch(InterruptedException e){
                    break;
                }
            }

            System.out.println("[Monitor] detenido.");
        });

        monitorThread.start();
    }

    public synchronized void stop(){

        running = false;

        if(monitorThread != null){
            monitorThread.interrupt();
        }
    }
}
