<template>
  <v-app dark>
    <section class="passengers-list">
      <v-col md="10">
        <v-card outlined>
          <v-card-title>
            <span class="headline">
              <v-icon> mdi-account</v-icon>
              Pasajeros</span
            >
            <v-btn
              fab
              small
              dark
              absolute
              right
              color="#fad83a"
              @click="dialog2 = true"
            >
              <v-icon> mdi-account-plus </v-icon>
            </v-btn>
          </v-card-title>
          <v-progress-linear
            :active="loading"
            :indeterminate="loading"
          ></v-progress-linear>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center">Nombre</th>
                  <th class="text-center">Corrreo</th>
                  <th class="text-center">Nacimiento</th>
                  <th class="text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in passengers" :key="item.name">
                  <td class="text-center">{{ item.passengerName }}</td>
                  <td class="text-center">{{ item.passengerEmail }}</td>
                  <td class="text-center">{{ item.passengerDOB }}</td>
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
                      <v-btn
                        color="#Dc6c7b"
                        class="ml-2"
                        dark
                        x-small
                        fab
                        @click="dialog3 = true; passengerToDelete = item.passengerID" 
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

    <v-dialog v-model="dialog2" width="50%">
      <v-card>
        <v-card-title class="white--text" style="background:#282c2c">
          Agregar pasajero
        </v-card-title>
        <v-progress-linear
          :active="loading"
          :indeterminate="loading"
        ></v-progress-linear>
        <v-col>
          <v-form>
            <v-card-text>
              <v-text-field
                v-model="newPassenger.passengerName"
                label="Name"
                required
                outlined
              ></v-text-field>
              <v-text-field
                v-model="newPassenger.passengerEmail"
                label="Correo"
                required
                outlined
                type="email"
              ></v-text-field>
              <v-text-field
                v-model="newPassenger.passengerDob"
                label="Fecha de nacimiento"
                required
                outlined
                type="date"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="grey darken-1" text @click="dialog2 = false">
                Cancelar
              </v-btn>
              <v-btn color="#648cac" text @click="addPassenger()">
                Guardar
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-col>
      </v-card>
    </v-dialog>
    <!--dialog to confirm delete passenger-->
    <v-dialog v-model="dialog3" width="50%">
      <v-card>
        <v-card-title class="white--text" style="background:#282c2c">
          Eliminar pasajero
        </v-card-title>
        <v-progress-linear
          :active="loadingDelete"
          :indeterminate="loadingDelete"
        ></v-progress-linear>
        <v-col>
          <v-card-text>
            Estas seguro que deseas eliminar el pasajero?
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey darken-1" text @click="dialog3 = false">
              Cancelar
            </v-btn>
            <v-btn color="#648cac" text @click="deletePassenger()">
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
    layout: 'sidebar',
    name: 'passengers',
    props: [],
    mounted () {

    },
    data () {
      return {
        dialog2: false,
        dialog3: false,
        tab: null,
        dialog2: false,
        loading: false,
        loadingDelete: false,
        newPassenger: {
          passengerName: '',
          passengerEmail: '',
          passengerDob: ''
        },
        passengerToDelete: '',
        passengers:[],
      }
    },
    created () {
      this.getPassengers();

    },
    methods: {
      async getPassengers () {
        this.loading = true;
        try {
          const response = await this.$axios.get('passenger')
          this.passengers = response.data.map(item => {
            return {
              passengerID: item.passengerID,
              passengerName: item.passengerName,
              passengerEmail: item.passengerEmail,
              passengerDOB: item.passengerDOB.split('T')[0],
            }
          })
          this.loading = false;
        } catch (error) {
          console.log(error)
        }
      },

      async addPassenger () {
        this.loading = true
        try {
          const response = await this.$axios.post('passenger', this.newPassenger);
          this.newPassenger = {
            passengerID: '',
            passengerName: '',
            passengerEmail: '',
            passengerDob: ''
          };
          await this.getPassengers();
          this.loading = false;
          this.dialog2 = false;


        } catch (error) {
          console.log(error)
        }
      },

      async deletePassenger () {
        this.loadingDelete = true
        try {
          const response = await this.$axios.delete(`passenger/${this.passengerToDelete}`);
          await this.getPassengers();
          this.loadingDelete = false;
          this.dialog3 = false;
        } catch (error) {
          console.log(error)
        }
      },

 

    },
    computed: {

    }
}
</script>

<style scoped lang="scss">
.passengers {
}
</style>
