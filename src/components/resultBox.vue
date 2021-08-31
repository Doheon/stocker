<template>
    <div class="results">
        <img v-if="increase" src="@/assets/images/increase.png" alt="" class="resultimg" />
        <img v-else src="@/assets/images/decrease.png" alt="" class="resultimg" />
        <p :style="{ color: color }" class="scoretext">{{ toPercent }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    computed: {
        increase() {
            return this.score > 0;
        },
        toPercent() {
            if (this.score > 0) return "+" + (this.score * 100).toFixed(2).toString() + "%";
            else return (this.score * 100).toFixed(2).toString() + "%";
        },
        color() {
            if (this.score > 0) return "rgb(180, 111, 111)";
            else return "rgb(111, 111, 180)";
        },
    },
    props: {
        score: { type: Number },
    },

    methods: {},
};
</script>

<style>
.results {
    position: relative;
    top: -20px;
    /* left: -1px; */
    width: 63px;
    text-align: center;
    /* border: 1px solid black; */
}
.resultimg {
    width: 63px;
    height: 63px;
}
.scoretext {
    margin-top: 3px;
    text-align: center;
}
</style>
