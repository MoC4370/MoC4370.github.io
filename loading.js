class LoadingScreen {
    constructor() {
        this.progress = 0;
        this.circle = document.querySelector('.progress-ring__circle-progress');
        this.progressText = document.querySelector('.progress-text');
        this.circumference = 2 * Math.PI * 90; // r=90
        
        this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.backgrounds = [
            'assets/backgrounds/mygo1.jpg',
            'assets/backgrounds/mygo2.jpg',
            'assets/backgrounds/mygo3.jpg'
        ];
        this.currentBg = 0;
        this.tips = [
            "提示: 按 TAB 键可以查看计分板",
            "提示: 使(X)语音聊天可以和其他玩家交流",
            "提示: 按 F3 可以切换第三人称视角",
            "提示: 进服务器请查看规则,否则被踢是常事",
            "提示: 本服务器欢迎来自世界各地的玩家,请勿国家歧视"
        ];

        this.playlist = [
            {
                title: "Imprisoned XII",
                artist: "Ave Mujica",
                cover: "assets/album-covers/109951170535267881.jpg",
                file: "iii.mp3"
            },
            {
                title: "春日影 (MyGO!!!!! ver.)",
                artist: "MyGO!!!!!",
                cover: "https://img1.kuwo.cn/star/albumcover/300/s3s89/13/3955596740.png",
                file: "cry.mp3"
            },
            {
                title: "迷星叫",
                artist: "MyGO!!!!!",
                cover: "https://img1.kuwo.cn/star/albumcover/300/s3s89/13/3955596740.png",
                file: "mxj.mp3"
            },
            {
                title: "迷路日々",
                artist: "MyGO!!!!!",
                cover: "https://img1.kuwo.cn/star/albumcover/300/s3s89/13/3955596740.png",
                file: "mlr.mp3"
            },
            {
                title: "八月のif-",
                artist: "Poppin'Party",
                cover: "https://img1.kuwo.cn/star/albumcover/300/10/80/3178356656.jpg",
                file: "byy.mp3"
            }
            
            // 可以添加更多歌曲
        ];
        
        this.currentTrack = 0;
        this.isPlaying = false;

        this.playerInfo = {
            name: "未连接",
            steamid: "未知",
            rank: "新手",
            playtime: "0小时",
            avatar: "assets/avatars/default.jpg"
        };

        this.totalFiles = 0;
        this.loadedFiles = 0;
        this.currentFileName = "";

        this.initTips();
        this.initBackgroundSlideshow();
        this.initMusicPlayer();
        this.init();
        this.updatePlayerInfo();
    }

    init() {
        if (window.GameDetails) {
            // 添加文件加载回调
            window.SetFilesTotal = (total) => {
                this.totalFiles = total;
                this.updateFileCount();
            };

            window.SetFilesNeeded = (needed) => {
                this.loadedFiles = this.totalFiles - needed;
                this.updateFileCount();
            };

            window.DownloadingFile = (fileName) => {
                this.currentFileName = fileName;
                this.updateCurrentFile();
            };

            // 现有的状态和进度回调
            window.SetStatusChanged = (status) => {
                console.log(status);
            };

            window.SetProgress = (progress) => {
                this.setProgress(progress);
            };
        } else {
            // 测试用
            this.simulateFileLoading();
        }

        this.createParticles();
        this.updateLoadingStatus("正在连接服务器...");
    }

    initTips() {
        const tipText = document.getElementById('tipText');
        let currentTip = 0;

        setInterval(() => {
            tipText.textContent = this.tips[currentTip];
            currentTip = (currentTip + 1) % this.tips.length;
        }, 4000);
    }

    updateLoadingStatus(status) {
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.textContent = status;
    }

    setProgress(percent) {
        const offset = this.circumference - (percent / 100 * this.circumference);
        this.circle.style.strokeDashoffset = offset;
        this.progressText.textContent = `${Math.round(percent)}%`;

        // 每10%触发特效
        if (Math.floor(percent) % 10 === 0 && Math.floor(percent) !== Math.floor(this.progress)) {
            this.createStarBurst();
        }

        this.progress = percent;
    }

    createParticles() {
        // 增强樱花粒子效果
        setInterval(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
            particle.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 5000);
        }, 200);

        // 添加logo发光粒子
        this.createLogoParticles();
    }

    createLogoParticles() {
        const logoParticles = document.querySelector('.logo-particles');
        setInterval(() => {
            const particle = document.createElement('div');
            particle.className = 'logo-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            logoParticles.appendChild(particle);

            setTimeout(() => particle.remove(), 1000);
        }, 100);
    }

    createStarBurst() {
        for (let i = 0; i < 10; i++) {
            const star = document.createElement('div');
            star.className = 'star-particle';
            star.style.setProperty('--angle', `${i * 36}deg`);
            document.querySelector('.progress-ring').appendChild(star);

            setTimeout(() => star.remove(), 1000);
        }
    }

    simulateFileLoading() {
        const testFiles = [
            'models/player/custom/mygo/sato.mdl',
            'materials/models/player/mygo/sato.vmt',
            'sound/music/mygo/hell_or_hell.mp3',
            'maps/mygo_studio.bsp'
        ];
        
        this.totalFiles = testFiles.length;
        this.loadedFiles = 0;
        this.updateFileCount();

        let progress = 0;
        const interval = setInterval(() => {
            if (this.loadedFiles < this.totalFiles) {
                this.currentFileName = testFiles[this.loadedFiles];
                this.updateCurrentFile();
                this.loadedFiles++;
                this.updateFileCount();
            }

            progress += Math.random() * 2;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            this.setProgress(progress);
        }, 1000);
    }

    initBackgroundSlideshow() {
        const slideshow = document.querySelector('.background-slideshow');
        this.backgrounds.forEach((bg, index) => {
            const slide = document.createElement('div');
            slide.className = 'background-slide';
            slide.style.backgroundImage = `url(${bg})`;
            slide.style.opacity = index === 0 ? 1 : 0;
            slideshow.appendChild(slide);
        });

        setInterval(() => this.changeBackground(), 5000);
    }

    changeBackground() {
        const slides = document.querySelectorAll('.background-slide');
        slides[this.currentBg].style.opacity = 0;
        this.currentBg = (this.currentBg + 1) % this.backgrounds.length;
        slides[this.currentBg].style.opacity = 1;
    }

    initMusicPlayer() {
        this.audio = new Audio();
        this.audio.src = this.playlist[this.currentTrack].file;
        
        // 添加音频加载事件监听
        this.audio.addEventListener('loadedmetadata', () => {
            document.getElementById('totalTime').textContent = this.formatTime(this.audio.duration);
            // 音频加载完成后自动播放
            this.autoPlay();
        });

        // 添加音频结束事件监听
        this.audio.addEventListener('ended', () => {
            this.playNext();
        });
        
        const playButton = document.querySelector('.play-button');
        playButton.addEventListener('click', () => this.togglePlay());
        
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        
        const progressBar = document.querySelector('.progress-bar');
        progressBar.addEventListener('click', (e) => this.seek(e));
        
        // 预加载音频
        this.audio.load();
        this.updateTrackInfo();
    }

    // 添加自动播放方法
    autoPlay() {
        // 尝试自动播放
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                document.getElementById('playPauseIcon').className = 'fas fa-pause';
            }).catch(error => {
                console.error("自动播放失败:", error);
                // 大多数浏览器需要用户交互才能自动播放，
                // 我们可以添加一个提示让用户点击页面任意位置开始播放
                this.showAutoPlayHint();
            });
        }
    }

    // 添加自动播放提示方法
    showAutoPlayHint() {
        const hint = document.createElement('div');
        hint.className = 'autoplay-hint';
        hint.textContent = '点击任意位置开始播放音乐';
        document.body.appendChild(hint);

        // 点击任意位置开始播放
        const startPlayback = () => {
            this.togglePlay();
            hint.remove();
            document.removeEventListener('click', startPlayback);
        };

        document.addEventListener('click', startPlayback);
    }

    // 添加播放下一首的方法
    playNext() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.audio.src = this.playlist[this.currentTrack].file;
        this.updateTrackInfo();
        this.audio.load();
        if (this.isPlaying) {
            this.audio.play();
        }
    }

    togglePlay() {
        try {
            if (this.isPlaying) {
                this.audio.pause();
                document.getElementById('playPauseIcon').className = 'fas fa-play';
            } else {
                // 添加错误处理
                const playPromise = this.audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        document.getElementById('playPauseIcon').className = 'fas fa-pause';
                    }).catch(error => {
                        console.error("播放失败:", error);
                    });
                }
            }
            this.isPlaying = !this.isPlaying;
        } catch (error) {
            console.error("音频控制错误:", error);
        }
    }

    updateProgress() {
        try {
            const progress = document.getElementById('musicProgress');
            const currentTime = document.getElementById('currentTime');
            const totalTime = document.getElementById('totalTime');
            
            if (this.audio.duration) {
                const percent = (this.audio.currentTime / this.audio.duration) * 100;
                progress.style.width = `${percent}%`;
                currentTime.textContent = this.formatTime(this.audio.currentTime);
                totalTime.textContent = this.formatTime(this.audio.duration);
            }
        } catch (error) {
            console.error("进度更新错误:", error);
        }
    }

    seek(e) {
        try {
            const progressBar = document.querySelector('.progress-bar');
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            if (this.audio.duration) {
                this.audio.currentTime = percent * this.audio.duration;
            }
        } catch (error) {
            console.error("跳转播放错误:", error);
        }
    }

    updateTrackInfo() {
        const track = this.playlist[this.currentTrack];
        document.getElementById('trackName').textContent = track.title;
        document.getElementById('artistName').textContent = track.artist;
        document.getElementById('albumCover').src = track.cover;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    updatePlayerInfo() {
        const playerName = document.querySelector('.player-name');
        const playerSteamID = document.querySelector('.player-steamid');
        const playerRank = document.querySelector('.player-rank');
        const playerPlaytime = document.querySelector('.player-playtime');
        const playerAvatar = document.querySelector('.player-avatar');

        playerName.textContent = this.playerInfo.name;
        playerSteamID.textContent = `Steam ID: ${this.playerInfo.steamid}`;
        playerRank.textContent = `等级: ${this.playerInfo.rank}`;
        playerPlaytime.textContent = `游戏时长: ${this.playerInfo.playtime}`;
        playerAvatar.src = this.playerInfo.avatar;
    }

    updateFileCount() {
        const fileCount = document.getElementById('fileCount');
        fileCount.textContent = `${this.loadedFiles} / ${this.totalFiles} 个文件`;
    }

    updateCurrentFile() {
        const currentFile = document.getElementById('currentFile');
        currentFile.textContent = this.currentFileName || "正在加载...";
    }
}

// 初始化加载界面
window.onload = () => {
    new LoadingScreen();
}; 
