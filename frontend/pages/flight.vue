<template lang="html">
  <v-app dark>
    <section class="flight">
      <v-dialog v-model="flightInfoModal" width="40%">
        <v-card>
          <v-card-title class="white--text " style="background:#282c2c">
            {{ editFlight ? "Editar vuelo" : "Agregar vuelo" }}
          </v-card-title>
          <v-progress-linear
            :active="loadingFlightAction"
            :indeterminate="loadingFlightAction"
          ></v-progress-linear>

          <v-form ref="form">
            <v-card-text>
              <v-row class="mt-0 mb-0 pb-0">
                <v-col cols="6" class="pb-0">
                  <v-text-field
                    v-model="actualFlight.flightSource"
                    label="Origen"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                  <v-text-field
                    v-model="actualFlight.flightDest"
                    label="Destino"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row class="mt-0 mb-0 pb-0">
                <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                  <v-text-field
                    v-model="actualFlight.flightSeat"
                    label="Asiento"
                    required
                    outlined
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                  <v-text-field
                    v-model="actualFlight.ticketCost"
                    label="Costo del ticket"
                    required
                    outlined
                    type="number"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-text-field
                v-model="actualFlight.flightDate"
                label="Fecha"
                required
                type="date"
                outlined
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="grey darken-1"
                text
                @click="flightInfoModal = false"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="#648cac"
                text
                @click="editFlight ? updateFlight() : addFlight()"
              >
                {{ editFlight ? "Editar" : "Agregar" }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </section>
    <section class="flight-list">
      <v-col md="10">
        <v-card outlined>
          <v-card-title>
            <span class="headline">
              <v-icon> mdi-airplane-takeoff </v-icon>
              Vuelos</span
            >

            <v-btn
              fab
              absolute
              right
              small
              class="mt-2"
              color="#fad83a"
              dark
              @click="
                flightInfoModal = true;
                editFlight = false;
                clearFlight();
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
                  <th class="text-center">Origen</th>
                  <th class="text-center">Destino</th>
                  <th class="text-center">Fecha</th>
                  <th class="text-center">Asiento</th>
                  <th class="text-center">Costo</th>
                  <th class="text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in flights" :key="item.name">
                  <td class="text-center">{{ item.flightSource }}</td>
                  <td class="text-center">{{ item.flightDest }}</td>
                  <td class="text-center">{{ item.flightDate }}</td>
                  <td class="text-center">{{ item.flightSeat }}</td>
                  <td class="text-center">{{ item.ticketCost }}</td>
                  <td class="text-center">
                    <div>
                      <v-btn
                        color="#6cacdc"
                        dark
                        x-small
                        fab
                        @click="
                          flightInfoModal = true;
                          FlightToEdit = item.flightID;
                          editFlight = true;
                          setFlight(FlightToEdit);
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
                          deleteFlightModal = true;
                          FlightToDelete = item.flightID;
                        "
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
    </section>

    <v-dialog v-model="deleteFlightModal" width="50%">
      <v-card>
        <v-card-title class="white--text " style="background:#282c2c">
          Eliminar vuelo
        </v-card-title>
        <v-progress-linear
          :active="loadingDeleteFlight"
          :indeterminate="loadingDeleteFlight"
        ></v-progress-linear>
        <v-col>
          <v-card-text >
            ¿Estás seguro que deseas eliminar el vuelo?
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="grey darken-1"
              text
              @click="deleteFlightModal = false"
            >
              Cancelar
            </v-btn>
            <v-btn color="#648cac" text @click="deleteFlight()">
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
    name: 'flight',
    props: [],
    mounted () {

    },
    data () {
      return {
        loading: false,
        loadingFlightAction: false,
        loadingDeleteFlight: false,
        flightInfoModal: false,
        deleteFlightModal: false,
        FlightToEdit: null,
        FlightToDelete: null,
        editFlight: false,
        flights: [],
        actualFlight: {
          flightSource: '',
          flightDest: '',
          flightDate: '',
          flightSeat: '',
          ticketCost: ''
        },


      }
    },
    created () {
      this.getFlights()
    },
    methods: {
      async getFlights(){
        try {
          this.loading = true;
          const response = await this.$axios.get('flight');
          this.flights = response.data.map(item => {
            return {
              flightID: item.flightID,
              flightSource: item.flightSource,
              flightDest: item.flightDest,
              flightDate: item.flightDate.split('T')[0],
              flightSeat: item.flightSeat,
              ticketCost: item.ticketCost
            }
          });
          this.loading = false;

        } catch (error) {
          this.loading = false;
          console.log(error);
        }
      },

      async addFlight(){
        try {
          this.loadingFlightAction = true;
          const response = await this.$axios.post('flight', this.actualFlight);
          this.getFlights();
          this.loadingFlightAction = false;
          this.flightInfoModal = false;
          this.actualFlight = {
            flightSource: '',
            flightDest: '',
            flightDate: '',
            flightSeat: '',
            ticketCost: ''
          };
          console.log(this.flights);

        } catch (error) {
          this.loading = false;
          console.log(error);
        }
      },
      setFlight(id){
        console.log(this.flightToEdit);
        this.actualFlight = {...this.flights.find(item => item.flightID === id)};
        console.log(this.actualFlight);

      },
      async updateFlight(){
        try {
          this.loadingFlightAction = true;
          console.log(this.actualFlight);
          const response = await this.$axios.put('flight/' + this.FlightToEdit, this.actualFlight);
          this.getFlights();
          this.loadingFlightAction = false;
          this.flightInfoModal = false;
          console.log(this.flights);

        } catch (error) {
          this.loading = false;
          console.log(error);
        }
      },
      async deleteFlight(){
        try {
          this.loadingDeleteFlight = true;
          const response = await this.$axios.delete('flight/' + this.FlightToDelete);
          this.getFlights();
          this.loadingDeleteFlight = false;
          this.deleteFlightModal = false;
          console.log(this.flights);

        } catch (error) {
          this.loading = false;
          console.log(error);
        }
      },

      clearFlight(){
        this.actualFlight = {
          flightSource: '',
          flightDest: '',
          flightDate: '',
          flightSeat: '',
          ticketCost: ''
        };
      },



    },
    computed: {

    }
}
</script>
