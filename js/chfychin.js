var leonus = {
    linkCom: e => {
        var t = document.querySelector(".el-textarea__inner");
        "bf" == e ? (t.value = "```yml\n", t.value += "- name: \n  link: \n  avatar: \n  descr: \n  siteshot: ", t.value += "\n```", t.setSelectionRange(15, 15)) : (t.value = "站点名称：\n站点地址：\n头像链接：\n站点描述：\n站点截图：", t.setSelectionRange(5, 5)), t.focus()
    },
    owoBig: () => {
        if (!document.getElementById("post-comment") || document.body.clientWidth < 768) return;
        let e = 1,
            t = "",
            o = document.createElement("div"),
            n = document.querySelector("body");
        o.id = "owo-big", n.appendChild(o), new MutationObserver((l => {
            for (let a = 0; a < l.length; a++) {
                let i = l[a].addedNodes,
                    s = "";
                if (2 == i.length && "OwO-body" == i[1].className) s = i[1];
                else {
                    if (1 != i.length || "tk-comment" != i[0].className) continue;
                    s = i[0]
                }
                s.onmouseover = l => {
                    e && ("OwO-body" == s.className && "IMG" == l.target.tagName || "tk-owo-emotion" == l.target.className) && (e = 0, t = setTimeout((() => {
                        let e = 3 * l.path[0].clientHeight,
                            t = 3 * l.path[0].clientWidth,
                            a = l.x - l.offsetX - (t - l.path[0].clientWidth) / 2,
                            i = l.y - l.offsetY;
                        a + t > n.clientWidth && (a -= a + t - n.clientWidth + 10), a < 0 && (a = 10), o.style.cssText = `display:flex; height:${e}px; width:${t}px; left:${a}px; top:${i}px;`, o.innerHTML = `<img src= "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" onerror="this.onerror=null,this.src=&quot;/img/404.jpg&quot;" data-lazy-src="${l.target.src}">`
                    }), 300))
                }, s.onmouseout = () => {
                    o.style.display = "none", e = 1, clearTimeout(t)
                }
            }
        })).observe(document.getElementById("post-comment"), {
            subtree: !0,
            childList: !0
        })
    },
};

/*---纪念日start---*/

// anniversary.js

