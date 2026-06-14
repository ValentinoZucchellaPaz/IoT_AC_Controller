package app.strategy;
import java.util.Random;

public class BikeStrategy extends BaseTransportStrategy {

    private final Random random = new Random();

    public BikeStrategy() {
        super("Bike", 10.0, 60); // hardcoded temporarily
    }

    @Override
    public double calculateCost() {
        return 10 + (10 * random.nextDouble());
    }
    @Override
    public int getEta() {
        double factorAleatorio = (random.nextDouble() * 2) - 1; // [-1;1]
        double desvioMaximo = eta * 0.1;
        int variacionFinal = (int) Math.round(desvioMaximo * factorAleatorio); // hago que desvio se quede en rango pos neg
        return Math.max(0, eta + variacionFinal);
    }
}