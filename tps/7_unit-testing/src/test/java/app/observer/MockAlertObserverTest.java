package app.observer;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import app.logger.Logger;

@ExtendWith(MockitoExtension.class)
class MockAlertObserverTest {
    @Mock
    private ThresholdAlertService service;
    @Mock
    private TransportSnapshot snapshot;
    @Mock
    private Logger logger;

    private AlertObserver observer;
    
    @BeforeEach
    void setUp(){
        observer = new AlertObserver(service, logger);

        when(snapshot.cost()).thenReturn((double) 100);
        
    }

    @Test
    @DisplayName("GIVEN true from shouldAlertCost() and shouldAlertETA() WHEN onUpdate() THEN call once logWarning() and once logError()")
    void logOnUpdate(){
        when(service.shouldAlertCost(snapshot.cost())).thenReturn(true);
        when(service.shouldAlertETA(snapshot.eta())).thenReturn(true);
        
        observer.onUpdate(snapshot);

        verify(logger,times(1)).logWarning("[ALERTA] Costo excedido: $"+snapshot.cost());
        verify(logger,times(1)).logError("[CRITICO] ETA demasiado alto: "+snapshot.eta()+ " min");
    }

    @Test
    @DisplayName("GIVEN false from shouldAlertCost() or shouldAlertETA() WHEN onUpdate() THEN dont call logWarning() and logError()")
    void notLogOnUpdate(){
        when(service.shouldAlertCost(snapshot.cost())).thenReturn(false);
        when(service.shouldAlertETA(snapshot.eta())).thenReturn(false);

        observer.onUpdate(snapshot);

        verify(logger,times(0)).logWarning("[ALERTA] Costo excedido: $"+snapshot.cost());
        verify(logger,times(0)).logError("[CRITICO] ETA demasiado alto: "+snapshot.eta()+ " min");
    }
}   
