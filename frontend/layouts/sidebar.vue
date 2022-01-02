<template>
  <v-app>
    <v-btn>
      akjsfhlkjas
      </v-btn>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped-top="true"
      fixed
      app
      id="menu"
      permanent
      dark
    >
      <v-list-item >
        <v-list-item-action>
          <v-img contain width="75px" :src="require('../assets/plane.png')"></v-img>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="white--text"
            ><h3>Plane <br> Tickets </h3> </v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list nav dense >
        <div v-for="(link, i) in linksAdmin" :key="i">
          
          <v-list-item v-if="!link.subLinks" :to="link.to" class="v-list-item-o" >
            <v-list-item-icon>
              <v-icon dark>{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content :to="link.to">
              <v-list-item-title class="white--text">{{ link.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          
        </div>
      </v-list>

     
    </v-navigation-drawer>
    <v-app-bar :clipped-right="true" fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer />

  
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<style scoped>
#menu {
 
  background: #252d2e
}
.v-list-item-o:hover{
  background: #909c9f

}
.v-list-item-o:active{
  background: #909c9f

}
</style>
<script>
export default {
  data() {
    return {

      drawer: false,
      fixed: false,
      linksAdmin: [
        {
          to: "flight",
          icon: "mdi-airplane",
          text: "Vuelos",
        },
        {
          to: "passengers",
          icon: "mdi-account",
          text: "Pasajeros",
        },
        {
          to: "booking",
          icon: "mdi-book",
          text: "Reservas",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Administrador",
    };
  },
  async created() {
  },
  methods: {
  },
};
</script>