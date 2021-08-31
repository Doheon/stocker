<template>
    <graph-main ref="graph1"></graph-main>
    <button @click="update"></button>
</template>

<script>
import GraphMain from "@/components/graphMain";
export default {
    components: { GraphMain },
    data() {
        return {
            rec: "",
            unrec: "",
        };
    },
    methods: {
        update() {},
    },
    mounted() {
        this.$refs.graph1.update("삼성전자");
    },
};
</script>

<style>
.homeTitle {
    margin: 20px;
}
</style>
