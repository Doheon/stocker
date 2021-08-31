<template>
    <PercentageCircle :percent="percent" :animate="true" :size="size" :refresh-rate="rr" />
    <!-- <button @click="click"></button> -->
</template>

<script>
import PercentageCircle from "vue-css-percentage-circle";
export default {
    components: {
        PercentageCircle,
    },
    data() {
        return {
            size: "medium",
            rr: 10,
            color: "green",
        };
    },
    props: {
        percent: { type: Number },
    },
    methods: {
        click() {
            this.val += 10;
        },
    },
};
</script>

<style>
@import "~css-percentage-circle";
</style>
