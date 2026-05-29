package app.logger;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

// Java utilities used to handle dates, time zones, and formatting.
// Without these imports, LocalDateTime, ZoneId, and DateTimeFormatter
// would not exist for the compiler.


// "public" → the class can be accessed from any other file in the project.
// If it were "private", it could not be used from Main or other classes.
public class Logger {

    // "private" → no external class can directly modify this variable.
    // "static"  → belongs to the CLASS, not to an object instance.
    //             It exists even if nobody has called getInstance() yet.
    // Starts as null because no instance has been created yet
    // (lazy initialization).
    private static Logger instancia = null;

    // "private" → only this class can access these values.
    // "static"  → they belong to the class, not to each object instance.
    //             It would not make sense for every object to have its own
    //             copy of the yellow color.
    // "final"   → constants. Once assigned, they never change.
    private static final String AMARILLO = "\u001B[33m";
    private static final String VERDE    = "\u001B[32m";
    private static final String GRIS     = "\u001B[37m";
    private static final String ROJO     = "\u001B[31m";
    private static final String RESET    = "\u001B[0m";

    // *** THIS IS THE CONSTRUCTOR ***
    // It has the same name as the class.
    // "private" is the key of the Singleton pattern:
    // nobody outside the class can do "new Logger()".
    // The body is empty because no special initialization is needed.
    private Logger() {}

    // "public" → any class can call this method.
    // "static" → it can be called without creating an object:
    //             Logger.getInstance().
    //             This is necessary because it is the only way to obtain
    //             the Logger object.
    // Logic:
    // If the instance does not exist yet, create it.
    // If it already exists, return the same one.
    public static Logger getInstance() {
        if (instancia == null) {
            instancia = new Logger(); // the only time "new Logger()" is executed
        }
        return instancia;
    }

    // "private" → internal helper method.
    //              Only the log methods use it.
    //              There is no reason to expose it outside the class.
    // NOT static → it runs on the instance itself
    //               (although in this case it could also be static).
    // Generates the current date and time with a readable format:
    // "07/05/2025 14:32:10"
    //             ↑ timestamp
    private String timestamp() {

        DateTimeFormatter formato =
                DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        //                                    day/month/year hour:min:sec

        return LocalDateTime.now(
                    ZoneId.of("America/Argentina/Buenos_Aires")
               ).format(formato);

        // ZoneId ensures the time corresponds to Argentina (UTC-3),
        // not to the server's local time zone.
    }

    // "public" → log methods are the public interface of the Logger.
    //             Any class in the system can call them.
    // "void"    → they do not return anything; they only print to console.
    //
    // Example output:
    // [WARN]  07/05/2025 14:32:10 - Capacity at 80%
    //   ↑              ↑                    ↑
    // prefix       timestamp             msg parameter
    public void logWarning(String msg) {
        System.out.println(
                AMARILLO + "[WARN]  " + timestamp() + " - " + msg + RESET
        );
    }

    public void logDebug(String msg) {
        System.out.println(
                VERDE + "[DEBUG] " + timestamp() + " - " + msg + RESET
        );
    }

    public void logInfo(String msg) {
        System.out.println(
                GRIS + "[INFO]  " + timestamp() + " - " + msg + RESET
        );
    }

    public void logError(String msg) {
        System.out.println(
                ROJO + "[ERROR] " + timestamp() + " - " + msg + RESET
        );
    }
}
