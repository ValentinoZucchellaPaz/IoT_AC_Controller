### Feature: Control de acceso de socios

#### Scenario: Acceso permitido

Given que el socio pasa su pulsera o llavero por el molinete
When el sistema verifica que el socio existe y tiene la cuota al día
Then el molinete se habilita para el ingreso

#### Scenario: Acceso denegado por deuda

Given que el socio pasa su pulsera o llavero por el molinete
When el sistema detecta que el socio tiene deuda
Then se enciende una luz roja
And el molinete no permite el ingreso

#### Scenario: Socio inexistente

Given que se pasa una pulsera o llavero no registrado
When el sistema no encuentra el socio en la base de datos
Then se enciende una luz roja
And el molinete no permite el ingreso
Feature: Registro de ingresos de socios

#### Scenario: Registro exitoso de ingreso

Given que el socio ingresa correctamente
When pasa el molinete
Then el sistema registra su DNI
And registra la fecha del ingreso
And registra la hora del ingreso
Feature: Generación de reportes de ingresos

#### Scenario: Descarga de reporte mensual

Given que el administrador accede a la página web
And inicia sesión correctamente
When solicita el reporte mensual
Then el sistema genera un archivo Excel
And el archivo contiene todos los ingresos del mes
And el archivo se descarga correctamente

#### Scenario: Acceso no autorizado

Given que un usuario no autenticado intenta acceder a los reportes
When intenta descargar el reporte
Then el sistema deniega el acceso
