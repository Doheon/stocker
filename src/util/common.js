function make_uid() {
    function s4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

export { make_uid, sleep };
