package app.strategy;
import java.util.Random;

public class TaxiStrategy extends BaseTransportStrategy {

    private final Random random = new Random();

    public TaxiStrategy() {
        super("Taxi", 10.0, 25); // hardcodeado por ahora
    }

    @Override
    public double calculateCost() {
        return 10000 + (10 * random.nextDouble());
    }
}