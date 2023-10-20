// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ["@nuxt/ui", "@nuxtjs/google-fonts"],
    googleFonts: {
        "Red Hat Display": [300, 400, 500, 600, 700],
    },
    app: {
        pageTransition: { name: 'page', mode: 'out-in' }
    },

});
