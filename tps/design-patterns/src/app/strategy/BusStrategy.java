package app.strategy;
import java.util.Random;

public class BusStrategy extends BaseTransportStrategy {

    private final Random random = new Random();

    public BusStrategy() {
        super("Bus", 10.0, 45); // hardcoded temporarily
    }

    @Override
    public double calculateCost() {
        return 1000 + (1000 * random.nextDouble());
    }
    @Override
    public int getEta() {
        double factorAleatorio = (random.nextDouble() * 2) - 1; // [-1;1]
        double desvioMaximo = eta * 0.2;
        int variacionFinal = (int) Math.round(desvioMaximo * factorAleatorio); // hago que desvio se quede en rango pos neg
        return Math.max(0, eta + variacionFinal);
    }
}