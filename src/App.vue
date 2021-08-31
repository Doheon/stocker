<template>
    <nav-header></nav-header>
    <div class="container">
        <router-view v-slot="{ Component }" class="content">
            <keep-alive>
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </div>
</template>

<script>
import NavHeader from "./layout/Header.vue";

export default {
    name: "App",
    components: {
        NavHeader,
    },
};
</script>

<style>
@import "https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css";
@import url(//fonts.googleapis.com/earlyaccess/jejugothic.css);
body {
    background: #f8f9fd;
}

* {
    font-family: "Jeju Gothic";
}

#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    margin-left: 150px;
}

@media (max-width: 767px) {
    #app {
        margin-left: 0px;
    }
}
</style>
