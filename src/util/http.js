import axios from "axios";

const predict = axios.create({
    baseURL: "http://1.212.16.211:9781/",
    headers: {
        "Content-type": "application/json",
    },
    timeout: 600000,
});

const data = axios.create({
    baseURL: "http://1.212.16.211:4283/",
    headers: {
        "Content-type": "application/json",
    },
});

function getdata(name, num, start, freq, freqnum, succ, fail = null) {
    let form = new FormData();
    if (num) form.append("num", num);
    if (start) form.append("start", start);
    if (name) form.append("name", name);
    if (freq) form.append("freq", freq);
    if (freqnum) form.append("freqnum", freqnum);
    data.post("/getdata", form)
        .then(({ data }) => {
            succ(data);
        })
        .catch((error) => {
            if (fail) fail();
            console.log(error);
        });
}

//-------------get dict-------------------
function getDict(succ) {
    if (localStorage.getItem("dict") == null) requestDict(succ);
    var data = JSON.parse(localStorage.getItem("dict"));
    var now = new Date();
    var nowString =
        now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, "0") +
        now.getDate().toString().padStart(2, "0");
    if (data && data[0].DATE == nowString) {
        succ(data);
    } else {
        requestDict(succ);
    }
}
function requestDict(succ) {
    data.get("/getDict")
        .then(({ data }) => {
            succ(data);
            saveJson(data);
        })
        .catch((error) => {
            console.log(error);
        });
}

function saveJson(data) {
    localStorage.setItem("dict", JSON.stringify(data));
}

//------------------getCurPrice------------------
function getRTData(name, succ) {
    let form = new FormData();
    form.append("name", name);
    data.post("/getrtdata", form)
        .then(({ data }) => {
            succ(data);
        })
        .catch((error) => {
            console.log(error);
        });
}

//------------------getRec---------------------------

function getRec(succ) {
    data.get("/getAmount")
        .then(({ data }) => {
            let form = new FormData();
            form.append("allData", data);
            form.append("predlen", "14");
            predict
                .post("/getRecommend", form)
                .then(({ data }) => {
                    succ(data);
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch((error) => {
            console.log(error);
        });
}

export { predict, data, getdata, getDict, getRTData, getRec };
