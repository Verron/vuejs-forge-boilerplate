import { createApp, provide, h } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/base.css";
import "@progress/kendo-theme-default/dist/all.css";
import { createPinia } from "pinia";
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT
})

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

const app = createApp({
  setup () {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App),
})

app.use(router);

app.use(createPinia());

app.mount("#app");
