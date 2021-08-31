<template>
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
        <button type="button" class="btn waves-effect waves-light btn-color" @click="predict">
            Predict
        </button>
    </div>
</template>

<script>
import { ref } from "vue";
import data from "@/util/http-data";
import predict from "@/util/http-predict";
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";

export default {
    name: "Graph",
    components: {
        Vue3ChartJs,
    },
    props: {
        code: { type: String },
        name: { type: String },
        type: { type: Number },
    },
    data() {
        return {
            show: false,
            chartdata: {},
        };
    },

    methods: {
        getdata(num, start, freq, freqnum, func) {
            let form = new FormData();
            if (num) form.append("num", num);
            if (start) form.append("start", start);
            form.append("name", this.name);
            if (freq) form.append("freq", freq);
            if (freqnum) form.append("freqnum", freqnum);
            data.post("/getdata", form)
                .then(({ data }) => {
                    func(data);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        uf(data) {
            if (this.type == 1) this.updateChart(this.type, data.date, data.open);
            if (this.type == 2) this.updateChart(this.type, data.time, data.open);
            this.show = true;
        },
        update() {
            if (this.type == 1) {
                this.getdata(30, "00000000", "D", "1", this.uf);
            } else if (this.type == 2) {
                this.getdata(9999, "", "1", "5", this.uf);
            }
        },
        pf(data) {
            let form = new FormData();
            form.append("data", JSON.stringify(data));
            form.append("predlen", 14);
            predict
                .post("/predict", form)
                .then(({ data }) => {
                    this.predictChart(data.date, data.open);
                    console.log(data);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        predict() {
            this.getdata(365, "00000000", "D", "1", this.pf);
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
        const updateChart = (type, label, data) => {
            data = Object.values(data).reverse();
            label = Object.values(label).reverse();
            lineChart.data.datasets[0].data = [];

            if (type == 1) {
                label = label.map((x) => x.toString().slice(4, 8));
                label = label.map((x) => x.slice(0, 2) + "." + x.slice(2, 4));
            } else if (type == 2) {
                label = label.map((x) => x.toString());
                label = label.map((x) => x.slice(0, x.length - 2) + ":" + x.slice(x.length - 2));
            }
            lineChart.options.plugins.title = {
                display: true,
            };
            lineChart.data.labels = label;
            lineChart.data.datasets[1].data = data;
            if (type == 1) {
                lineChart.options.plugins.title.text = "한달 주가";
            } else if (type == 2) {
                lineChart.options.plugins.title.text = "오늘 주가";
            }
            chartRef.value.update();
        };
        const predictChart = (label, data) => {
            data = Object.values(data);
            label = Object.values(label);
            label = label.map((x) => x.toString().slice(4, 8));
            label = label.map((x) => x.slice(0, 2) + "." + x.slice(2, 4));

            lineChart.data.labels = label.slice(label.length - 44);

            var data2 = [];
            data2.length = 29;
            lineChart.data.datasets[0].data = data2.concat(data.slice(data.length - 15));
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
.graph {
    height: 250px;
    width: 80%;
    display: inline-block;
}
.button {
    display: inline-block;
    margin-bottom: 20px;
}
.btn-color {
    background-color: rgb(190, 74, 74);
    color: white;
    margin-bottom: 50px;
    margin-left: 30px;
}
</style>
