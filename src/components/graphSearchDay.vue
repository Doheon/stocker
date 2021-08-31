<template>
    <div>
        <div class="graph">
            <vue3-chart-js
                :id="lineChart.id"
                ref="chartRef"
                :type="lineChart.type"
                :data="lineChart.data"
                :options="lineChart.options"
                v-show="show"
            ></vue3-chart-js>
        </div>
        <div class="button" v-show="show">
            <div class="rec">
                <progress-circle
                    v-if="displayProgress"
                    :percent="percent"
                    style="margin: auto"
                ></progress-circle>
                <result-box v-if="displayResult" :score="score" />
            </div>

            <button
                type="button"
                class="btn waves-effect waves-light btn-color prdbtn"
                @click="predict"
            >
                예측
            </button>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { predict, getdata } from "@/util/http";
import { make_uid } from "@/util/common";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import ProgressCircle from "@/components/progressCircle";
import ResultBox from "@/components/resultBox";

export default {
    name: "GraphSearchDay",
    components: {
        Vue3ChartJs,
        ProgressCircle,
        ResultBox,
    },
    props: {
        code: { type: String },
    },
    data() {
        return {
            show: false,
            name: "",
            count: 7,
            totalCount: 7,
            trainLen: 90,
            uid: "",
            score: 0,
            displayProgress: false,
            displayResult: false,
        };
    },
    computed: {
        percent() {
            return ((this.totalCount - this.count) / (this.totalCount + 1)) * 100;
        },
    },

    methods: {
        uf(data) {
            this.updateChart(data.date, data.open);
            this.show = true;
        },
        update(name) {
            this.name = name;
            this.displayResult = false;
            getdata(this.name, 30, "00000000", "D", "1", this.uf);
        },
        pf(data) {
            let form = new FormData();
            var isEnd = this.count == 0;
            var predlen = 14;
            form.append("data", JSON.stringify(data));
            form.append("predlen", predlen);
            form.append("uid", this.uid);
            form.append("isEnd", isEnd);
            predict
                .post("/predict", form)
                .then(({ data }) => {
                    this.predict_one(data);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        predict_one(data = null) {
            this.count -= 1;
            // console.log(this.count);
            if (this.count < 0) {
                this.score = data.score[0];
                this.predictChart(data.date, data.open, 30, 14);
                this.displayProgress = false;
                this.displayResult = true;
                return;
            }
            getdata(this.name, this.trainLen, "00000000", "D", "1", this.pf);
        },
        predict() {
            this.displayResult = false;
            this.displayProgress = true;
            this.count = this.totalCount;
            this.uid = make_uid();
            this.predict_one();
        },
    },

    setup() {
        const chartRef = ref(null);
        const lineChart = {
            id: "line",
            type: "line",
            data: {
                datasets: [
                    {
                        borderColor: "rgba(255, 99, 132,1)",
                        pointRadius: 2.0,
                        borderWidth: 1,
                    },
                    {
                        borderColor: "rgba(133, 99, 255,1)",
                        pointRadius: 2.0,
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: "",
                    },
                },
            },
        };
        const updateChart = (label, data) => {
            data = Object.values(data).reverse();
            label = Object.values(label).reverse();
            lineChart.data.datasets[0].data = [];
            label = label.map((x) => x.toString().slice(4, 8));
            label = label.map((x) => x.slice(0, 2) + "." + x.slice(2, 4));
            lineChart.data.labels = label;
            lineChart.data.datasets[1].data = data;
            lineChart.options.plugins.title.text = "일별 주가";
            chartRef.value.update();
        };
        const predictChart = (label, data, curlen, prelen) => {
            data = Object.values(data);
            label = Object.values(label);
            label = label.map((x) => x.toString().slice(4, 8));
            label = label.map((x) => x.slice(0, 2) + "." + x.slice(2, 4));

            lineChart.data.labels = label.slice(label.length - curlen - prelen);
            var data2 = [];
            data2.length = curlen - 1;
            lineChart.data.datasets[0].data = data2.concat(data.slice(data.length - prelen - 1));
            chartRef.value.update();
        };

        return {
            lineChart,
            updateChart,
            chartRef,
            predictChart,
        };
    },
};
</script>

<style>
.prdbtn {
    background-color: rgb(235, 133, 133);
}
.rec {
    width: 63px;
    height: 63px;
    margin: auto;
    margin-top: 95px;
    text-align: center;
    /* border: solid 1px black; */
}
.graph {
    height: 250px;
    width: 80%;
    display: inline-block;
}
.button {
    width: 15%;
    float: right;
    margin-bottom: 20px;
    padding: 0 10px;
}
.btn-color {
    width: 80px;
    color: white;
    margin-top: 10px;
    margin-bottom: 0px;
}
.updatebtn {
    background-color: rgb(71, 71, 71);
}
</style>
