<template lang="html">
  <v-app dark>
    <section class="flight">
      <v-dialog v-model="addFlight" width="40%">
        <v-card outlined>
          <v-card-title class="white--text " style="background:#282c2c">
            Agregar vuelo
          </v-card-title>

          <v-form>
            <v-row justify="center" class="my-4">
              <v-col md="10" class="mx-2">
                <v-text-field
                  v-model="source"
                  label="Origen"
                  required
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="destination"
                  label="Destino"
                  required
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="date"
                  label="Fecha"
                  required
                  type="date"
                  outlined
                ></v-text-field>
                <div style="display:inline">
                  <v-text-field
                    v-model="seat"
                    label="Asiento"
                    required
                    outlined
                    type="number"
                  ></v-text-field>
                  <v-text-field
                    v-model="cost"
                    label="Costo del ticket"
                    required
                    outlined
                    type="number"
                  ></v-text-field>
                </div>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="grey darken-1" text>
                    Cancelar
                  </v-btn>
                  <v-btn color="#648cac" text text>
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
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
              @click="addFlight = true"
            >
              <v-icon> mdi-airplane-plus </v-icon>
            </v-btn>
          </v-card-title>

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
                  <td class="text-center">{{ item.source }}</td>
                  <td class="text-center">{{ item.destination }}</td>
                  <td class="text-center">{{ item.date }}</td>
                  <td class="text-center">{{ item.seats }}</td>
                  <td class="text-center">{{ item.cost }}</td>
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
      </v-col>
    </section>
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

        addFlight: false,
        flights: [
          {
            source: 'Mexico',
            destination: 'Colombia',
            date: '01/01/2020',
            seats:'1',
            cost:'$100'
          },
          {
            source: 'Mexico',
            destination: 'Colombia',
            date: '01/01/2020',
            seats:'1',
            cost:'$100'
          },
          {
            source: 'Mexico',
            destination: 'Colombia',
            date: '01/01/2020',
            seats:'1',
            cost:'$100'
          },
          {
            source: 'Mexico',
            destination: 'Colombia',
            date: '01/01/2020',
            seats:'1',
            cost:'$100'
          }
        ],

        dialog2: false,
        source: '',
        destination: '',
        date: '',
        seat: '',
        cost: ''
        

      }
    },
    methods: {

    },
    computed: {

    }
}
</script>

<style scoped lang="scss">
.flight {
}
</style>
