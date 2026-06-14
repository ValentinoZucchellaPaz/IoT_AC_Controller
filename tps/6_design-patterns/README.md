# Transport Monitoring System

Aplicación de consola desarrollada en Java para demostrar el uso de patrones de diseño y programación orientada a objetos.

## Descripción

Se implementaron los siguientes patrones:

- Strategy
- Observer (Publisher / Subscriber)
- Singleton

El sistema simula un monitor de transporte que actualiza información periódicamente utilizando distintas estrategias de transporte, las cuales tienen distintos costos (variables) y eta's.
Las implementaciones de TransportStrategy son:

- Bus
- Bike
- Taxi

Los observadores suscriptos al monitor reciben actualizaciones en tiempo real y reaccionan según su implementación.

---

## Diagrama de Clases

![UMLClases](/tps/design-patterns/images/UMLClasesTPDesignPatterns.drawio.png)

---

## Funcionamiento

1. El monitor inicia utilizando una estrategia de transporte.
2. Los observers reciben actualizaciones periódicas y mediante el Logger (singleton) hacen logs por consola de distintos tipos.
3. Durante la ejecución se cambia dinámicamente la estrategia.
4. El usuario puede cambiar la strategy y/o salir del programa.

![Resultados1](/tps/design-patterns/images/console_output1.png)
![Resultados2](/tps/design-patterns/images/console_output2.png)

---

## Requisitos: Java

Verificar instalación de Java JDK 17 o superior:

```bash
java --version
javac --version
```

---

# Estructura del proyecto

```bash
src/
└── app/
├── Main.java
├── logger/
├── monitor/
├── observer/
└── strategy/
```

---

## Compilar y ejecutar el proyecto

Primero debo generar los archivos compilados dentro de out, luego ejecutar el main de estos.
Desde la raíz del proyecto ejecutar:

```bash
# compilo dentro de la carpeta `out`.
find src -name "*.java" | xargs javac -d out
# ejecuto aplicacion
java -cp out app.Main
```
