package app.strategy;
import java.util.Random;

public class TaxiStrategy extends BaseTransportStrategy {

    private final Random random = new Random();

    public TaxiStrategy() {
        super("Taxi", 10.0, 25); // hardcoded temporarily
    }

    @Override
    public double calculateCost() {
        return 10000 + (10000 * random.nextDouble());
    }
    @Override
    public int getEta() {
        double factorAleatorio = (random.nextDouble() * 2) - 1; // [-1;1]
        double desvioMaximo = eta * 0.3;
        int variacionFinal = (int) Math.round(desvioMaximo * factorAleatorio); // hago que desvio se quede en rango pos neg
        return Math.max(0, eta + variacionFinal);
    }
}