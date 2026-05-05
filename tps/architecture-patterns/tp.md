1. Nombre de la arquitectura elegida (Justificar la elección).
   Se adoptó una versión simplificada de Clean Architecture, priorizando la separación de responsabilidades y la inversión de dependencias. Dado que el dominio del sistema —validación de acceso a un molinete— es acotado, no se justifica una implementación completa de arquitectura hexagonal, ya que introduciría complejidad innecesaria. Sin embargo, se mantuvo el desacoplamiento mediante interfaces y capas bien definidas (dominio, casos de uso e infraestructura), evitando dependencias directas con tecnologías externas como la base de datos o el protocolo HTTP. Este enfoque permite que el sistema sea fácilmente extensible y escalable en el futuro, sin necesidad de refactorizar la lógica central.

2. Diagrama UML (Digital). Realizar en la plataforma draw.io y entregar la imagen final del diagrama.
   [Diagramas UML](./rfid_clean_architecture_0.drawio.pdf)

3. Realizar un texto explicando la responsabilidad de cada capa de la arquitectura y la función que tiene cada una durante la realización del pedido.

La arquitectura del sistema se organiza en capas siguiendo los principios de **Clean Architecture**, donde cada una tiene una responsabilidad bien definida durante el proceso de validación de acceso.

La capa **Enterprise/Domain** contiene las entidades principales, como _Member_ y _AccessRecord_, junto con sus reglas de negocio puras. Durante un pedido, esta capa determina si una membresía es válida, sin depender de ningún detalle externo.

La capa **Application** implementa los casos de uso, en particular _ValidateAccessUseCase_, que coordina el flujo completo: recibe el identificador de la tarjeta, consulta el miembro, valida su estado, registra el intento de acceso y define el resultado.

La capa de **Interface Adapters** actúa como intermediaria entre el mundo externo y la lógica interna. El _AccessController_ recibe la request HTTP desde el ESP32 y la traduce a una llamada al caso de uso, mientras que los repositorios implementan el acceso a datos adaptando la información entre la base de datos y las entidades del dominio.

Finalmente, la capa de **Frameworks & Drivers** contiene las tecnologías concretas, como NestJS, PostgreSQL y los dispositivos físicos (ESP32). Durante el pedido, esta capa se encarga de recibir la comunicación externa y ejecutar las operaciones técnicas necesarias, sin afectar la lógica de negocio.
