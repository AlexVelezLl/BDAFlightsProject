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
              @click="infomodal = true; onEdit = false;clearPassenger()"
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
                  <td class="text-center">{{ item.passengerDob }}</td>
                  <td class="text-center">
                    <div>
                      <v-btn
                        color="#6cacdc"
                        dark
                        x-small
                        fab
                        @click="
                          infomodal = true;
                          actualPassenger = item;
                          onEdit = true;
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
                          deletemodal = true;
                          passengerToDelete = item.passengerID;
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
          <v-pagination
            v-model="pagination.page"
            :length="Math.ceil(pagination.totalItems / pagination.rowsPerPage)"
            :total-visible="7"
            class="mt-3"
            @input="changePage()"
          ></v-pagination>
        </v-card>
      </v-col>
    </section>

    <v-dialog v-model="infomodal" width="50%" persistent>
      <v-card>
        <v-card-title class="white--text" style="background:#282c2c">
          {{ this.onEdit ? "Editar pasajero" : "Agregar pasajero" }}
        </v-card-title>
        <v-progress-linear
          :active="loadingPassengerAction"
          :indeterminate="loadingPassengerAction"
        ></v-progress-linear>
        <v-col>
          <v-form>
            <v-card-text>
              <v-text-field
                v-model="actualPassenger.passengerName"
                label="Name"
                required
                outlined
              ></v-text-field>
              <v-text-field
                v-model="actualPassenger.passengerEmail"
                label="Correo"
                required
                outlined
                type="email"
              ></v-text-field>
              <v-text-field
                v-model="actualPassenger.passengerDob"
                label="Fecha de nacimiento"
                required
                outlined
                type="date"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="grey darken-1"
                text
                @click="
                  infomodal = false;
                  onEdit = false;
                "
              >
                Cancelar
              </v-btn>
              <v-btn
                color="#648cac"
                text
                @click="onEdit ? editPassenger() : addPassenger()"
              >
                {{ this.onEdit ? "Editar" : "Agregar" }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-col>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deletemodal" width="50%">
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
            ¿Estás seguro que deseas eliminar el pasajero?
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey darken-1" text @click="deletemodal = false">
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
        pagination: {
          page: 1,
          rowsPerPage: 7,
          totalItems: 1000
        },
        infomodal: false,
        deletemodal: false,
        loading: false,
        loadingDelete: false,
        loadingPassengerAction: false,
        actualPassenger: {
          passengerName: '',
          passengerEmail: '',
          passengerDob: ''
        },
        passengerToDelete: '',
        passengers:[],
        onEdit: false
      }
    },
    created () {
      this.getPassengers();

    },
    methods: {
      async getPassengers (limit= 7, page= 1) {
        this.loading = true;
        try {
          const response = await this.$axios.get('passenger', {
            params: {
              limit,
              page
            }
          });
          this.passengers = response.data.map(item => {
            return {
              passengerID: item.passengerID,
              passengerName: item.passengerName,
              passengerEmail: item.passengerEmail,
              passengerDob: item.passengerDOB.split('T')[0],
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
          const response = await this.$axios.post('passenger', this.actualPassenger);
          
          await this.getPassengers();
          this.loading = false;
          this.infomodal = false;
          this.clearPassenger();


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
          this.deletemodal = false;
        } catch (error) {
          console.log(error)
        }
      },

      async editPassenger () {
        this.loadingPassengerAction = true
        try {
          const response = await this.$axios.put(`passenger/${this.actualPassenger.passengerID}`, this.actualPassenger);
          await this.getPassengers();
          this.loadingPassengerAction = false;
          this.infomodal = false;
        } catch (error) {
          console.log(error)
        }
      },

      clearPassenger () {
        this.actualPassenger = {
          passengerID: '',
          passengerName: '',
          passengerEmail: '',
          passengerDob: ''
        };
      },

      async changePage () {
        await this.getPassengers(this.pagination.rowsPerPage, this.pagination.page);
      },



    },
    computed: {

    }
}
</script>
