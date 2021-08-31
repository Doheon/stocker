import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "Search",
        component: () => import(/* webpackChunkName: "about" */ "@/page/search.vue"),
    },
    {
        path: "/favorite",
        name: "Favorite",
        component: () => import(/* webpackChunkName: "about" */ "@/page/favorite.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
