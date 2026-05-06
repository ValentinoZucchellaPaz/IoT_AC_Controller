package app.strategy;
import java.util.Random;

public class BusStrategy extends BaseTransportStrategy {

    private final Random random = new Random();

    public BusStrategy() {
        super("Bus", 10.0, 45); // hardcodeado por ahora
    }

    @Override
    public double calculateCost() {
        return 1000 + (10 * random.nextDouble());
    }
}