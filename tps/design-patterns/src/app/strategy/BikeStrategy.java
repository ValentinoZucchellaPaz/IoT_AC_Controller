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
}