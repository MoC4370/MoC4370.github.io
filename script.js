// 加载时间计时
let startTime = Date.now();
let timer = setInterval(() => {
    let seconds = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('loading-time').textContent = seconds;
}, 1000);

// 进度条动画（模拟加载进度）
let progress = 0;
let progressBar = document.getElementById('progress-bar');
let progressText = document.getElementById('progress-text');
let fakeLoading = setInterval(() => {
    if (progress < 100) {
        progress += Math.random() * 7 + 2; // 随机增长
        if (progress > 100) progress = 100;
        progressBar.style.width = progress + '%';
        progressText.textContent = '正在加载资源... ' + Math.floor(progress) + '%';
    } else {
        progressBar.style.width = '100%';
        progressText.textContent = '加载完成，欢迎进入服务器！';
        clearInterval(fakeLoading);
        clearInterval(timer);
    }
}, 600);

// GMod加载进度回调
function SetStatusChanged(status) {
    document.getElementById('progress-text').textContent = status;
}
function SetFilesTotal(total) {
    window._filesTotal = total;
}
function SetFilesNeeded(needed) {
    window._filesNeeded = needed;
    let percent = 100;
    if (window._filesTotal && window._filesTotal > 0) {
        percent = 100 * (window._filesTotal - needed) / window._filesTotal;
    }
    document.getElementById('progress-bar').style.width = percent + '%';
    document.getElementById('progress-text').textContent = '正在加载资源... ' + Math.floor(percent) + '%';
}

// 高级音乐播放菜单
const musicData = [
    {
        file: '1.mp3',
        title: 'A Little Story',
        artist: 'Valentin (ヴァレンティン)',
        cover: 'http://img2.kuwo.cn/star/albumcover/500/86/1/3780483634.jpg',
        bg: 'https://th.bing.com/th/id/R.3de67f9cf03ac34bcc51bf0c0f3e9049?rik=A0mpck5SeWnxhA&riu=http%3a%2f%2fi1.hdslb.com%2fbfs%2farchive%2ff352a519b391ebe27cee746b392ecbd72b4e8a22.png&ehk=o938wQtyXBajleCezi7rGFPxV23F3IY8F87VgnEXsZQ%3d&risl=1&pid=ImgRaw&r=0'
    },
    {
        file: '2.mp3',
        title: '青い号哭',
        artist: 'カンザキイオリ',
        cover: 'https://m.media-amazon.com/images/I/51St+t+CRNL._SL200_.jpg?r=2025053123',
        bg: 'https://tse1.mm.bing.net/th/id/OIP.1Fk9wD2EQBVyjs9hqPXg5QHaEo?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    {
        file: '3.mp3',
        title: 'お礼参り',
        artist: '羽生まゐご',
        cover: 'http://img2.kuwo.cn/star/albumcover/500/42/22/620264958.jpg',
        bg: 'https://th.bing.com/th/id/R.250564ed34886a0384c48b6b8c068656?rik=8Y78Nhj8dAYQHw&riu=http%3a%2f%2fqqpublic.qpic.cn%2fqq_public%2f0%2f0-2458557161-250564ED34886A0384C48B6B8C068656%2f0%3ffmt%3djpg%26size%3d190%26h%3d506%26w%3d900%26ppv%3d1.jpg&ehk=G3x%2bxNRVBqwkDlTGJ7iL%2fTs49p963NEzTXUCOuPrKew%3d&risl=&pid=ImgRaw&r=0'
    },
    {
        file: '4.mp3',
        title: 'China-X',
        artist: '徐梦圆',
        cover: 'http://img2.kuwo.cn/star/albumcover/500/89/40/1643964342.jpg',
        bg: 'https://wallpapercave.com/wp/wp3213208.jpg'
    },
    {
        file: '5.mp3',
        title: '烟袋斜街',
        artist: '接个吻，开一枪',
        cover: 'http://img3.kuwo.cn/star/albumcover/500/14/71/108401933.jpg',
        bg: 'https://wallpapercave.com/wp/wp4089740.jpg'
    }
];
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
let musicList = shuffle([...musicData]);
let currentMusic = 0;
let isPlaying = false;

function playMusic(idx) {
    currentMusic = idx;
    const audio = document.getElementById('audio-player');
    const m = musicList[currentMusic];
    audio.src = m.file;
    document.getElementById('music-cover').src = m.cover;
    document.getElementById('music-title').textContent = m.title;
    document.getElementById('music-artist').textContent = m.artist;
    // 设置专属背景
    document.body.style.backgroundImage = `url('${m.bg}')`;
    audio.play();
    isPlaying = true;
    // 已移除 music-play 按钮相关操作
}
function playNext() {
    currentMusic = (currentMusic + 1) % musicList.length;
    playMusic(currentMusic);
}
function playPrev() {
    currentMusic = (currentMusic - 1 + musicList.length) % musicList.length;
    playMusic(currentMusic);
}
window.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio-player');
    playMusic(currentMusic);
    audio.volume = 0.5;
    // 自动播放兼容
    audio.play().catch(() => {
        document.body.addEventListener('click', () => {
            audio.play();
        }, { once: true });
    });
    audio.addEventListener('ended', () => {
        playNext();
    });
    // 进度条
    const progress = document.getElementById('music-progress');
    audio.addEventListener('timeupdate', () => {
        progress.value = audio.duration ? (audio.currentTime / audio.duration * 100) : 0;
        document.getElementById('music-current-time').textContent = formatTime(audio.currentTime);
        document.getElementById('music-duration').textContent = formatTime(audio.duration);
    });
    progress.oninput = function() {
        if (audio.duration) {
            audio.currentTime = this.value / 100 * audio.duration;
        }
    };
});
function formatTime(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    let m = Math.floor(sec / 60);
    let s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
}
