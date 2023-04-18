import * as Vue from './node_modules/vue3/vue.esm-browser.mjs';
import * as Element from './node_modules/element-plus/index.full.mjs';
import {taikoBase64Str} from "./taiko.mjs";

// import ref
let {ref} = Vue;
let {watchEffect} = Vue;

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const numMin = ref(5);

const numMax = ref(10);


// 本数
const currentBen = ref(10);
const minBen = ref(0);
const maxBen = ref(1000);

// 记录已经打过的
let countBen = ref(0);


// 计算 timeOut 的间隔时间
const timeOut = ref(getRandomInt(numMin.value * 1000, numMax.value * 1000));

const switchValue = ref(false);

// 记录 太鼓的 Audio 对象
const taikoAudio = new Audio("data:audio/wav;base64," + taikoBase64Str());

// 记录定时任务
let timeoutId;

const switchChange = (val) => {
    if (val === false) {
        clearTimeOutTask()
    } else {
        doTask();
    }
}

const clearTimeOutTask = () => {
    if (timeoutId) {
        clearTimeout(timeoutId);
        console.log('清理定时任务');
    }
}


// 播放一个 wav 文件
const playTaiko = () => {
    // 本数 ++
    countBen.value = countBen.value + 1;
    taikoAudio.play().then(() => console.log('Playback started'));
}

const doTask = () => {
    if (switchValue.value) {
        console.log("执行延迟任务");
        playTaiko();
        timeOut.value = getRandomInt(numMin.value * 1000, numMax.value * 1000);
        console.log(`当前的延时任务时间为 ${timeOut.value}`);
        timeoutId = setTimeout(doTask, timeOut.value);
    }

}

let app = Vue.createApp({
    setup() {
        watchEffect(() => {
            timeOut.value = getRandomInt(numMin.value * 1000, numMax.value * 1000);
            clearTimeOutTask();
            doTask();
        })
        watchEffect(() => {
            if (countBen.value === currentBen.value) {
                countBen.value = 0;
                switchValue.value = false;
                // 弹出窗口
                Element.ElMessageBox.alert('恭喜你 🎉，当前训练已完成 ✅', 'Title', {
                    confirmButtonText: '确认',
                })

            }
        })
        return {numMax, numMin, switchValue, switchChange, currentBen, minBen, maxBen, countBen}
    },
});

app.use(Element);

app.mount('#app');
