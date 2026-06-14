package app.observer;
public interface TransportObserver {
    // seria mejor que aca vaya un logger en vez de que se cree en cada llamado de onupdate
    void onUpdate(TransportSnapshot snapshot);
}
