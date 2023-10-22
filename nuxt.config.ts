// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ["@nuxt/ui", "@nuxtjs/google-fonts", "@nuxtjs/supabase"],
    googleFonts: {
        // @ts-ignore
        "Red Hat Display": [300, 400, 500, 600, 700],
    },
    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
    },
    runtimeConfig: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        public: {
            JOKES_API_KEY: process.env.JOKES_API_KEY,
        }
    },
    supabase: {
        redirectOptions: {
            login: "/",
            callback: "/",
            exclude: ["/", "/explore", "/load-summary", "/summaries/*"],
        }
    }
});
