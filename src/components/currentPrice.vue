<template>
    <div v-if="displayname" id="nameText">{{ name }}</div>
    <div v-if="display" id="textchange">
        <div id="priceText">{{ price }}</div>
        <div id="changeText" :style="{ color: color }">{{ change }}</div>
    </div>
    <button
        type="button"
        class="btn waves-effect waves-light btn-color bbb"
        @click="updateData(name)"
        style="font-size: 14.5px"
        v-if="display"
    >
        <img src="@/assets/images/reload2.png" alt="" class="btnimg" />
    </button>
    <button
        type="button"
        class="btn waves-effect waves-light btn-color bbb"
        @click="clickFavorite"
        style="font-size: 14.5px"
        v-if="display"
    >
        <img v-if="isFavorite" src="@/assets/images/remove.png" alt="" class="btnimg" />
        <img v-else src="@/assets/images/add.png" alt="" class="btnimg" />
    </button>
</template>

<script>
import { getRTData } from "@/util/http";
import { sleep } from "@/util/common";
export default {
    data() {
        return {
            open: "",
            cur: "",
            display: "",
            displayname: "",
            isFavorite:
                localStorage.getItem("fovorites") &&
                JSON.parse(localStorage.getItem("fovorites")).includes(this.name),
        };
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
            else return "rgb(111, 111, 200)";
        },
        change() {
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
    props: {
        name: { type: String },
    },

    methods: {
        checkIsFavorite() {
            this.isFavorite =
                localStorage.getItem("favorites") &&
                JSON.parse(localStorage.getItem("favorites")).includes(this.name);
        },
        succ(data) {
            this.open = data.Open;
            this.cur = data.Close;
            if (this.cur) {
                this.display = true;
                this.displayname = true;
            } else this.display = false;
            this.checkIsFavorite();
        },
        updateData(name) {
            getRTData(name, this.succ);
        },
        async recursiveUpdate() {
            console.log("asdf");
            if (this.name) {
                this.updateData(this.name);
            }
            sleep(3000).then(() => this.recursiveUpdate());
        },

        clickFavorite() {
            var favoriteList = [];
            if (localStorage.getItem("favorites") == null) {
                favoriteList = [this.name];
            } else {
                favoriteList = JSON.parse(localStorage.getItem("favorites"));
                if (favoriteList.includes(this.name)) {
                    const idx = favoriteList.indexOf(this.name);
                    favoriteList.splice(idx, 1);
                } else {
                    favoriteList.push(this.name);
                }
            }

            localStorage.setItem("favorites", JSON.stringify(favoriteList));
            this.checkIsFavorite();
        },
    },
    created() {
        // this.recursiveUpdate();
    },
};
</script>

<style>
#nameText {
    position: relative;
    top: -15px;
    display: inline-block;
    /* border: 1px solid rgb(212, 212, 212); */
    font-size: 40px;
    z-index: -10;
    color: black;
    font-weight: bold;
    padding-top: 20px;
    margin-bottom: 20px;
    margin-top: 10px;
}
#priceText {
    font-size: 30px;
    font-weight: bold;
    /* border: 1px solid rgb(212, 212, 212); */
    margin-top: 15px;
    color: rgb(0, 0, 0);
}
#changeText {
    font-size: 20px;
    margin-bottom: 25px;
}

#textchange {
    display: inline-block;
    margin-right: 20px;
    /* border: 2px solid rgb(129, 129, 129); */
    margin: 10px;
    padding: 0px 10px 0px 10px;
}

.bbb {
    width: 35px;
    height: 35px;
    text-align: center;
    padding: 0;
    margin: 2px;
    background-color: rgb(63, 63, 63);
}

.btnimg {
    width: 25px;
    height: 25px;
    margin: auto;
    display: inline-block;
}

@media (max-width: 767px) {
    #nameText {
        font-size: 30px;
    }
    #priceText {
        font-size: 20px;
    }
    #changeText {
        font-size: 15px;
    }
}
</style>
