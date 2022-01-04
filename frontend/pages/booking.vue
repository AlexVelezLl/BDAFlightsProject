<template lang="html">
  <v-app dark>
    <section>
      <v-col md="12">
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
              @click="
                onEdit = false;
                bookingInfoModal = true;
                clearBooking();
              "
            >
              <v-icon> mdi-airplane-plus </v-icon>
            </v-btn>
          </v-card-title>
          <v-progress-linear
            :active="loading"
            :indeterminate="loading"
          ></v-progress-linear>
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
                  <td class="text-center">{{ item.flightID }}</td>
                  <td class="text-center">{{ item.source }}</td>
                  <td class="text-center">{{ item.destination }}</td>
                  <td class="text-center">
                    {{ item.passengerIDs ? item.passengerIDs.length : 0 }}
                  </td>
                  <td class="text-center">{{ item.bookingDate }}</td>

                  <td class="text-center">
                    <v-col>
                      <v-btn
                        color="#6cacdc"
                        dark
                        x-small
                        fab
                        @click="
                          bookingInfoModal = true;
                          BookingToEdit = item.id;
                          onEdit = true;
                          setBooking(item);
                        "
                      >
                        <v-icon> mdi-pencil </v-icon>
                      </v-btn>
                      <v-btn
                        color="#Dc6c7b"
                        class="ml-2"
                        dark
                        x-small
                        fab
                        @click="
                          deleteModal = true;
                          BookingToDelete = item.id;
                        "
                      >
                        <v-icon> mdi-delete </v-icon>
                      </v-btn>
                    </v-col>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </section>
    <v-dialog v-model="bookingInfoModal" max-width="600px">
      <v-card>
        <v-card-title class="headline" style="background:#282c2c">
          <span class="white--text">{{
            onEdit ? "Editar reserva" : "Agregar reserva"
          }}</span>
        </v-card-title>
        <v-progress-linear
          :active="loadingAction"
          :indeterminate="loadingAction"
        ></v-progress-linear>

        <v-card-text class="mx-3 pb-0 mb-0 mt-4">
          <v-row>
            <v-col cols="9" class="pb-0">
              <v-text-field
                v-model="actualBooking.bookingID"
                label="Id vuelo"
                outlined
                required
                :readonly="onEdit"
                class="ml-0 pl-0"
                :append-icon="!onEdit ? 'mdi-magnify' : ''"
                @click:append="searchFlight(actualBooking.bookingID)"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="mt-2">
            <v-col cols="6" class="pt-0">
              <strong>Origen:</strong> <br />
              {{ actualBooking.source }}
            </v-col>
            <v-col cols="6" class="pt-0">
              <strong>Destino:</strong> <br />
              {{ actualBooking.destination }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" class="pt-0">
              <strong>Fecha del vuelo:</strong> <br />
              {{ actualBooking.flightDate }}
            </v-col>
            <v-col cols="6" class="pt-0">
              <strong>Numero de pasajeros:</strong> <br />
              {{
                actualBooking.passengerIDs
                  ? actualBooking.passengerIDs.length
                  : 0
              }}
            </v-col>
          </v-row>
        </v-card-text>
        <v-row class="justify-center mt-3">
          <v-col cols="11">
            <v-card outlined>
              <v-card-title style="background-color: #757575;">
                <span class="white--text">Pasajeros de la reserva 1234</span>
                <v-btn
                  fab
                  absolute
                  right
                  small
                  class="my-2"
                  color="#6cacdc"
                  dark
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
                    <tr
                      v-for="(item, i) in actualBooking.passengerIDs"
                      :key="i"
                    >
                      <td class="text-center">{{ item.passengerName }}</td>
                      <td class="text-center">
                        <div>
                          <v-btn
                            color="error"
                            dark
                            x-small
                            fab
                            @click="bookingInfoModal = true"
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
          <v-btn color="blue darken-1" text @click="bookingInfoModal = false">
            Cancelar
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="
              bookingInfoModal = false;
              onEdit ? editBooking() : addBooking();
            "
          >
            {{ onEdit ? "Editar" : "Agregar" }}
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
              <v-autocomplete
                v-model="nameSearch"
                :loading="loading"
                :items="passengersResult"
                :search-input.sync="search"

                itemn-value="passegnerID"
                item-text="passengerName"
                cache-items
                outlined
                
              
              
                hide-no-data
                hide-details
                label="Nombre"
                class="mb-2"
                return-object
                
              >
              </v-autocomplete>
              <v-row class="justify-center ml-3">
                <v-col cols="6">
                  <strong>Nombre</strong> <br />
                  {{ nameSearch ? nameSearch.passengerName : "-" }}
                </v-col>
                <v-col cols="6">
                  <strong> Nacimiento </strong> <br />
                  {{ nameSearch ? nameSearch.passengerDOB.split('T')[0] : "-" }}
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="grey darken-1" text @click="addPassennger = false">
                Cancelar
              </v-btn>
              <v-btn
                color="#648cac"
                text
                :disabled="actualPassenger == null"
                @click="
                  addPassennger = false;
                  addPassenger();
                "
              >
                Agregar
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-col>
      </v-card>
    </v-dialog>
    <!--- Modal de confirmacion de eliminacion --->
    <v-dialog v-model="deleteModal" max-width="50%">
      <v-card>
        <v-card-title class="headline" style="background:#282c2c">
          <span class="white--text">Eliminar reserva</span>
        </v-card-title>
        <v-progress-linear
          :active="loadingAction"
          :indeterminate="loadingAction"
        ></v-progress-linear>
        <v-col class="ma-0">
          <v-card-text class="pb-0">
            Esta seguro que desea eliminar la reserva?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" text @click="deleteModal = false">
              Cancelar
            </v-btn>
            <v-btn color="red darken-1" text @click="deleteBooking">
              Eliminar
            </v-btn>
          </v-card-actions>
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
    computed:{
      items(){
        return this.passengersResult;
      },
    },
    watch:{
      async search(val){
        await this.searchPassenger(val);
        console.log(this.passengersResult);
      }
    },
    data () {
      return {
        search : null,
        num : 0,
        passengerResult : '',
        passengersResult: [],
        nameSearch: '',
        onEdit: false,
        loading: false,
        loadingAction: false,
        deleteModal: false,
        BookingToEdit: '',
        BookingToDelete: '',
        actualPassenger: {
          id: '654686',
          name : '',
          birthdate: ''
        },
        actualBooking : {
          bookingID: '',
          source: '',
          destination: '',
          bookingDate: '',
          flightDate: '',
          passengerIDs: [
            {
              name: 'Fernandoa',
              birthdate: '2021-05-05'
            },
            {
              name: 'Fernandob',
              birthdate: '2021-05-05'
            },
            {
              name: 'Ana',
              birthdate: '2021-05-05'
            }

          ]

        },
        passengerIDs: [
          {
            id: '654686',
            name : 'Cristina Lorena',
            birthdate: '2021-05-05'
          },
          {
            id: '654686',
            name : 'Alicia',
            birthdate: '2021-05-05'
          },
          {
            id: '654686',
            name : 'Nicolas',
            birthdate: '2021-05-05'
          },
          {
            id: '654686',
            name : 'Amelia',
            birthdate: '2021-05-05'
          },
          {
            id: '654686',
            name : 'Lucia',
            birthdate: '2021-05-05'
          },
          {
            id: '654686',
            name : 'Fernando Lopez',
            birthdate: '2021-05-05'
          },
          {
            id: '654686',
            name : 'Ariel Castro',
            birthdate: '2021-05-05'
          }
        ],
        bookings : [],
        bookingInfoModal: false,
        addPassennger: false,
        flight: '',
        searchId: '54863',



      }
    },
    created () {
      this.getBookings();



    },
    methods: {

      printActual(){
        console.log(this.nameSearch);

      },
      async searchPassenger(name){
         this.loadingAction = true
        let response = await this.$axios.get('passenger', {
          params: {
            name: name
          }
        });
        this.passengersResult = response.data
        this.loadingAction = false
        
      },

      addPassenger(){
        console.log("Agregando pasajero");
        console.log(this.nameSearch);
        this.actualBooking.passengerIDs.push(this.nameSearch);
        this.addPassennger = false
      },
      searchBooking(id){
        console.log(id);

        this.booking = this.bookings.find(item => item.id == id)
        console.log(this.booking);
      },

      async getBookings () {
        try {
          this.loading = true
          const response = await this.$axios.get('booking')
          this.bookings = response.data.map(item => {
            return {
              bookingID: item.bookingID,
              flightID: item.flightID,
              bookingDate: item.bookingDate.split('T')[0],
              source: 'source prueba',
              destination: 'destination prueba',
              flightDate: '2021-05-05',
              passengerIDs: [{
                id: '654686',
                name : 'Fernando a',
                birthdate: '2021-05-05'
              },
              {
                id: '654685',
                name : 'Alfredo',
                birthdate: '2021-05-05'
              },
              {
                id: '32468',
                name : 'Sebastian',
                birthdate: '2021-05-05'
              },
              {
                id: '321465',
                name : 'Andres',
                birthdate: '2021-05-05'
              },
              {
                id: '212654',
                name : 'Luis',
                birthdate: '2021-05-05'
              },
              {
                id: '23165',
                name : 'Pablo',
                birthdate: '2021-05-05'
              },
              {
                id: '23186',
                name : 'Federer',
                birthdate: '2021-05-05'
              },
              {
                id: '125215',
                name : 'Andres',
                birthdate: '2021-05-05'
              }
              ]

            }
          })
          this.loading = false
        } catch (error) {
          console.log(error)
          this.loading = false
        }
      },

      setBooking(booking){
        this.actualBooking = {...booking}
        console.log(booking);
      },

      async searchFlight(id){
        try {
          this.loadingAction = true
          const response = await this.$axios.get('flight/'+id)
          this.actualBooking.flightID = response.data.flightID
          this.actualBooking.source = response.data.flightSource
          this.actualBooking.destination = response.data.flightDest
          this.actualBooking.flightDate = response.data.flightDate.split('T')[0]
          this.actualBooking.passengerIDs = []
          this.loadingAction = false
        } catch (error) {
          console.log(error)
          this.loading = false
        }
      },

      clearBooking(){
        this.actualBooking = {
          bookingID: '',
          flightID: '',
          bookingDate: '',
          source: '',
          destination: '',
          passengerIDs: []
        }
      },

      async deleteBooking () {
        try {
          this.loadingAction = true
          const response = await this.$axios.delete('booking/'+this.BookingToDelete)
          this.loadingAction = false
          this.deleteModal = false
          this.getBookings()
        } catch (error) {
          console.log(error)
          this.loading = false
        }
      },

      async addBooking () {
        try {
          this.loadingAction = true
          //flightID, bookingDate, passengerIDs
          let data = {
            flightID: this.actualBooking.flightID,
            bookingDate: this.actualBooking.bookingDate,
            passengerIDs: [this.actualBooking.passengerIDs.map(item => item.id)]
          }
          // const response = await this.$axios.post('booking', this.actualBooking)
          // this.loadingAction = false
          // this.getBookings()
        } catch (error) {
          console.log(error)
          this.loading = false
        }
      },



    },
}
</script>

<style scoped lang="scss">
.booking {
}
</style>