function initializeAnniversary() {
    function LunarDate(Year, Month, Day) {
        try {
            let solar = Lunar.fromYmdHms(Year, Month, Day, 0, 0, 0).getSolar();
            return new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
        } catch (error) {
            return LunarDate(Year, Month, Day - 1);
        }
    }
    // 计算两个日期之间的天数差
    function daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.ceil((date2 - date1) / oneDay);
    }
    // 剩余天数
    function daysLeft(dateStr, isLunar) {
        const [Year, Month, Day] = dateStr.split("-").map(Number);
        let now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let anniversaryDate;
        if (isLunar) {
            anniversaryDate = LunarDate(now.getFullYear(), Month, Day);
            if (anniversaryDate < now) {
                anniversaryDate = LunarDate(now.getFullYear() + 1, Month, Day);
            }
        } else {
            anniversaryDate = new Date(now.getFullYear(), Month - 1, Day);
            if (anniversaryDate < now) {
                anniversaryDate = new Date(now.getFullYear() + 1, Month - 1, Day);
            }
        }
        return daysBetween(now, anniversaryDate);
    }
    // 经过天数
    function totalDays(dateStr, isLunar) {
        const [Year, Month, Day] = dateStr.split("-").map(Number);
        let now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let startDate;
        if (isLunar) {
            startDate = LunarDate(Year, Month, Day);
        } else {
            startDate = new Date(Year, Month - 1, Day);
        }
        return daysBetween(startDate, now);
    }
    // 返回目标或起始日期以及星期几
    function targetDate(dateStr, isLunar) {
        const [Year, Month, Day] = dateStr.split("-").map(Number);
        let now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let anniversaryDate;
        if (isLunar) {
            anniversaryDate = LunarDate(now.getFullYear(), Month, Day);
            if (anniversaryDate < now) {
                anniversaryDate = LunarDate(now.getFullYear() + 1, Month, Day);
            }
        } else {
            anniversaryDate = new Date(now.getFullYear(), Month - 1, Day);
            if (anniversaryDate < now) {
                anniversaryDate = new Date(now.getFullYear() + 1, Month - 1, Day);
            }
        }
        // 获取星期几
        const weekDay = anniversaryDate.toLocaleDateString('zh-CN', { weekday: 'long' });
        // 返回年月日加星期几
        const year = anniversaryDate.getFullYear();
        const month = (anniversaryDate.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要加1
        const day = anniversaryDate.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day} (${weekDay})`; // 使用'-'作为分隔符
        //   return anniversaryDate.toDateString();  // 直接返回斜杆日期
        // return anniversaryDate.toLocaleDateString('zh-CN');
    }
    // 返回目标或起始日期（根据 displayMode）
    function targetOrStartDate(dateStr, isLunar, displayMode) {
        if (displayMode === "elapsed") {
            return dateStr; // 如果是elapsed模式，直接返回配置的日期（起始日）
        } else {
            return targetDate(dateStr, isLunar); // 否则，显示目标日期和星期几
        }
    }

    const countdownElements = document.querySelectorAll(".countdown");
    const totalDaysElements = document.querySelectorAll(".total-days");
    const targetDateElements = document.querySelectorAll(".target-date");

    countdownElements.forEach(function (elem) {
        const dateStr = elem.getAttribute("data-date");
        const isLunar = elem.hasAttribute("data-lunar");
        const displayMode = elem.getAttribute("data-display-mode"); // 获取 display_mode
        let daysText;
        if (displayMode === "elapsed") {
            // 显示已经过去的天数
            daysText = totalDays(dateStr, isLunar);
            elem.nextElementSibling.textContent = "天了"; // 显示“天了”
        } else {
            // 显示剩余天数
            daysText = daysLeft(dateStr, isLunar);
            elem.nextElementSibling.textContent = "天后"; // 显示“天后”
        }
        elem.textContent = daysText;
    });

    totalDaysElements.forEach(function (elem) {
        const dateStr = elem.getAttribute("data-date");
        const isLunar = elem.hasAttribute("data-lunar");
        elem.textContent = totalDays(dateStr, isLunar);
    });

    // 显示目标或起始日期
    targetDateElements.forEach(function (elem) {
        const dateStr = elem.getAttribute("data-date");
        const isLunar = elem.hasAttribute("data-lunar");
        const displayMode = elem.getAttribute("data-display-mode"); // 获取 display_mode
        elem.textContent = targetOrStartDate(dateStr, isLunar, displayMode);
    });
}

// 初始页面加载
document.addEventListener("DOMContentLoaded", initializeAnniversary);

// 适配 pjax
document.addEventListener("pjax:complete", initializeAnniversary);

/*---纪念日end---*/

/*---一图流start---*/

// 首页一图流加载优化
/**
 * @description 实现medium的渐进加载背景的效果
 */
(function () {
    class ProgressiveLoad {
        constructor(smallSrc, largeSrc) {
            this.smallSrc = smallSrc;
            this.largeSrc = largeSrc;
            this.initTpl();
            this.container.addEventListener('animationend', () => {
                this.smallStage.style.display = 'none';
            }, { once: true });
        }

        initTpl() {
            this.container = document.createElement('div');
            this.smallStage = document.createElement('div');
            this.largeStage = document.createElement('div');
            this.smallImg = new Image();
            this.largeImg = new Image();
            this.container.className = 'pl-container';
            this.smallStage.className = 'pl-img pl-blur';
            this.largeStage.className = 'pl-img';
            this.container.appendChild(this.smallStage);
            this.container.appendChild(this.largeStage);
            this.smallImg.onload = this._onSmallLoaded.bind(this);
            this.largeImg.onload = this._onLargeLoaded.bind(this);
        }

        progressiveLoad() {
            this.smallImg.src = this.smallSrc;
            this.largeImg.src = this.largeSrc;
        }

        _onLargeLoaded() {
            this.largeStage.classList.add('pl-visible');
            this.largeStage.style.backgroundImage = `url('${this.largeSrc}')`;
        }

        _onSmallLoaded() {
            this.smallStage.classList.add('pl-visible');
            this.smallStage.style.backgroundImage = `url('${this.smallSrc}')`;
        }
    }

    const executeLoad = (config, target) => {
        console.log('执行渐进背景替换');
        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        const loader = new ProgressiveLoad(
            isMobile ? config.mobileSmallSrc : config.smallSrc,
            isMobile ? config.mobileLargeSrc : config.largeSrc
        );
        if (target.children[0]) {
            target.insertBefore(loader.container, target.children[0]);
        }
        loader.progressiveLoad();
    };

    const ldconfig = {
        light: {
            smallSrc: 'https://pcgdemo.chfychin.cn/img/default_cover_24.webp', //浅色模式 小图链接 尽可能配置小于100k的图片 
            largeSrc: 'https://pcgdemo.chfychin.cn/img/default_cover_24.webp', //浅色模式 大图链接 最终显示的图片
            mobileSmallSrc: 'https://pcgdemo.chfychin.cn/img/mb12.webp', //手机端浅色小图链接 尽可能配置小于100k的图片
            mobileLargeSrc: 'https://pcgdemo.chfychin.cn/img/mb12.webp', //手机端浅色大图链接 最终显示的图片
            enableRoutes: ['/'],
        },
        dark: {
            smallSrc: 'https://pcgdemo.chfychin.cn/img/default_cover_246.webp', //深色模式 小图链接 尽可能配置小于100k的图片 
            largeSrc: 'https://pcgdemo.chfychin.cn/img/default_cover_246.webp', //深色模式 大图链接 最终显示的图片
            mobileSmallSrc: 'https://pcgdemo.chfychin.cn/img/mb17.webp', //手机端深色模式小图链接 尽可能配置小于100k的图片
            mobileLargeSrc: 'https://pcgdemo.chfychin.cn/img/mb17.webp', //手机端深色大图链接 最终显示的图片
            enableRoutes: ['/'],
        },
    };

    const getCurrentTheme = () => {
        return document.documentElement.getAttribute('data-theme');
    }

    const onThemeChange = () => {
        const currentTheme = getCurrentTheme();
        const config = ldconfig[currentTheme];
        initProgressiveLoad(config);
        document.addEventListener("DOMContentLoaded", function () {
            initProgressiveLoad(config);
        });

        document.addEventListener("pjax:complete", function () {
            onPJAXComplete(config);
        });
    }

    let initTheme = getCurrentTheme();
    let initConfig = ldconfig[initTheme];
    initProgressiveLoad(initConfig);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === "data-theme" && location.pathname === '/') {
                onThemeChange();
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"]
    });

    function initProgressiveLoad(config) {
        const container = document.querySelector('.pl-container');
        if (container) {
            container.remove();
        }
        const target = document.getElementById('page-header');
        if (target && target.classList.contains('full_page')) {
            executeLoad(config, target);
        }
    }

    function onPJAXComplete(config) {
        const target = document.getElementById('page-header');
        if (target && target.classList.contains('full_page')) {
            initProgressiveLoad(config);
        }
    }

})();

/*---一图流end---*/

/*---页脚添加动物start---*/

function initFooterAnimal() {
    const footerAnimal = document.getElementById('footer-animal');
    if (footerAnimal) {
        footerAnimal.remove();
    }

    const footerBar = document.querySelector('#footer-bar');
    if (!footerBar) {
        console.error('找不到指定元素');
        return;
    }

    const newFooterAnimal = document.createElement('div');
    newFooterAnimal.id = 'footer-animal';
    newFooterAnimal.innerHTML = `
        <img class="animal entered loaded"
            src="https://i1.wp.com/ruom.wuaze.com/i/2024/10/19/473503.webp"
            alt="动物" />
    `;
    footerBar.insertAdjacentElement('beforebegin', newFooterAnimal);

    if (!document.getElementById('footer-animal-style')) {
        const style = document.createElement('style');
        style.id = 'footer-animal-style';
        style.textContent = `
            #footer-animal {
                position: relative;
            }
            #footer-animal::before {
                content: '';
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 36px;
                background: url(https://i1.wp.com/ruom.wuaze.com/i/2024/10/19/351933.webp) repeat center / auto 100%;
                box-shadow: 0 4px 7px rgba(0,0,0,.15);
            }
            .animal {
                position: relative;
                max-width: min(974px, 100vw);
                margin: 0 auto;
                display: block;
            }
            #footer-bar {
                margin-top: 0 !important;
            }
            @media screen and (max-width: 1023px) {
                #footer-animal::before {
                    height: 4vw;
                }
            }
            [data-theme=dark] #footer-animal {
                filter: brightness(.8);
            }
        `;
        document.head.appendChild(style);
    }
}

document.addEventListener('DOMContentLoaded', initFooterAnimal);

document.addEventListener('pjax:complete', initFooterAnimal);

/*---页脚添加动物end---*/

/*---欢迎信息start---*/

//get请求
$.ajax({
    type: 'get',
    url: 'https://apis.map.qq.com/ws/location/v1/ip',
    data: {
        key: 'TXWBZ-2UUCQ-FO75Q-2P7SA-3PZLT-RZBMX',
        output: 'jsonp',
    },
    dataType: 'jsonp',
    success: function (res) {
        ipLoacation = res;
    }
})
function getDistance(e1, n1, e2, n2) {
    const R = 6371
    const { sin, cos, asin, PI, hypot } = Math
    let getPoint = (e, n) => {
        e *= PI / 180
        n *= PI / 180
        return { x: cos(n) * cos(e), y: cos(n) * sin(e), z: sin(n) }
    }

    let a = getPoint(e1, n1)
    let b = getPoint(e2, n2)
    let c = hypot(a.x - b.x, a.y - b.y, a.z - b.z)
    let r = asin(c / 2) * 2 * R
    return Math.round(r);
}

function showWelcome() {

    let dist = getDistance(113.34499552, 23.15537143, ipLoacation.result.location.lng, ipLoacation.result.location.lat); //这里换成自己的经纬度
    let pos = ipLoacation.result.ad_info.nation;
    let ip;
    let posdesc;
    //根据国家、省份、城市信息自定义欢迎语
    switch (ipLoacation.result.ad_info.nation) {
        case "日本":
            posdesc = "よろしく，一起去看樱花吗";
            break;
        case "美国":
            posdesc = "Let us live in peace!";
            break;
        case "英国":
            posdesc = "想同你一起夜乘伦敦眼";
            break;
        case "俄罗斯":
            posdesc = "干了这瓶伏特加！";
            break;
        case "法国":
            posdesc = "C'est La Vie";
            break;
        case "德国":
            posdesc = "Die Zeit verging im Fluge.";
            break;
        case "澳大利亚":
            posdesc = "一起去大堡礁吧！";
            break;
        case "加拿大":
            posdesc = "拾起一片枫叶赠予你";
            break;
        case "中国":
            pos = ipLoacation.result.ad_info.province + " " + ipLoacation.result.ad_info.city + " " + ipLoacation.result.ad_info.district;
            ip = ipLoacation.result.ip;
            switch (ipLoacation.result.ad_info.province) {
                case "北京市":
                    posdesc = "北——京——欢迎你~~~";
                    break;
                case "天津市":
                    posdesc = "讲段相声吧。";
                    break;
                case "河北省":
                    posdesc = "山势巍巍成壁垒，天下雄关。铁马金戈由此向，无限江山。";
                    break;
                case "山西省":
                    posdesc = "展开坐具长三尺，已占山河五百余。";
                    break;
                case "内蒙古自治区":
                    posdesc = "天苍苍，野茫茫，风吹草低见牛羊。";
                    break;
                case "辽宁省":
                    posdesc = "我想吃烤鸡架！";
                    break;
                case "吉林省":
                    posdesc = "状元阁就是东北烧烤之王。";
                    break;
                case "黑龙江省":
                    posdesc = "很喜欢哈尔滨大剧院。";
                    break;
                case "上海市":
                    posdesc = "众所周知，中国只有两个城市。";
                    break;
                case "江苏省":
                    switch (ipLoacation.result.ad_info.city) {
                        case "南京市":
                            posdesc = "这是我挺想去的城市啦。";
                            break;
                        case "苏州市":
                            posdesc = "上有天堂，下有苏杭。";
                            break;
                        default:
                            posdesc = "散装是必须要散装的。";
                            break;
                    }
                    break;
                case "浙江省":
                    posdesc = "东风渐绿西湖柳，雁已还人未南归。";
                    break;
                case "河南省":
                    switch (ipLoacation.result.ad_info.city) {
                        case "郑州市":
                            posdesc = "豫州之域，天地之中。";
                            break;
                        case "南阳市":
                            posdesc = "臣本布衣，躬耕于南阳。此南阳非彼南阳！";
                            break;
                        case "驻马店市":
                            posdesc = "峰峰有奇石，石石挟仙气。嵖岈山的花很美哦！";
                            break;
                        case "开封市":
                            posdesc = "刚正不阿包青天。";
                            break;
                        case "洛阳市":
                            posdesc = "洛阳牡丹甲天下。";
                            break;
                        default:
                            posdesc = "可否带我品尝河南烩面啦？";
                            break;
                    }
                    break;
                case "安徽省":
                    posdesc = "蚌埠住了，芜湖起飞。";
                    break;
                case "福建省":
                    posdesc = "井邑白云间，岩城远带山。";
                    break;
                case "江西省":
                    posdesc = "落霞与孤鹜齐飞，秋水共长天一色。";
                    break;
                case "山东省":
                    posdesc = "遥望齐州九点烟，一泓海水杯中泻。";
                    break;
                case "湖北省":
                    posdesc = "来碗热干面！";
                    break;
                case "湖南省":
                    posdesc = "74751，长沙斯塔克。";
                    break;
                case "广东省":
                    posdesc = "老板来两斤福建人。";
                    break;
                case "广西壮族自治区":
                    posdesc = "桂林山水甲天下。";
                    break;
                case "海南省":
                    posdesc = "朝观日出逐白浪，夕看云起收霞光。";
                    break;
                case "四川省":
                    posdesc = "康康川妹子。";
                    break;
                case "贵州省":
                    posdesc = "茅台，学生，再塞200。";
                    break;
                case "云南省":
                    posdesc = "玉龙飞舞云缠绕，万仞冰川直耸天。";
                    break;
                case "西藏自治区":
                    posdesc = "躺在茫茫草原上，仰望蓝天。";
                    break;
                case "陕西省":
                    posdesc = "来份臊子面加馍。";
                    break;
                case "甘肃省":
                    posdesc = "羌笛何须怨杨柳，春风不度玉门关。";
                    break;
                case "青海省":
                    posdesc = "牛肉干和老酸奶都好好吃。";
                    break;
                case "宁夏回族自治区":
                    posdesc = "大漠孤烟直，长河落日圆。";
                    break;
                case "新疆维吾尔自治区":
                    posdesc = "驼铃古道丝绸路，胡马犹闻唐汉风。";
                    break;
                case "台湾省":
                    posdesc = "我在这头，大陆在那头。";
                    break;
                case "香港特别行政区":
                    posdesc = "永定贼有残留地鬼嚎，迎击光非岁玉。";
                    break;
                case "澳门特别行政区":
                    posdesc = "性感荷官，在线发牌。";
                    break;
                default:
                    posdesc = "带我去你的城市逛逛吧！";
                    break;
            }
            break;
        default:
            posdesc = "带我去你的国家逛逛吧。";
            break;
    }

    //根据本地时间切换欢迎语
    let timeChange;
    let date = new Date();
    if (date.getHours() >= 5 && date.getHours() < 11) timeChange = "<span>上午好</span>，一日之计在于晨！";
    else if (date.getHours() >= 11 && date.getHours() < 13) timeChange = "<span>中午好</span>，该摸鱼吃午饭了。";
    else if (date.getHours() >= 13 && date.getHours() < 15) timeChange = "<span>下午好</span>，懒懒地睡个午觉吧！";
    else if (date.getHours() >= 15 && date.getHours() < 16) timeChange = "<span>三点几啦</span>，一起饮茶呀！";
    else if (date.getHours() >= 16 && date.getHours() < 19) timeChange = "<span>夕阳无限好！</span>";
    else if (date.getHours() >= 19 && date.getHours() < 24) timeChange = "<span>晚上好</span>，夜生活嗨起来！";
    else timeChange = "夜深了，早点休息，少熬夜。";

    try {
        //自定义文本和需要放的位置
        document.getElementById("welcome-info").innerHTML =
            `<b><center>🎉 欢迎信息 🎉</center>&emsp;&emsp;欢迎来自 <span style="color:var(--theme-color)">${pos}</span> 的小伙伴，${timeChange}您现在距离站长约 <span style="color:var(--theme-color)">${dist}</span> 公里，当前的IP地址为： <span style="color:var(--theme-color)">${ip}</span>， ${posdesc}</b>`;
    } catch (err) {
        // console.log("Pjax无法获取#welcome-info元素🙄🙄🙄")
    }
}
window.onload = showWelcome;
// 如果使用了pjax在加上下面这行代码
document.addEventListener('pjax:complete', showWelcome);

/*---欢迎信息end---*/