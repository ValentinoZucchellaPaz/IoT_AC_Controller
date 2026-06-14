package app;

import app.observer.AlertObserver;
import app.observer.ConsolePrinter;

import java.util.Scanner;

import app.logger.Logger;
import app.monitor.TransportMonitor;
import app.observer.TransportObserver;
import app.strategy.BusStrategy;
import app.strategy.TaxiStrategy;
import app.strategy.BikeStrategy;

public class Main {
    public static void main(String[] args) {

        TransportMonitor monitor = new TransportMonitor();
        Logger logger = Logger.getInstance();
        Scanner scanner = new Scanner(System.in);
        TransportObserver currObserver = new AlertObserver(15, 62);

        monitor.subscribe(new ConsolePrinter());
        monitor.subscribe(currObserver);
        monitor.setStrategy(new BikeStrategy());
        
        boolean running = true;
        while(running){
            logger.logInfo("\n[Sistema] Iniciando monitoreo por 6 segundos...");
            monitor.start(2000); 
            
            try {
                Thread.sleep(6000); // Monitorea durante 6 segundos (3 ticks)
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            // 2. Pausamos el monitor para que la consola quede "limpia" para el menú
            logger.logInfo("\n[Sistema] Pausando monitoreo para interactuar...");
            monitor.stop();

            // 3. Menú interactivo
            logger.logInfo("\n========================================");
            logger.logInfo("¿Qué acción desea tomar?");
            logger.logInfo("1 - Continuar con el transporte actual");
            logger.logInfo("2 - Cambiar a COLECTIVO (Bus)");
            logger.logInfo("3 - Cambiar a TAXI");
            logger.logInfo("4 - Cambiar a BICICLETA");
            logger.logInfo("5 - Salir de la aplicación");
            logger.logInfo("Seleccione una opción: ");
            
            int opcion = -1;
            if (scanner.hasNextInt()) {
                opcion = scanner.nextInt();
            } else {
                scanner.next(); // Limpiar entrada inválida
            }

            // 4. Procesamos la opción (Aplicando las Estrategias)
            switch (opcion) {
                case 1:
                    logger.logInfo("[Sistema] Continuando con el transporte actual...");
                    break;
                case 2:
                    logger.logInfo("[Sistema] Cambiando estrategia a COLECTIVO...");
                    monitor.setStrategy(new BusStrategy());
                    monitor.unsubscribe(currObserver);
                    currObserver = new AlertObserver(100, 46);
                    monitor.subscribe(currObserver);
                    break;
                case 3:
                    logger.logInfo("[Sistema] Cambiando estrategia a TAXI...");
                    monitor.setStrategy(new TaxiStrategy());
                    monitor.unsubscribe(currObserver);
                    currObserver = new AlertObserver(15000, 33);
                    monitor.subscribe(currObserver);
                    break;
                case 4:
                    logger.logInfo("[Sistema] Cambiando estrategia a BICICLETA...");
                    monitor.setStrategy(new BikeStrategy());
                    monitor.unsubscribe(currObserver);
                    currObserver = new AlertObserver(15, 62);
                    monitor.subscribe(currObserver);
                    break;
                case 5:
                    logger.logInfo("[Sistema] Exiting... ¡Buen viaje!");
                    running = false;
                    break;
                default:
                    logger.logInfo("[Error] Opción no válida. Se continuará con el transporte actual.");
                    break;
            }
        }

        // Al salir del bucle, aseguramos cerrar el scanner y que el monitor quede apagado
        monitor.stop();
        scanner.close();
        logger.logInfo("=== Aplicación Finalizada ===");
    }
}