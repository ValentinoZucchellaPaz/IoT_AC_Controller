# Modulo Wi-Fi y HTTP en ESP32

Este documento esta sujeto a cambio y/o actualizaciones debido a una mejor comprensión de los temas implicados a traves de realizar su implementación y/o testing

## Proposito

Este documento busca mostrar de forma superficial el uso del modulo Wi-Fi y HTTP REST en una ESP32 para mejorar la comprensión del codigo implementado para el manejo del firmware. Los temas mencionados seran programados a través de las librerias [WiFi.h](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/wifi.html) y [HTTPClient.h](https://github.com/espressif/arduino-esp32/tree/master/libraries/HTTPClient)  que provee arduino, estas son abstracciones de librerias de un nivel mas bajo, [Wi-Fi](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/network/esp_wifi.html) y [ESP HTTP Client](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/protocols/esp_http_client.html) proveidas por el fabricante de la ESP32

## Modulo Wi-Fi

La libreria [WiFi.h](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/wifi.html) permite configurar al ESP32 de dos formas distintas:  

* AP (Access Point): Trabaja al ESP32 como un punto de acceso en comun para que otros dispositivos pueden conectarse a este ![AP_img](https://docs.espressif.com/projects/arduino-esp32/en/latest/_images/wifi_esp32_ap.png)

* STA (Station Mode): Permite al ESP32 conectarse a una red Wi-Fi o a un AP ![STA_img](https://docs.espressif.com/projects/arduino-esp32/en/latest/_images/wifi_esp32_sta.png)

Para estre proyecto el ESP32 esta configurado como STA y no se proveera de informacion de como utilizar el ESP32 como AP

### ESP32 como STA

---

#### Metodos

##### **begin()**

Permite configurar y iniciar el modulo Wi-Fi como STA

    wl_status_t begin(const char* ssid, const char *passphrase = NULL, int32_t channel = 0, const uint8_t* bssid = NULL, bool tryConnect = true),

Donde:

* `ssid` (Service Set Identifier) es el nombre de el AP al que se desea conectar (e.g ssid = "MiWifi")
* `passphrase` es la contrasena de el AP al que se desea conectar
* `channel` es el canal, o frecuencia especifica que se usara para trasmitir datos, en configuracion STA esto no es elegido por la configuracion del ESP32 sino que depende de la configuracion del AP
* `bssid` (Basic Service Set Identifier) es el nombre unico de el AP al que se desea conectar debido a que muchos AP pueden compartir el mismo ssid
* `tryConnect` puesto en `true` para conectarse al AP configurado automaticamente

Si ya esta configurada

    wl_status_t begin()   

##### **config()**

Configura el modulo Wi-Fi

    bool config(IPAddress local_ip, IPAddress gateway, IPAddress subnet, IPAddress dns1 = (uint32_t)0x00000000, IPAddress dns2 = (uint32_t)0x00000000);

Donde:

* `local_ip` es la IP local del ESP32
* `gateway` es la IP de otro dispositivo que actua como puerta de acceso (normalmente un router) a otras redes
* `subnet` enmascara la direccion IP de una red para saber que dispositivos son partes de esta
* `dns1` (Domain Name System) es la IP asignada de un dominio y traduce el nombre de este a una direccion IP leible por el ESP32. Es opcional
* `dns2` dns alternativo

El metodo devolvera `true` si se ejecuto correctamente

##### **reconect()**

Reconecta a la red Wi-Fi

    bool reconnect();

##### **disconnect()**

Se desconecta de la red Wi-Fi

    bool disconnect(bool wifioff = false, bool eraseap = false);

Donde:

* `wifioff` poner en `true` para apagar el modulo Wi-Fi
* `eraseap` poner en `true` para desconfigurar el AP

##### **isConnected()**

Devuelve el estado de conexion

    bool isConnected();

##### **setAutoReconnect()**

Permite la reconexion a un AP si esta se pierde

    bool setAutoReconnect(bool autoReconnect);

Donde:

* `autoReconnect` poner en `true` para habilitar esta opcion

## HTTP

### Clases

#### HTTPClient

Es necesario instanciar un objeto de clase HTTPClient para poder utilizar el protocolo, esta clase no recibe ningun parametro para su constructor

    HTTPClient http;

### Metodos

#### **begin()**

Configura la conexion para poder utilizar el protocolo HTTP

    http.begin(String url);

Donde:

* `url` es la url a la que se conectara (e.g "http://192.168.1.10:3000/api/temp")

#### **GET()**

Envia una request tipo GET

Ejemplo de uso:

    int httpCode = http.GET();

Retorna -1 si hubo un error

#### **POST()**

Envia una request tipo POST

    http.POST(String payload);

Donde:

* `payload` es el JSON a enviar

#### **addHeader()**

Agrega headers HTTP

Ejemplo de uso:

    http.addHeader("Content-Type", "application/json");

#### **getString()**

Devuelve el response del servidor en formato string

Ejemplo de uso:

    String payload = http.getString();

Devuelve

    {
    "status":"ok"
    }

#### **End()**

Cierra la conexion y libera memoria

Ejemplo de uso:

    http.end();

Es importante utilizarlo pues previene de memory leaks

## Ejemplo de codigo

    #include <Arduino.h>

    #include <WiFi.h>
    #include <WiFiMulti.h>

    #include <HTTPClient.h>

    WiFiMulti wifiMulti;

    void setup() {

    Serial.begin(115200); // Comienzo la transmision serie con un baud rate de 115200

    Serial.println(); //
    Serial.println(); // Muestra por consola tres salto de linea
    Serial.println(); // 

    for (uint8_t t = 4; t > 0; t--) {
        Serial.printf("[SETUP] WAIT %u...\n", t);
        Serial.flush();
        delay(1000);
    }

    wifiMulti.addAP("SSID", "PASSWORD"); // Conecto a una AP llamada "SSID" de contrasena "PASSWORD"
    }

    void loop() {
    if ((wifiMulti.run() == WL_CONNECTED)) { // Consulto si esta hay conexion Wi-Fi

        HTTPClient http; 

        Serial.print("[HTTP] begin...\n");
        http.begin("http://example.com/index.html");  //HTTP conectado a servidor de url "http://example.com/index.html"

        Serial.print("[HTTP] GET...\n");
    
        int httpCode = http.GET(); // Request GET para comprobar

        if (httpCode > 0) { //Ante un error httpCode es negativo
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTP] GET... code: %d\n", httpCode);

        if (httpCode == HTTP_CODE_OK) { // Si el GET se completa correctamente
            String payload = http.getString(); // Almaceno los datos recibidos
            Serial.println(payload); // Los muestro
        }
        } else {
        Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str()); // Si fallas muestro el tipo de error
        }

        http.end(); // Cierro conexion
    }

    delay(5000);
    }
