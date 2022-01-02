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

          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center">Nombre</th>
                  <th class="text-center">Fecha</th>
                  <th class="text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in passengersL" :key="item.name">
                  <td class="text-center">{{ item.name }}</td>
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
      </v-col>
    </section>

    <v-dialog v-model="dialog2" width="50%">
      <v-card>
        <v-card-title class="white--text" style="background:#282c2c">
          Agregar pasajero
        </v-card-title>
        <v-col>
          <v-form>
            <v-card-text>
              <v-text-field
                v-model="name"
                label="Name"
                required
                outlined
              ></v-text-field>
              <v-text-field
                v-model="date"
                label="Fecha de nacimiento"
                required
                outlined
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="grey darken-1" text @click="dialog2 = false">
                Cancelar
              </v-btn>
              <v-btn color="#648cac" text> Guardar </v-btn>
            </v-card-actions>
          </v-form>
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
        tab: null,
        dialog2: false,
        name: '',
        pass: '',
        date: '',
        items: [
          'web', 'shopping', 'videos', 'images', 'news',
        ],
        passengersL: [
          {
            name: 'Valeria',
            date: '01/01/2020',
          },
          {
            name: 'Alex',
            date: '01/01/2020',
          },
          {
            name: 'Elsa',
            date: '01/01/2020',
          },
          {
            name: 'Anna',
            date: '01/01/2020',
          }
        ],
      }
    },
    methods: {

    },
    computed: {

    }
}
</script>

<style scoped lang="scss">
.passengers {
}
</style>
