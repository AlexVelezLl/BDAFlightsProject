<template lang="html">
  <v-app dark>
    <section>
      <v-card outilned>
        <v-card-title>
          <span class="headline">
            <v-icon> mdi-book </v-icon>
            <span>Reservas</span>
          </span>
          <v-btn
            fab
            absolute
            right
            small
            class="mt-2"
            color="#fad83a"
            dark
            @click="addFlight = true"
          >
            <v-icon> mdi-airplane-plus </v-icon>
          </v-btn>
        </v-card-title>
        <v-simple-table outlined>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center">Vuelo</th>
                <th class="text-center">Origen</th>
                <th class="text-center">Destino</th>
                <th class="text-center">Numero de pasajeros</th>
                <th class="text-center">Fecha registro</th>
                <th class="text-center">Accion</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in bookings" :key="i">
                <td class="text-center">{{ item.id }}</td>
                <td class="text-center">{{ item.source }}</td>
                <td class="text-center">{{ item.destination }}</td>
                <td class="text-center">{{ item.seats }}</td>
                <td class="text-center">{{ item.date }}</td>

                <td class="text-center">
                  <div>
                    <v-btn
                      color="#6cacdc"
                      dark
                      x-small
                      fab
                      @click="dialog2 = true"
                    >
                      <v-icon> mdi-pencil </v-icon>
                    </v-btn>
                    <v-btn color="#Dc6c7b" class="ml-2" dark x-small fab>
                      <v-icon> mdi-delete </v-icon>
                    </v-btn>
                  </div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </section>
    <v-dialog v-model="dialog2" max-width="600px">
      <v-card>
        <v-card-title class="headline">
          <span>Editar reserva</span>
        </v-card-title>
        <v-card-text >
          <v-text-field
            v-model="searchId"
            label="Vuelo"
            required
            outlined
            :append-icon="'mdi-magnify'"
            @click:append="searchBooking(searchId)"
            
          ></v-text-field>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="booking.source"
                label="Origen"
                required
                outlined
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="booking.destination"
                label="Destino"
                required
                outlined
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="booking.seats"
                label="Numero de pasajeros"
                required
                outlined
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="booking.date"
                label="Fecha de registro"
                required
                outlined
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-row class="justify-center">
          <v-col cols="11">
            <v-card outlined>
              <v-card-title>
                <span class="headline">Pasajeros de la reserva 1234</span>
                <v-btn
                  fab
                  absolute
                  right
                  small
                  class="mt-2"
                  color="primary"
                  @click="addPassennger = true"
                >
                  <v-icon> mdi-plus </v-icon>
                </v-btn>
              </v-card-title>

              <v-simple-table class="mt-1" outlined>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-center">Nombre</th>

                      <th class="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in passengers" :key="i">
                      <td class="text-center">{{ item.name }}</td>
                      <td class="text-center">
                        <div>
                          <v-btn
                            color="error"
                            dark
                            x-small
                            fab
                            @click="dialog2 = true"
                          >
                            <v-icon> mdi-delete </v-icon>
                          </v-btn>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col>
        </v-row>
        <v-card-actions class="mt-4">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog2 = false">
            Cancelar
          </v-btn>
          <v-btn color="blue darken-1" text @click="dialog2 = false">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addPassennger" width="40%">
      <v-card>
        <v-card-title class="white--text" style="background:#282c2c">
          Agregar pasajero
        </v-card-title>
        <v-col>
          <v-form>
            <v-card-text>
              <v-text-field
                v-model="actualPassenger.id"
                label="Cedula"
                required
                outlined
                :append-icon="'mdi-magnify'"
                @click:append="searchPassenger(actualPassenger.id)"
              >
              </v-text-field>
              <v-row class="justify-center ml-3">
                <v-col cols="6">
                  <strong>Nombre</strong> <br />
                  {{ actualPassenger.name }}
                </v-col>
                <v-col cols="6">
                  <strong> Nacimiento </strong> <br />
                  {{ actualPassenger.birthdate }}
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="grey darken-1" text @click="addPassennger = false">
                Cancelar
              </v-btn>
              <v-btn color="#648cac" text> Agregar </v-btn>
            </v-card-actions>
          </v-form>
        </v-col>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script lang="js">

  export default  {
    layout:'sidebar',
    name: 'booking',
    props: [],
    mounted () {

    },
    data () {
      return {
        actualPassenger: {
          id: '654686',
          name : 'Fernando a',

          birthdate: '2021-05-05'
        },
        dialog2: false,
        addPassennger: false,
        flight: '',
        searchId: '54863',
        booking: {
          id: '54863',
          source: 'Hawai',
          destination: 'Ecuador',
          seats: '10',
          date: '10/10/2020',
        },
        bookings: [
          {
            id: '12345',
            source: 'Cancun',
            destination: 'Cancun',
            seats: '2',
            date: '12/12/2020'
          },
          {
            id: '13135',
            source: 'Ecuador',
            destination: 'Cancun',
            seats: '2',
            date: '12/12/2020'
          },
          {
            id: '23165',
            source: 'Mexico',
            destination: 'Cancun',
            seats: '2',
            date: '12/12/2020'
          }
          ],
          passengers: [
          {
            id: '6546',
            name : 'Ana',
            birthdate: '2020-05-05'
          },
          {
            id: '654685',
            name : 'Alfredo',
            birthdate: '2020-05-05'
          },
          {
            id: '32468',
            name : 'Sebastian',
            birthdate: '2020-05-05'
          },
          {
            id: '321465',
            name : 'Andres',
            birthdate: '2020-05-05'
          },
          {
            id: '212654',
            name : 'Luis',
            birthdate: '2020-05-05'
          },
          {
            id: '23165',
            name : 'Pablo',
            birthdate: '2020-05-05'
          },
          {
            id: '23186',
            name : 'Federer',
            birthdate: '2020-05-05'
          },
          {
            id: '125215',
            name : 'Andres',
            birthdate: '2020-05-05'
          }
          ],


      }
    },
    created () {


    },
    methods: {

      searchPassenger(id){
        console.log(id);

        this.actualPassenger = this.passengers.find(item => item.id == id)
        console.log(this.actualPassenger);
      },
      searchBooking(id){
        console.log(id);

        this.booking = this.bookings.find(item => item.id == id)
        console.log(this.booking);
      },  



    },
    computed: {

    }
}
</script>

<style scoped lang="scss">
.booking {
}
</style>
