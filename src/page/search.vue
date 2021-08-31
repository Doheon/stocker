<template>
    <div id="search">
        <div class="input-group">
            <input
                type="text"
                :class="inputClass"
                @input="onInput"
                @keydown.up.prevent="cursorUp"
                @keydown.down.prevent="cursorDown"
                @keydown.enter="clickSearch(input)"
                @blur="blur"
                @focus="focus"
                :autofocus="autoFocus"
                class="form-control"
                v-model="input"
            />
            <div class="input-group-append">
                <button
                    type="button"
                    class="btn waves-effect waves-light btn-custom"
                    @click="clickSearch(input)"
                >
                    <i class="fa fa-search mr-1"></i> Search
                </button>
            </div>
        </div>
        <div class="kr-auto-complete">
            <div class="matches-box" v-if="matches">
                <template v-if="matches.length === 0"> </template>
                <template v-else>
                    <ul :class="ulClass">
                        <li
                            v-for="(match, idx) in matches.slice(0, showlength)"
                            :key="idx"
                            :class="[liClass, cursorOffset === idx ? activeClass : '']"
                            @click="cursorSelect"
                            @mouseenter="cursorMove(idx)"
                            class="list"
                        >
                            &nbsp;{{ match }}
                        </li>
                    </ul>
                </template>
            </div>
        </div>
        <current-price :name="curInput" ref="cp"></current-price>
        <graph-day ref="graph1"></graph-day>
        <graph-min ref="graph2" style="margin-top: 50px"></graph-min>
    </div>
</template>

<script>
import GraphDay from "@/components/graphSearchDay";
import GraphMin from "@/components/graphSearchMin";
import CurrentPrice from "@/components/currentPrice";
import { getDict } from "@/util/http";
const hangul = require("hangul-js");

export default {
    name: "search",
    components: {
        GraphDay,
        GraphMin,
        CurrentPrice,
    },
    data: function () {
        return {
            input: null,
            data: null,
            debounceTimer: null,
            matches: null,
            cursorOffset: null,
            lastInputValue: null,
            showlength: 15,
            curInput: null,
        };
    },
    props: {
        debounceTime: {
            type: Number,
            default: 50,
        },
        inputClass: {
            type: String,
            required: false,
            default: "",
        },
        ulClass: {
            type: String,
            required: false,
            default: "",
        },
        liClass: {
            type: String,
            required: false,
            default: "",
        },
        activeClass: {
            type: String,
            required: false,
            default: "cursor",
        },
        autoFocus: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    methods: {
        clickSearch(val) {
            getDict((data) => {
                data = data.map((x) => x.NAME);
                if (data.includes(val)) {
                    this.resetMatches();
                    this.curInput = val;
                    this.$refs.cp.updateData(val);
                    this.$refs.graph1.update(val);
                    this.$refs.graph2.update(val);
                } else {
                    alert("존재하지 않는 종목입니다.");
                }
            });
        },
        load(data) {
            data = data.map((x) => x.NAME);
            data.sort();
            this.data = data;
            this.data = this.data.map((word) => {
                return {
                    original: word,
                    disassembled: hangul.disassemble(word).join("").toLowerCase(),
                };
            });
        },
        onInput(e) {
            if (e.target.value === this.lastInputValue) {
                return;
            }
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
            }
            this.input = e.target.value;
            this.debounceTimer = setTimeout(() => {
                this.search(this.input);
                this.debounceTimer = null;
                this.lastInputValue = e.target.value;
            }, this.debounceTime);
        },
        search(input) {
            if (input === null || input.length === 0) {
                this.matches = [];
                return;
            }
            this.matches = this.findMatches(input);
            this.initCursor();
        },
        findMatches(input) {
            const disassembledInput = hangul.disassemble(input).join("").toLowerCase();
            let matches = [];
            if (this.data === null) {
                console.warn("data is not set. make sure you implemented function for @load");
                return [];
            }
            this.data.forEach(({ original, disassembled }) => {
                if (disassembled.indexOf(disassembledInput) > -1) {
                    matches.push([original, disassembled.indexOf(disassembledInput)]);
                }
            });
            matches.sort((a, b) => {
                if (a[1] > b[1]) return 1;
                if (a[1] < b[1]) return -1;
                return 0;
            });
            return matches.map((x) => x[0]);
        },
        /**
         * Init cursor offset
         */
        initCursor() {
            this.cursorOffset = -1;
        },
        /**
         * Handle arrow up
         * @param e
         */
        cursorUp(e) {
            e.preventDefault();
            if (this.cursorOffset > 0) {
                this.cursorOffset--;
            } else {
                this.cursorOffset = this.showlength - 1;
            }
            this.input = this.matches[this.cursorOffset];
        },
        /**
         * Handle arrow down
         * @param e
         */
        cursorDown(e) {
            e.preventDefault();
            if (this.cursorOffset < this.showlength - 1) {
                this.cursorOffset++;
            } else {
                this.cursorOffset = 0;
            }
            this.input = this.matches[this.cursorOffset];
        },
        cursorMove(idx) {
            this.cursorOffset = idx;
        },
        /**
         * Handle enter
         */
        cursorSelect() {
            if (this.cursorOffset < 0) {
                return;
            }
            this.input = this.matches[this.cursorOffset];
            this.initCursor();
            this.resetMatches();
            this.clickSearch(this.input);
        },
        resetMatches() {
            this.matches = null;
        },
        blur(e) {
            this.$emit("blur", e);
        },
        focus(e) {
            this.$emit("focus", e);
        },
    },
    mounted() {
        getDict(this.load);
        if (this.$route.query.name) {
            this.input = this.$route.query.name;
            this.clickSearch(this.input);
        }
    },
    beforeRouteEnter(to, from, next) {
        next();
        if (to.query.name) {
            this.input = to.query.name;
            this.clickSearch(this.input);
        }
    },
};
</script>

<style lang="scss" scoped>
.list {
    text-align: left;
}
.kr-auto-complete {
    position: relative;
    .matches-box {
        padding-right: 79.41px;
        position: absolute;
        width: 100%;
        ul {
            background-color: white;
            list-style-type: none;
            padding: 0;
            li.cursor {
                background-color: #ddd;
            }
            li:hover {
                cursor: pointer;
            }
            border: 1px solid rgba(134, 134, 134, 0.507);
        }
    }
}

.input-group {
    margin-top: 50px;
}

body {
    margin-top: 20px;
}
.card-box {
    padding: 20px;
    border-radius: 3px;
    margin-bottom: 30px;
    background-color: #fff;
}
.search-result-box .tab-content {
    padding: 30px 30px 10px 30px;
    -webkit-box-shadow: none;
    box-shadow: none;
    -moz-box-shadow: none;
}

.search-result-box .search-item {
    padding-bottom: 20px;
    border-bottom: 1px solid #e3eaef;
    margin-bottom: 20px;
}
.text-success {
    color: #0acf97 !important;
}

.btn-custom {
    background-color: #3d3d3d;
    /* border-color: #02c0ce; */
}

.btn-custom,
.btn-danger,
.btn-info,
.btn-inverse,
.btn-pink,
.btn-primary,
.btn-purple,
.btn-success,
.btn-warning {
    color: #fff !important;
}
</style>
