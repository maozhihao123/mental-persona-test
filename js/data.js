/**
 * 「测一测，你是哪种精神状态人设」题库与人设数据。
 *
 * 计分规则：每道单选题的 4 个选项各绑定一个人设（persona），
 * 选哪个就给对应人设 +1 分，答完全部 32 题后得分最高者为结果人设。
 *
 * 选项设计原则（保证人人有得选）：
 * 1、每题 4 个选项覆盖四类典型反应——外放热情 / 淡定平静 / 理性条理 / 随性慵懒，
 *    任何答题者都能找到最接近自己真实行为的选项；
 * 2、文案以大众真实行为为主，梗味只做点缀，不写极端小众行为；
 * 3、题目按固定轮转矩阵分配人设（每 5 题一轮回），保证计分分布均衡；
 * 4、全文只用正向、中性的自嘲式玩梗，不涉及病理化解读与外貌、地域羞辱。
 */
(function () {
  'use strict';

  var PERSONAS = [
    {
      key: 'nong',
      name: '浓人',
      emoji: '🔥',
      color: '#ff5f5f',
      soft: '#ffe9e9',
      tags: ['情绪浓度超标', '气氛担当', '行走的扩音器'],
      slogan: '我的情绪浓度，超标但快乐！',
      desc: '你的情绪永远拉满：开心要广播，惊讶要直播，朋友的事你比本人还上心。群里的气氛靠你盘活，表情包库存按 G 计。爱你的人说你是行走的小太阳——你不在的那几天，大家都觉得群里少了点味儿。',
      banger: '本命口头禅：“笑死，我跟你讲！”',
      match: 'dan',
      matchDesc: '一个负责沸腾，一个负责恒温，绝配。'
    },
    {
      key: 'dan',
      name: '淡人',
      emoji: '🫧',
      color: '#6fb8d6',
      soft: '#e6f3fa',
      tags: ['情绪稳定', '已读心里回', '波澜不惊'],
      slogan: '情绪稳定，谢谢关心，也谢谢不关心。',
      desc: '你的情绪像一杯温水，恒温、透气、无糖。已读不回不是冷漠，是心里已经回过了；群消息 99+ 也可以淡定放下手机。朋友对你的评价出奇统一：“这人真的稳。”其实你只是懒得波动而已。',
      banger: '本命口头禅：“都行，你定。”',
      match: 'nong',
      matchDesc: '你负责降温，TA 负责沸腾，互相欣赏。'
    },
    {
      key: 'feng',
      name: '疯感乐子人',
      emoji: '🎪',
      color: '#ff9f43',
      soft: '#fff2e0',
      tags: ['发疯文学十级', '显眼包', '快乐自给'],
      slogan: '精神状态领先大部队，快乐是我自己给的！',
      desc: '你是发疯文学十级学者，人生格言是“与其内耗自己，不如娱乐大家”。离谱经历一箩筐，随手一讲就是单口喜剧。别人笑你太疯癫，你笑别人没乐子——毕竟疯，是一种效率极高的快乐。',
      banger: '本命口头禅：“家人们谁懂啊！”',
      match: 'xing',
      matchDesc: '一个负责起飞，一个负责导航。'
    },
    {
      key: 'song',
      name: '松弛感大师',
      emoji: '🌿',
      color: '#52b788',
      soft: '#e4f5ec',
      tags: ['反内耗体质', '随缘学教授', '天塌当被盖'],
      slogan: '天塌下来？那就先当被子盖。',
      desc: '你的字典里没有“内耗”两个字。地铁没赶上？下一班。计划赶不上变化？那就变化。你把“随缘”过成了一种高级能力，身边的人都想跟你学松弛，但学来学去还是你最松。',
      banger: '本命口头禅：“急什么，来得及。”',
      match: 'dagong',
      matchDesc: 'TA 教你搞钱，你教 TA 活着。'
    },
    {
      key: 'xing',
      name: '人间清醒',
      emoji: '🧊',
      color: '#5c7a99',
      soft: '#e8eff6',
      tags: ['理智在线', '不跟风', '看得太明白'],
      slogan: '看得太明白，但我说得很委婉。',
      desc: '你是朋友堆里的理智担当：大家上头的时候你在算概率，大家 emo 的时候你在摆事实。不站队、不跟风、不信饼，人间的事你门儿清——只是大多数时候，懒得说破。',
      banger: '本命口头禅：“说实话，这事吧——”',
      match: 'feng',
      matchDesc: 'TA 负责起飞，你负责安全降落。'
    },
    {
      key: 'zui',
      name: '互联网嘴替',
      emoji: '🎤',
      color: '#e85d9e',
      soft: '#fce7f1',
      tags: ['热评第一', '输出型选手', '句句在点上'],
      slogan: '你不敢说的，我来说。',
      desc: '你一开口就是热评第一：看剧发弹幕、刷帖留锐评，句句说到人心坎里。朋友遇到糟心事，第一反应是“快，把你的嘴借我用用”。嘴替本替，输出全靠天赋。',
      banger: '本命口头禅：“听我说，谢谢。”',
      match: 'dan',
      matchDesc: '你说到点子上，TA 负责点赞。'
    },
    {
      key: 'lao',
      name: '精神老年人',
      emoji: '🍵',
      color: '#8b6fc9',
      soft: '#efe9fa',
      tags: ['十点睡觉', '保温杯常备', '养生即王道'],
      slogan: '十点睡觉，保温杯常备，谁劝都没用。',
      desc: '你过着“退休预备役”生活：早睡早起、喝茶泡脚、公园遛弯，养生日程精确到小时。同龄人在蹦迪，你在对比艾草贴的差评。朋友笑你老气——其实你只是提前三十年参透了健康的珍贵。',
      banger: '本命口头禅：“这个点还不睡？”',
      match: 'cuipi',
      matchDesc: '你的养生经，正是TA急需的攻略。'
    },
    {
      key: 'xianyu',
      name: '电子咸鱼',
      emoji: '🐟',
      color: '#94a3b8',
      soft: '#eef1f5',
      tags: ['战略性节能', '能躺不坐', '能量条 20%'],
      slogan: '躺平不是放弃，是战略性节能。',
      desc: '你的能量条常年 20%：能躺着绝不坐着，能语音绝不打字，购物车堆成山也懒得结算，健身卡吃灰吃出包浆。但谁说咸鱼没有梦想？你的梦想就是——舒舒服服地躺着，把日子过成慢动作。',
      banger: '本命口头禅：“啊——不想动。”',
      match: 'song',
      matchDesc: '你们组队，就是躺学界天花板。'
    },
    {
      key: 'cuipi',
      name: '脆皮战士',
      emoji: '🫠',
      color: '#2ba8a0',
      soft: '#e0f4f2',
      tags: ['身体是脆的', '意志是钢的', '膏药贴满'],
      slogan: '身体是脆的，意志是钢的！',
      desc: '打个喷嚏闪了腰，伸个懒腰脖子响，坐一下午腰酸背痛——但该上的班一天没落下。你一边贴着膏药一边冲锋，脆皮外壳下是钢铁意志。“战士”这个名号，是你用无数声“哎呀我腰”换来的荣誉勋章。',
      banger: '本命口头禅：“等下，我先缓缓。”',
      match: 'lao',
      matchDesc: 'TA 递来养生茶，你乖乖接住。'
    },
    {
      key: 'dagong',
      name: '天选打工人',
      emoji: '💼',
      color: '#3e6fb0',
      soft: '#e5edf9',
      tags: ['搞钱脑', '日程排满', '待办划勾上瘾'],
      slogan: '搞钱使我快乐，工位使我安心。',
      desc: '你天生自带 KPI 基因：日程表排满，待办划勾的快感胜过游戏通关。别人上班如上坟，你上班如闯关。电脑从不离身，充电宝随身俩——毕竟搞钱这件事，你是认真的。',
      banger: '本命口头禅：“先列个 to-do。”',
      match: 'song',
      matchDesc: '你教TA搞钱，TA 教你活着。'
    }
  ];

  /**
   * 32 道单选题。人设按固定矩阵轮转分配（每 5 题一轮回），保证
   * 每个人设出现 12-13 次、同题不重复；每题选项覆盖四种反应风格。
   */
  var QUESTIONS = [
    {
      text: '深夜十二点半，你躺在床上刷手机，此刻是：',
      options: [
        { text: '看到有意思的立刻发给朋友：“快看这个！”', tag: 'nong' },
        { text: '默默地刷，内心毫无波澜', tag: 'dan' },
        { text: '越刷越精神，笑出声了还想看下一个', tag: 'feng' },
        { text: '困了就睡，手机随手一放', tag: 'song' }
      ]
    },
    {
      text: '朋友给你发微信，你的回复风格是：',
      options: [
        { text: '看到就回，说完重点就结束，不绕弯子', tag: 'xing' },
        { text: '想到啥说啥，偶尔语出惊人', tag: 'zui' },
        { text: '不着急的消息，攒到方便的时候统一回', tag: 'lao' },
        { text: '有时看到了想待会回，然后……就忘了', tag: 'xianyu' }
      ]
    },
    {
      text: '周末早上睁眼的第一件事：',
      options: [
        { text: '再眯十分钟，闹钟响了也起不来', tag: 'cuipi' },
        { text: '想起今天要办的事，干脆起床', tag: 'dagong' },
        { text: '自然醒，心情不错，顺便哼个歌', tag: 'nong' },
        { text: '先躺着刷会儿手机，让大脑慢慢启动', tag: 'dan' }
      ]
    },
    {
      text: '公司群里老板发了一句“大家辛苦了”：',
      options: [
        { text: '截图发给朋友：今日份乐子已送达', tag: 'feng' },
        { text: '看一眼就划走，该干啥干啥', tag: 'song' },
        { text: '当作普通通知，该回就回个表情', tag: 'xing' },
        { text: '心里回了八百字小作文，实际发了个“[强]”', tag: 'zui' }
      ]
    },
    {
      text: '点外卖纠结了十分钟，最后你：',
      options: [
        { text: '就点常吃的那家，不会出错', tag: 'lao' },
        { text: '随便挑一家，吃什么都一样', tag: 'xianyu' },
        { text: '想吃点清淡的，最近肠胃有点闹脾气', tag: 'cuipi' },
        { text: '按销量和评价快速筛一家', tag: 'dagong' }
      ]
    },
    {
      text: '聚会上大家开始尬聊，你是：',
      options: [
        { text: '主动挑起话题，冷场是不可能的', tag: 'nong' },
        { text: '安静吃东西，有人搭话再聊', tag: 'dan' },
        { text: '讲一个自己的糗事，全场笑翻', tag: 'feng' },
        { text: '专心干饭，气氛什么的随缘', tag: 'song' }
      ]
    },
    {
      text: '你的购物车里躺着：',
      options: [
        { text: '按需求列好的清单，用完再买', tag: 'xing' },
        { text: '最近被种草的宝贝，还发群里讨论', tag: 'zui' },
        { text: '家庭补给品：纸巾、米面、粮油', tag: 'lao' },
        { text: '加了很久“以后会用到”的东西，一直没结账', tag: 'xianyu' }
      ]
    },
    {
      text: '地铁上有人外放视频，你会：',
      options: [
        { text: '心里有点烦，皱着眉忍到下车', tag: 'cuipi' },
        { text: '专注自己的事，尽量不受影响', tag: 'dagong' },
        { text: '凑过去跟着看两眼，还挺好看', tag: 'nong' },
        { text: '戴上耳机，当作没听见', tag: 'dan' }
      ]
    },
    {
      text: '凌晨两点还睡不着，你会：',
      options: [
        { text: '索性起来刷会儿手机，困了再说', tag: 'feng' },
        { text: '闭眼躺着，总能睡着的', tag: 'song' },
        { text: '趁夜深人静，把心里的烦心事捋一捋', tag: 'xing' },
        { text: '翻翻白天没看完的帖子，忍不住留两条评论', tag: 'zui' }
      ]
    },
    {
      text: '你对“周末计划”的态度是：',
      options: [
        { text: '提前安排好，作息规律不出岔子', tag: 'lao' },
        { text: '没有计划，睡到几点算几点', tag: 'xianyu' },
        { text: '最大的计划就是补觉', tag: 'cuipi' },
        { text: '想做的事排成清单，逐个打卡', tag: 'dagong' }
      ]
    },
    {
      text: '朋友突然发来一个“在吗”，你会：',
      options: [
        { text: '秒回：“在在在！怎么了？”', tag: 'nong' },
        { text: '回一个“在”，然后等下文', tag: 'dan' },
        { text: '回一句玩梗的话：“不在，有事启奏”', tag: 'feng' },
        { text: '看到就回，晚一点也不影响', tag: 'song' }
      ]
    },
    {
      text: '你的表情包库存情况：',
      options: [
        { text: '几个常用的，够用就行', tag: 'xing' },
        { text: '紧跟热梗，斗图从不落下风', tag: 'zui' },
        { text: '基本不用，打字说清楚就好', tag: 'lao' },
        { text: '想发的时候现搜，存了也找不到', tag: 'xianyu' }
      ]
    },
    {
      text: '早上通勤路上的你：',
      options: [
        { text: '一路疲惫，到公司已经耗尽了体力', tag: 'cuipi' },
        { text: '听播客或音乐，顺便理理今天的安排', tag: 'dagong' },
        { text: '精神饱满，还和同路的人聊上了', tag: 'nong' },
        { text: '面无表情随人流移动，全程省电模式', tag: 'dan' }
      ]
    },
    {
      text: '看到朋友发了条离谱朋友圈，你会：',
      options: [
        { text: '截图发到闺蜜群：“家人们谁懂啊”', tag: 'feng' },
        { text: '划过去，与我无关', tag: 'song' },
        { text: '有点好奇，但不会多问', tag: 'xing' },
        { text: '忍不住评论一句大实话', tag: 'zui' }
      ]
    },
    {
      text: '奶茶店问你“要几分糖”，你答：',
      options: [
        { text: '少糖或无糖，健康要紧', tag: 'lao' },
        { text: '随便，你们看着办', tag: 'xianyu' },
        { text: '微糖吧，最近尽量少喝甜的', tag: 'cuipi' },
        { text: '照旧，固定搭配不纠结', tag: 'dagong' }
      ]
    },
    {
      text: '久坐一下午之后起身：',
      options: [
        { text: '伸个大懒腰，顺便和旁边的人唠两句', tag: 'nong' },
        { text: '平静起身，接杯水继续', tag: 'dan' },
        { text: '扭腰甩手做夸张拉伸，把自己逗笑', tag: 'feng' },
        { text: '慢悠悠起来，先发会儿呆', tag: 'song' }
      ]
    },
    {
      text: '你的朋友圈设置是：',
      options: [
        { text: '很少发，要发也只发必要的信息', tag: 'xing' },
        { text: '想发就发，有观点就要说出来', tag: 'zui' },
        { text: '偶尔转发养生文章', tag: 'lao' },
        { text: '三天可见，其实这三天也没发什么', tag: 'xianyu' }
      ]
    },
    {
      text: '双十一你的真实操作是：',
      options: [
        { text: '熬不动夜，第二天按正常价买了', tag: 'cuipi' },
        { text: '列好清单，比价后按需下单', tag: 'dagong' },
        { text: '蹲零点抢购，主打一个参与感', tag: 'nong' },
        { text: '没什么想买的，看看就退出了', tag: 'dan' }
      ]
    },
    {
      text: '如果给你完全自由的一天，你会：',
      options: [
        { text: '说走就走，去哪都行', tag: 'feng' },
        { text: '慢悠悠过：吃饭、散步、晒太阳', tag: 'song' },
        { text: '做点平时总没空做的正经事', tag: 'xing' },
        { text: '约上朋友，输出一整天八卦', tag: 'zui' }
      ]
    },
    {
      text: '群里突然吵起来了，你会：',
      options: [
        { text: '不参与，关掉手机喝口茶压压惊', tag: 'lao' },
        { text: '潜水吃瓜，顺手截个图', tag: 'xianyu' },
        { text: '看得头疼，直接把群静音', tag: 'cuipi' },
        { text: '看事情轻重，必要时说句公道话', tag: 'dagong' }
      ]
    },
    {
      text: '半夜饿了，你会：',
      options: [
        { text: '说干就干，立刻点外卖或翻零食', tag: 'nong' },
        { text: '喝口水，忍到明天', tag: 'dan' },
        { text: '发个朋友圈：“半夜放毒”', tag: 'feng' },
        { text: '随便对付一口，不折腾', tag: 'song' }
      ]
    },
    {
      text: '老板画饼：“好好干，明年升你”，你：',
      options: [
        { text: '听听就好，该谈钱的时候谈钱', tag: 'xing' },
        { text: '表面点头，心里已经吐槽八百句', tag: 'zui' },
        { text: '稳住心态，先把手上的事做好', tag: 'lao' },
        { text: '左耳进右耳出，下班准点走人', tag: 'xianyu' }
      ]
    },
    {
      text: '手机电量剩多少你会开始慌：',
      options: [
        { text: '低于 50% 就开始心慌', tag: 'cuipi' },
        { text: '提前备好充电宝，心里有数', tag: 'dagong' },
        { text: '边充电边玩，反正到处能充', tag: 'nong' },
        { text: '1% 也很淡定，关机就关机', tag: 'dan' }
      ]
    },
    {
      text: '和朋友约饭，你是那种人：',
      options: [
        { text: '说走就走，路边摊也吃得开心', tag: 'feng' },
        { text: '到了再看吃什么，随缘', tag: 'song' },
        { text: '先看看哪家不排队、好评多', tag: 'xing' },
        { text: '点菜我来，难吃我来评', tag: 'zui' }
      ]
    },
    {
      text: '你的健身 / 运动现状：',
      options: [
        { text: '散步遛弯为主，柔和运动就好', tag: 'lao' },
        { text: '办了卡，去过两次就闲置了', tag: 'xianyu' },
        { text: '想动起来，但身体总是喊累', tag: 'cuipi' },
        { text: '有计划地锻炼，坚持打卡', tag: 'dagong' }
      ]
    },
    {
      text: '出门旅游，你的风格是：',
      options: [
        { text: '行程排满，特种兵式打卡', tag: 'nong' },
        { text: '没什么计划，到了再说', tag: 'dan' },
        { text: '走哪玩哪，迷路也是体验', tag: 'feng' },
        { text: '慢节奏，一个地方待很久', tag: 'song' }
      ]
    },
    {
      text: '你的工位 / 书桌是：',
      options: [
        { text: '简洁有序，东西各归其位', tag: 'xing' },
        { text: '贴满便利贴，写着各种吐槽语录', tag: 'zui' },
        { text: '茶杯、护腰垫、眼药水，装备齐全', tag: 'lao' },
        { text: '东西越堆越多，“乱中有序”', tag: 'xianyu' }
      ]
    },
    {
      text: '睡前最后一件事，通常是：',
      options: [
        { text: '终于能躺下了，感觉身体活过来了', tag: 'cuipi' },
        { text: '过一遍明天的事，定好闹钟', tag: 'dagong' },
        { text: '说完晚安，还要再刷十分钟', tag: 'nong' },
        { text: '手机一放，直接闭眼', tag: 'dan' }
      ]
    },
    {
      text: '追剧的你是什么画风：',
      options: [
        { text: '一晚八集，越看越上头', tag: 'feng' },
        { text: '慢慢看，当背景音也行', tag: 'song' },
        { text: '倍速 + 只看主线，节省时间', tag: 'xing' },
        { text: '边看边发弹幕锐评', tag: 'zui' }
      ]
    },
    {
      text: '洗澡时候的你：',
      options: [
        { text: '好好冲个热水澡，解乏又养生', tag: 'lao' },
        { text: '能快则快，早点躺床上', tag: 'xianyu' },
        { text: '热水冲着，才感觉身体活过来了', tag: 'cuipi' },
        { text: '边洗边想事情，两不耽误', tag: 'dagong' }
      ]
    },
    {
      text: '朋友总结你的年度关键词是：',
      options: [
        { text: '“冲”——永远热血沸腾', tag: 'nong' },
        { text: '“稳”——情绪稳定波澜不惊', tag: 'dan' },
        { text: '“逗”——快乐源泉本人', tag: 'feng' },
        { text: '“淡”——与世无争慢生活', tag: 'song' }
      ]
    },
    {
      text: '如果明天是世界末日，今晚你会：',
      options: [
        { text: '冷静列个清单，把重要的事安排好', tag: 'xing' },
        { text: '发个朋友圈锐评一下末日', tag: 'zui' },
        { text: '照常作息，好好吃顿饭', tag: 'lao' },
        { text: '那今晚可以光明正大地不睡了', tag: 'xianyu' }
      ]
    }
  ];

  window.MENTAL_DATA = { personas: PERSONAS, questions: QUESTIONS };
})();
