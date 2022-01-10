# Proyecto reserva vuelos

El proyecto consiste en un sistema de reserva de vuelos que permitirá administrar pasajeros, vuelos, y las reservas de los vuelos de una determinada cantidad de pasajeros.

El proyecto tiene una arquitectura distribuida, y consta de una aplicación API REST de backend desarrollada con Express y una aplicación de frontend desarrollada en Vue.js. Como base de datos se utilizó Google Cloud Spanner (GCS) con 3 nodos de procesamiento con una configuración regional ubicada en us-west.

## Rediseño de la Base de Datos Distribuida de GCS

Modelo lógico inicial

![antes](https://github.com/AlexVelezLl/BDAFlightsProject/blob/master/images/bd-diseno-pasado.png?raw=true)

<br/>


Modelo lógico final

![despues](https://github.com/AlexVelezLl/BDAFlightsProject/blob/master/images/bd-diseno.png?raw=true)
* **Modelo lógico**

Teniendo en cuenta que GCS puede almacenar físicamente los datos de manera jerárquica y que una tabla principal cuenta con tablas secundarias y estas a su vez pueden tener más tablas secundarias, se optó por utilizar esta estructura para el modelo. Se tomó a la entidad Flight como una tabla principal, que tiene a la entidad Booking como su tabla secundaria que ésta a su vez es la tabla principal de la entidad BookingDetail. Esto se realizó debido a que existe una relación de localidad entre las entidades. 

Por ejemplo, si se desea consultar la información sobre un vuelo, se querrá consultar la información de las reservas que tiene su vuelo. De la misma manera si se quiere obtener la información de las reservas se querrá saber los pasajeros pertencientes a dicha reserva, por lo que es más óptimo que físciamente esta información se almacene de manera cercana para reducir los tiempos de consulta. GCS logra esto a través de intercalar los registros de sus tablas relacionadas, como se observa en la siguiente figura:

![ejemplo](https://github.com/AlexVelezLl/BDAFlightsProject/blob/master/images/example.png?raw=true)

Esta estructura requiere que cada tabla secundaria cuente con la clave prrimaria de todos sus antecesores, es por esta razón que la entidad BookingDetail debe tener como clave foranea no solo a la clave primaria de Booking, si no también a la clave primaria de Flight.

* **Claves primarias**

Para la optimización de las lecturas y escrituras en la base, se rediseñó el campo de las claves primarias teniendo lo que dice la [documentación de GCS]:(https://cloud.google.com/spanner/docs/schema-design)

> Una de las causas de los hotspots es tener una columna con un valor que aumenta de forma monotónica como la primera parte de la clave, ya que esto da como resultado que todas las inserciones ocurran al final del espacio de clave. Este patrón no es recomendable porque Cloud Spanner divide los datos entre servidores por rangos de clave, lo que significa que todas tus inserciones se dirigirán a un solo servidor que hará todo el trabajo. 

Para evitar esto, la solución implementada en el proyecto se basa en generar identificadores únicos universales (UUID) como claves primarias de nuestras entidades. De esta forma se logra que los registros se almacenen de forma más esparcida evitando así la creación de hotspots. La versión de UUID utilizada es la versión 4 y esta requiere que sus valores se almacenen en:
* Una columna STRING(36)
* Dos columnas INT64
* Una columna BYTES(16)

La opción escogida para implementar los UUID es la de almacenarlos en una columna de 36 caracteres.


## Documentación de la REST API

### Obtener pasajeros

---

Retorna un array con los datos de todos los pasajeros con paginación.

* **URL**

  /passenger

* **Method**

  `GET`

* **URL Params**

  None

* **Query Params**

  `name=[string]` Retornará todos los pasajeros cuyo nombre contengan el substring `name`.

  `page=[number]` El número de la página de pasajeros a consultar.

  `limit=[number]` La longitud de la página de pasajeros.

* **Success Response:**

  * **Code:** 200

    **Content:** `[{ passengerID: "f8560580-4aff-4e97-9cef-94aa4a2a60f8", passengerName: "Juan Perez", passengerEmail: "juan@gmail.com", passengerDOB: "1986-10-09T05:00:00.000000000Z"}]`

### Obtener pasajero

---

Retorna un objeto con los datos del pasajero consultado por Id.

* **URL**

  /passenger/:id

* **Method**

  `GET`

* **URL Params**

  `id=[string]` Id del pasajero a consultar

* **Query Params**

  None

* **Success Response:**

  * **Code:** 200

    **Content:** `{ passengerID: "f8560580-4aff-4e97-9cef-94aa4a2a60f8", passengerName: "Juan Perez", passengerEmail: "juan@gmail.com", passengerDOB: "1986-10-09T05:00:00.000000000Z"}`

* **Error Response**
  * **Code: 404**

    **Content:** `{ error: "Passenger not found" }`

### Crear pasajeros

---

Crea un pasajero.

* **URL**

  /passenger

* **Method**

  `POST`

* **URL Params**

  None

* **Query Params**

  None

* **Body Params**

  `passengerName=[string]` Nombre del pasajero.

  `passengerEmail=[string]` Email del pasajero.

  `passengerDob=[string]` Fecha de nacimiento del pasajero.

* **Success Response:**

  * **Code:** 201

    **Content:** `{ id: "f8560580-4aff-4e97-9cef-94aa4a2a60f8" }`

* **Error Response**
  * **Code: 400**

    **Content:** `{ error: [Mensaje de error por alguna propiedad faltante/inválida] }`

### Actualizar pasajeros

---

Actualiza un pasajero.

* **URL**

  /passenger/:id

* **Method**

  `PUT`

* **URL Params**

  `id=[string]` Id del pasajero a actualizar

* **Query Params**

  None

* **Body Params**

  `passengerName=[string]` Nombre del pasajero.

  `passengerEmail=[string]` Email del pasajero.

  `passengerDob=[string]` Fecha de nacimiento del pasajero.

* **Success Response:**

  * **Code:** 204

    **Content:**

* **Error Response**
  * **Code: 400**

    **Content:** `{ error: [Mensaje de error por alguna propiedad faltante/inválida] }`

### Eliminar pasajeros

---

Eliminar un pasajero.

* **URL**

  /passenger/:id

* **Method**

  `DELETE`

* **URL Params**

  `id=[string]` Id del pasajero a eliminar

* **Query Params**

  None

* **Success Response:**

  * **Code:** 204

    **Content:**

---
---

### Obtener vuelos

---

Retorna un array con los datos de todos los vuelos con paginación.

* **URL**

  /flight

* **Method**

  `GET`

* **URL Params**

  none

* **Query Params**

  `page=[number]` El número de la página de vuelos a consultar.

  `limit=[number]` La longitud de la página de vuelos.

* **Success Response:**

  * **Code:** 200

    **Content:** `[{ flightID: "30c5f94c-aac3-475c-8deb-23173643e1a1", flightSource: "Semkhoz", flightDest: "Bahay Pare", flightDate: "2022-01-05T14:32:43.625000000Z", flightSeat: 500, ticketCost: 100 }]`

### Obtener vuelo

---

Retorna un objeto con los datos del vuelo consultado por Id.

* **URL**

  /flight/:id

* **Method**

  `GET`

* **URL Params**

  `id=[string]` Id del vuelo a consultar

* **Query Params**

  None

* **Success Response:**

  * **Code:** 200

    **Content:** `{ flightID: "30c5f94c-aac3-475c-8deb-23173643e1a1", flightSource: "Semkhoz", flightDest: "Bahay Pare", flightDate: "2022-01-05T14:32:43.625000000Z", flightSeat: 500, ticketCost: 100 }`

* **Error Response**
  * **Code: 404**

    **Content:** `{ error: "Flight not found" }`

### Crear vuelo

---

Crea un vuelo.

* **URL**

  /flight

* **Method**

  `POST`

* **URL Params**

  None

* **Query Params**

  None

* **Body Params**

  `flightSource=[string]` Ciudad de salida del vuelo.

  `flightDest=[string]` Ciudad de llegada del vuelo.

  `flightDate=[string]` Fecha de viaje del vuelo.

  `flightSeat=[string]` Cantidad de asientos del vuelo.

  `ticketCost=[string]` Costo del ticket del vuelo.

* **Success Response:**

  * **Code:** 201

    **Content:** `{ id: "f8560580-4aff-4e97-9cef-94aa4a2a60f8" }`

* **Error Response**
  * **Code: 400**

    **Content:** `{ error: [Mensaje de error por alguna propiedad faltante/inválida] }`

### Actualizar vuelos

---

Actualiza un vuelo.

* **URL**

  /flight/:id

* **Method**

  `PUT`

* **URL Params**

  `id=[string]` Id del vuelo a actualizar

* **Query Params**

  None

* **Body Params**

  `flightSource=[string]` Ciudad de salida del vuelo.

  `flightDest=[string]` Ciudad de llegada del vuelo.

  `flightDate=[string]` Fecha de viaje del vuelo.

  `flightSeat=[string]` Cantidad de asientos del vuelo.

  `ticketCost=[string]` Costo del ticket del vuelo.

* **Success Response:**

  * **Code:** 204

    **Content:**

* **Error Response**
  * **Code: 400**

    **Content:** `{ error: [Mensaje de error por alguna propiedad faltante/inválida] }`

### Eliminar vuelo

---

Eliminar un vuelo.

* **URL**

  /flight/:id

* **Method**

  `DELETE`

* **URL Params**

  `id=[string]` Id del vuelo a eliminar

* **Query Params**

  None

* **Success Response:**

  * **Code:** 204

    **Content:**

---
---

### Obtener reservas

---

Retorna un array con todas las reservas de vuelos con paginación.

* **URL**

  /booking

* **Method**

  `GET`

* **URL Params**

  none

* **Query Params**

  `page=[number]` El número de la página de las reservas a consultar.

  `limit=[number]` La longitud de la página de reservas.

* **Success Response:**

  * **Code:** 200

    **Content:** `[{ bookingID: "5065fbcd-78a9-4d0b-9d79-c098fb1f989d", bookingDate: "2021-12-05T05:50:52.402000000Z", flightID: "4379b8cf-af89-4587-ad54-9b0e7dacfa36", flightSource: "Khambhāt", flightDest: "Nový Bydžov", flightDate: "2022-01-12T03:35:46.870000000Z", nPassengers: 7}]`

### Obtener reserva

---

Retorna un objeto con los datos de la reserva consultada por Id.

* **URL**

  /booking/:id

* **Method**

  `GET`

* **URL Params**

  `id=[string]` Id de la reserva a consultar

* **Query Params**

  None

* **Success Response:**

  * **Code:** 200

    **Content:** `{ bookingID: "30c5f94c-aac3-475c-8deb-23173643e1a1", bookingDate: "2021-12-05T05:50:52.402000000Z", passengers: [{ passengerID: "30c5f94c-aac3-475c-8deb-23173643e1a2", passengerName: "Juan Perez" }] }`

* **Error Response**
  * **Code: 404**

    **Content:** `{ error: "Booking not found" }`

### Crear reserva

---

Crea una reserva de un vuelo existente con pasajeros registrados en el sistema.

* **URL**

  /booking

* **Method**

  `POST`

* **URL Params**

  None

* **Query Params**

  None

* **Body Params**

  `flightID=[string]` Id del vuelo a reservar.

  `bookingDate=[string]` Fecha en la que se realizó la reserva.

  `passengerIDs=[array<string>]` Arreglo con los ids de los pasajeros que realizaron la reserva.

* **Success Response:**

  * **Code:** 201

    **Content:** `{ id: "f8560580-4aff-4e97-9cef-94aa4a2a60f8" }`

* **Error Response**
  * **Code: 400**

    **Content:** `{ error: [Mensaje de error por alguna propiedad faltante/inválida] }`

### Actualizar reserva

---

Actualiza los pasajeros de una reserva.

* **URL**

  /booking/:id

* **Method**

  `PUT`

* **URL Params**

  `id=[string]` Id de la reserva a actualizar

* **Query Params**

  None

* **Body Params**

  `passengerIDs=[array<string>]` Arreglo con los ids de los pasajeros a actualizar en la reserva.

* **Success Response:**

  * **Code:** 204

    **Content:**

* **Error Response**
  * **Code: 400**

    **Content:** `{ error: [Mensaje de error por alguna propiedad faltante/inválida] }`

### Eliminar reserva

---

Eliminar una reserva.

* **URL**

  /booking/:id

* **Method**

  `DELETE`

* **URL Params**

  `id=[string]` Id de la reserva a eliminar

* **Query Params**

  None

* **Success Response:**

  * **Code:** 204

    **Content:**
