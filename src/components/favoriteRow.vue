<template>
    <td @click="$router.push({ name: 'Search', query: { name: name } })">{{ name }}</td>
    <td @click="$router.push({ name: 'Search', query: { name: name } })">{{ price }}</td>
    <td @click="$router.push({ name: 'Search', query: { name: name } })" :style="{ color: color }">
        {{ change }}
    </td>
    <td style="width: 50px">
        <div id="trashImg" @click="deleteFavorite"></div>
    </td>
</template>

<script>
import { getRTData } from "@/util/http";
export default {
    data() {
        return {
            open: "",
            cur: "",
        };
    },
    props: {
        name: { type: String },
        updateList: { type: Function },
    },

    computed: {
        price() {
            return this.cur;
        },
        delta() {
            return this.cur - this.open;
        },
        color() {
            if (this.delta > 0) return "rgb(200, 111, 111)";
            else if (this.delta < 0) return "rgb(111, 111, 200)";
            else return "rgb(0,0,0)";
        },
        change() {
            if (this.price == "") {
                return "장 시작 전입니다.";
            }
            var s =
                this.delta.toString() +
                "(" +
                ((Math.abs(this.delta) / this.price) * 100).toFixed(2).toString() +
                "%" +
                ")";
            if (this.delta > 0) return "+" + s;
            else return s;
        },
    },
    methods: {
        succ(data) {
            this.open = data.Open;
            this.cur = data.Close;
            if (this.cur) {
                this.display = true;
                this.displayname = true;
            } else this.display = false;
        },
        updateData() {
            getRTData(this.name, this.succ);
        },
        deleteFavorite() {
            var favoriteList = JSON.parse(localStorage.getItem("favorites"));
            const idx = favoriteList.indexOf(this.name);
            favoriteList.splice(idx, 1);
            localStorage.setItem("favorites", JSON.stringify(favoriteList));
            this.updateList();
        },
    },
    created() {
        this.updateData();
    },
};
</script>

<style>
#trashImg {
    content: url("../assets/images/trash.png");
    height: 30px;
    width: 30px;
    z-index: 10;
}
#trashImg:hover {
    content: url("../assets/images/trash_red.png");
}
</style>
