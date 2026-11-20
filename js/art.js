/**
 * 10 个人设的原创几何扁平风卡通人物插画，全部由内联 SVG 绘制，不依赖外部图片。
 *
 * 设计原则：每个人设 = 专属姿势 / 动态 + 标志性配件 + 主题配色，
 * 保证剪影层面就能认出是谁，而不是换色换发。
 * 同一角色输出两种取景：全身像（结果页、分享卡）与头肩像（列表、成分表）。
 */
(function () {
  'use strict';

  var INK = '#2b2f3a';
  var WHITE = '#ffffff';
  var SKIN = ['#f6d5bd', '#eab993', '#c98e6a', '#8d5a3c'];
  var HAIR = { black: '#2f2a33', brown: '#5b3a29', chestnut: '#8a5a2b', gold: '#c9a05a', silver: '#c8c4cc' };
  var BOTTOM = { dark: '#3d4250', denim: '#4a6fa5', khaki: '#b8a07a' };
  var VIEWBOX = { full: '0 0 200 280', portrait: '58 34 84 94' };

  function mix(hex, target, t) {
    var a = parseInt(hex.slice(1), 16);
    var b = parseInt(target.slice(1), 16);
    var r = Math.round(((a >> 16) & 255) * (1 - t) + ((b >> 16) & 255) * t);
    var g = Math.round(((a >> 8) & 255) * (1 - t) + ((b >> 8) & 255) * t);
    var bl = Math.round((a & 255) * (1 - t) + (b & 255) * t);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
  }
  function shade(hex, t) { return mix(hex, INK, t); }
  function light(hex, t) { return mix(hex, WHITE, t); }

  // ---------- 头部：局部坐标以 (100, 92) 为中心，半径 30 ----------

  var HEAD_TRANSFORM = 'translate(100 82) scale(0.733) translate(-100 -92)';

  var HAIR_BACK = {
    long: '<path d="M66 92 C64 60 84 52 100 52 C116 52 136 60 134 92 L140 146 L60 146 Z"/>',
    bob: '<path d="M66 92 C64 58 84 50 100 50 C116 50 136 58 134 92 L138 128 Q100 140 62 128 Z"/>'
  };

  var HAIR_FRONT = {
    short: '<path d="M70 92 C68 66 84 56 100 56 C118 56 132 66 130 92 C124 78 112 72 100 74 C88 72 76 80 70 92 Z"/>',
    side: '<path d="M70 94 C66 64 86 54 104 56 C122 58 134 70 130 92 C120 80 102 76 86 72 C80 80 75 86 70 94 Z"/>',
    flame: '<path d="M70 90 L73 60 L80 70 L87 46 L96 60 L104 40 L112 60 L121 46 L125 66 L133 60 L130 90 C120 76 80 76 70 90 Z"/>',
    messy: '<path d="M68 88 L74 60 L84 70 L92 50 L100 64 L110 46 L116 66 L128 56 L124 74 L134 72 L130 90 C118 76 82 76 68 88 Z"/>',
    bun: '<circle cx="100" cy="52" r="13"/>' +
      '<path d="M70 92 C68 66 84 58 100 58 C118 58 132 66 130 92 C122 76 110 72 100 72 C90 72 78 76 70 92 Z"/>',
    bob: '<path d="M70 90 C70 64 86 56 100 56 C114 56 130 64 130 90 C126 72 112 68 100 68 C88 68 74 72 70 90 Z"/>',
    curly: '<circle cx="73" cy="84" r="10"/><circle cx="79" cy="69" r="11"/><circle cx="93" cy="60" r="12"/>' +
      '<circle cx="108" cy="60" r="12"/><circle cx="121" cy="68" r="11"/><circle cx="127" cy="83" r="10"/>',
    fringe: '<path d="M72 88 C72 64 86 56 100 56 C114 56 128 64 128 88 L124 84 L118 90 L112 82 L104 90 L96 82 L88 90 L80 84 Z"/>'
  };

  /** 画在头上的标志性小物（派对帽 / 头顶叶子 / 兜帽檐），局部坐标。 */
  var HEAD_EXTRAS = {
    partyHat: '<path d="M100 22 L118 58 L82 58 Z" fill="#f5c84c"/>' +
      '<path d="M100 22 L109 44 L94 50 Z" fill="#ee8fa6"/>' +
      '<circle cx="100" cy="21" r="5" fill="#e8705f"/>' +
      '<path d="M86 56 Q100 64 114 56" stroke="#e8705f" stroke-width="3" fill="none"/>',
    leafSprig: '<path d="M100 54 Q98 44 96 34" stroke="#52b788" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
      '<path d="M97 40 Q104 30 114 32 Q110 42 98 43 Z" fill="#52b788"/>' +
      '<path d="M97 40 Q90 32 82 34 Q86 42 96 43 Z" fill="#74c69d"/>' +
      '<path d="M106 38 Q112 34 116 36" stroke="#74c69d" stroke-width="2" stroke-linecap="round" fill="none"/>'
  };

  var FACES = {
    eyesOpen: '<circle cx="88" cy="95" r="3.2" fill="' + INK + '"/><circle cx="112" cy="95" r="3.2" fill="' + INK + '"/>',
    eyesHappy: '<path d="M82 96 Q88 88 94 96 M106 96 Q112 88 118 96" stroke="' + INK + '" stroke-width="3" stroke-linecap="round" fill="none"/>',
    eyesCalm: '<path d="M83 94 Q88 98 93 94 M107 94 Q112 98 117 94" stroke="' + INK + '" stroke-width="3" stroke-linecap="round" fill="none"/>',
    eyesWink: '<circle cx="88" cy="95" r="3.2" fill="' + INK + '"/><path d="M106 95 Q112 88 118 95" stroke="' + INK + '" stroke-width="3" stroke-linecap="round" fill="none"/>',
    eyesSleepy: '<path d="M83 95 H93 M107 95 H117" stroke="' + INK + '" stroke-width="3" stroke-linecap="round" fill="none"/>',
    eyesShut: '<path d="M83 95 Q88 99 93 95 M107 95 Q112 99 117 95" stroke="' + INK + '" stroke-width="3" stroke-linecap="round" fill="none"/>',
    mouthBig: '<path d="M90 102 A10 9 0 0 0 110 102 Z" fill="#c96b56"/>' +
      '<path d="M92 102 H108 L106 106 Q100 104 94 106 Z" fill="' + WHITE + '"/>',
    mouthTongue: '<path d="M89 101 A11 10 0 0 0 111 101 Z" fill="#c96b56"/>' +
      '<path d="M91 101 H109 L107 105 Q100 103 93 105 Z" fill="' + WHITE + '"/>' +
      '<path d="M94 108 Q100 116 106 108 Q100 111 94 108 Z" fill="#f1919e"/>',
    mouthSmile: '<path d="M92 106 Q100 113 108 106" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round" fill="none"/>',
    mouthTiny: '<circle cx="100" cy="106" r="2.4" fill="' + INK + '"/>',
    mouthContent: '<path d="M93 106 Q100 110 107 106" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round" fill="none"/>',
    mouthSmirk: '<path d="M93 106 Q101 111 108 105" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round" fill="none"/>'
  };

  var GLASSES = {
    round: '<g fill="none" stroke="' + INK + '" stroke-width="2.5"><circle cx="88" cy="95" r="9"/><circle cx="112" cy="95" r="9"/><path d="M97 95 H103"/></g>' +
      '<path d="M108 91 L115 98" stroke="' + WHITE + '" stroke-width="2" stroke-linecap="round"/>',
    reading: '<g fill="none" stroke="' + INK + '" stroke-width="2.2"><circle cx="89" cy="98" r="7.5"/><circle cx="111" cy="98" r="7.5"/><path d="M96.5 98 H103.5"/></g>'
  };

  function renderHead(look) {
    var skin = SKIN[look.skin];
    return '' +
      '<g transform="' + HEAD_TRANSFORM + '">' +
      '<circle cx="70" cy="96" r="6" fill="' + skin + '"/><circle cx="130" cy="96" r="6" fill="' + skin + '"/>' +
      '<circle cx="100" cy="92" r="30" fill="' + skin + '"/>' +
      '<path d="M100 62 A30 30 0 0 1 100 122 Z" fill="#000" opacity=".05"/>' +
      '<g fill="' + HAIR[look.hairColor] + '">' + (HAIR_FRONT[look.hair] || '') + '</g>' +
      (look.hoodUp
        ? '<path d="M70 86 C72 62 88 52 100 52 C114 52 128 62 130 86 C122 66 108 62 100 62 C90 62 78 68 70 86 Z" fill="' + light(look.hoodColor || '#94a3b8', 0.12) + '"/>'
        : (look.headExtra ? HEAD_EXTRAS[look.headExtra] : '')) +
      FACES[look.eyes] +
      FACES[look.mouth] +
      (look.blush ? '<circle cx="82" cy="104" r="4" fill="#ee8fa6" opacity=".4"/><circle cx="118" cy="104" r="4" fill="#ee8fa6" opacity=".4"/>' : '') +
      (look.bandaid
        ? '<g transform="translate(116 100) rotate(-24)"><rect x="-6.5" y="-2.2" width="13" height="4.4" rx="2" fill="#f5c9a4"/><rect x="-2.2" y="-6.5" width="4.4" height="13" rx="2" fill="#eec08e"/></g>'
        : '') +
      (look.glasses ? GLASSES[look.glasses] : '') +
      '</g>';
  }

  // ---------- 姿势：手臂、手位与随姿势道具 ----------

  /**
   * 每个 pose 定义左右臂多边形与手心坐标；hold 类道具仍画在右手附近 (136,151)。
   */
  var POSES = {
    stand: {
      left: { poly: '74,117 84,121 79,166 68,165', hand: [73, 168] },
      right: { poly: '116,121 126,117 132,165 121,166', hand: [127, 168] }
    },
    hold: {
      left: { poly: '74,117 84,121 79,166 68,165', hand: [73, 168] },
      right: { poly: '116,121 127,118 141,148 131,154', hand: [136, 151] }
    },
    cheer: { // 双臂高举 V 字（浓人）
      left: { poly: '74,117 84,121 79,146 68,143', hand: [73, 141] },
      right: { poly: '116,121 126,117 121,146 132,143', hand: [127, 141] }
    },
    behindBack: { // 双手背后（淡人）：只露手不画臂
      left: { poly: null, hand: [75, 162] },
      right: { poly: null, hand: [125, 162] }
    },
    handsBehindHead: { // 双手枕后脑（松弛感大师）
      left: { poly: '74,117 84,121 87,100 77,97', hand: null },
      right: { poly: '116,121 126,117 122,99 113,97', hand: null }
    },
    crossed: { // 抱胸（人间清醒）
      left: { poly: '75,118 84,121 126,130 122,143 76,134', hand: [124, 132] },
      right: { poly: '125,118 116,121 74,146 78,158 124,137', hand: [78, 150] }
    },
    micUpHip: { // 举麦 + 叉腰（嘴替）
      left: { poly: '74,117 84,121 93,141 84,149', hand: [89, 147] },
      right: { poly: '116,121 127,118 141,98 132,95', hand: [137, 96] }
    },
    fanCrook: { // 右手摇扇 + 左臂挎保温杯（精神老年人）
      left: { poly: '74,117 84,121 78,139 68,136', hand: [71, 138] },
      right: { poly: '116,121 127,118 141,148 131,154', hand: [136, 151] }
    },
    hipLean: { // 咸鱼式垂肩叉腰（电子咸鱼）：左臂耷拉 右手抱鱼
      left: { poly: '74,117 84,121 80,158 70,157', hand: [73, 160] },
      right: { poly: '116,121 127,118 141,148 131,154', hand: [136, 151] }
    }
  };

  // ---------- 腿脚 ----------

  function renderLegs(look, c) {
    if (look.legs === 'jump') { // 浓人：腾空外撇
      return '' +
        '<polygon points="82,166 99,166 90,238 76,240" fill="' + BOTTOM.denim + '"/>' +
        '<polygon points="101,166 118,166 124,238 110,240" fill="' + BOTTOM.denim + '"/>' +
        '<polygon points="101,166 118,166 124,238 110,240" fill="#000" opacity=".1"/>' +
        '<rect x="64" y="235" width="23" height="10" rx="5" fill="' + INK + '" transform="rotate(-12 76 240)"/>' +
        '<rect x="108" y="235" width="23" height="10" rx="5" fill="' + INK + '" transform="rotate(12 119 240)"/>';
    }
    if (look.legs === 'kick') { // 疯感：一条腿向后踢
      return '' +
        '<polygon points="82,168 100,168 92,252 80,252" fill="' + BOTTOM.khaki + '"/>' +
        '<polygon points="100,168 120,168 142,196 130,206" fill="' + BOTTOM.khaki + '"/>' +
        '<polygon points="100,168 120,168 142,196 130,206" fill="#000" opacity=".1"/>' +
        '<rect x="78" y="249" width="23" height="10" rx="5" fill="' + INK + '"/>' +
        '<rect x="132" y="199" width="22" height="10" rx="5" fill="' + INK + '" transform="rotate(-24 143 204)"/>';
    }
    if (look.legs === 'together') { // 淡人：并拢站直
      return '' +
        '<polygon points="84,168 100,168 94,252 84,252" fill="' + BOTTOM.dark + '"/>' +
        '<polygon points="100,168 116,168 116,252 106,252" fill="' + BOTTOM.dark + '"/>' +
        '<polygon points="100,168 116,168 116,252 106,252" fill="#000" opacity=".1"/>' +
        '<rect x="82" y="249" width="22" height="10" rx="5" fill="' + INK + '"/>' +
        '<rect x="100" y="249" width="22" height="10" rx="5" fill="' + INK + '"/>';
    }
    if (look.legs === 'wide') { // 松弛感：宽裤腿
      return '' +
        '<polygon points="76,168 99,166 96,250 78,250" fill="' + BOTTOM.khaki + '"/>' +
        '<polygon points="101,166 124,168 122,250 104,250" fill="' + BOTTOM.khaki + '"/>' +
        '<polygon points="101,166 124,168 122,250 104,250" fill="#000" opacity=".1"/>' +
        '<rect x="70" y="247" width="26" height="11" rx="5.5" fill="#8d99ae"/>' +
        '<rect x="104" y="247" width="26" height="11" rx="5.5" fill="#8d99ae"/>';
    }
    if (look.legs === 'slipper') { // 咸鱼：趿拖鞋
      return '' +
        '<polygon points="82,168 100,168 93,252 81,252" fill="' + BOTTOM.dark + '"/>' +
        '<polygon points="100,168 118,168 113,252 101,252" fill="' + BOTTOM.dark + '"/>' +
        '<polygon points="100,168 118,168 113,252 101,252" fill="#000" opacity=".1"/>' +
        '<rect x="76" y="250" width="26" height="9" rx="4.5" fill="#c9b18c"/>' +
        '<rect x="100" y="250" width="26" height="9" rx="4.5" fill="#c9b18c"/>' +
        '<path d="M84 250 Q90 244 96 250 M108 250 Q114 244 120 250" stroke="#8a6248" stroke-width="3" fill="none"/>';
    }
    if (look.bottom === 'skirt') {
      return '' +
        '<rect x="88" y="190" width="9" height="62" fill="' + SKIN[look.skin] + '"/>' +
        '<rect x="103" y="190" width="9" height="62" fill="' + SKIN[look.skin] + '"/>' +
        '<polygon points="78,168 122,168 132,210 68,210" fill="' + shade(c.main, 0.15) + '"/>' +
        '<polygon points="100,168 122,168 132,210 100,210" fill="#000" opacity=".08"/>' +
        '<rect x="78" y="249" width="23" height="10" rx="5" fill="' + INK + '"/>' +
        '<rect x="99" y="249" width="23" height="10" rx="5" fill="' + INK + '"/>';
    }
    var color = BOTTOM[look.bottom];
    return '' +
      '<polygon points="80,168 100,168 99,252 85,252" fill="' + color + '"/>' +
      '<polygon points="100,168 120,168 115,252 101,252" fill="' + color + '"/>' +
      '<polygon points="100,168 120,168 115,252 101,252" fill="#000" opacity=".1"/>' +
      '<rect x="78" y="249" width="23" height="10" rx="5" fill="' + INK + '"/>' +
      '<rect x="99" y="249" width="23" height="10" rx="5" fill="' + INK + '"/>';
  }

  // ---------- 服装 ----------

  function outfitTorso(c, look) {
    var main = c.main;
    var dark = shade(c.main, 0.28);
    var base = '<polygon points="74,116 100,112 100,174 78,174" fill="' + main + '"/>' +
      '<polygon points="100,112 126,116 122,174 100,174" fill="' + dark + '"/>';
    switch (c.outfit) {
      case 'tee':
        return base + '<polygon points="92,113 100,124 108,113" fill="' + shade(c.main, 0.42) + '"/>';
      case 'jacket':
        return base +
          '<polygon points="94,113 106,113 103,174 97,174" fill="' + WHITE + '"/>' +
          '<polygon points="92,113 100,134 95,142 87,118" fill="' + shade(c.main, 0.45) + '"/>' +
          '<polygon points="108,113 113,118 104,142 100,134" fill="' + shade(c.main, 0.45) + '"/>';
      case 'jumpsuit': // 浓人：背带连体服
        return '<polygon points="74,116 100,112 100,174 78,174" fill="' + main + '"/>' +
          '<polygon points="100,112 126,116 122,174 100,174" fill="' + dark + '"/>' +
          '<rect x="86" y="150" width="28" height="14" rx="4" fill="' + light(c.main, 0.55) + '"/>' +
          '<path d="M88 118 L92 112 M112 118 L108 112" stroke="' + light(c.main, 0.55) + '" stroke-width="4" stroke-linecap="round"/>';
      case 'hoodie':
        return base +
          '<path d="M82 116 Q100 134 118 116 L114 111 Q100 122 86 111 Z" fill="' + shade(c.main, 0.18) + '"/>' +
          '<polygon points="86,150 114,150 110,166 90,166" fill="' + shade(c.main, 0.18) + '"/>' +
          '<path d="M96 120 V133 M104 120 V133" stroke="' + WHITE + '" stroke-width="1.6" stroke-linecap="round" fill="none"/>' +
          (look.longHem ? '<polygon points="76,172 124,172 120,196 80,196" fill="' + shade(c.main, 0.12) + '"/>' +
            '<polygon points="100,172 124,172 120,196 100,196" fill="#000" opacity=".08"/>' : '');
      case 'cardigan':
        return base +
          '<polygon points="93,112 107,112 104,174 96,174" fill="' + WHITE + '"/>' +
          '<path d="M92 112 L88 174 M108 112 L112 174" stroke="' + shade(c.main, 0.4) + '" stroke-width="3" fill="none"/>' +
          '<circle cx="100" cy="128" r="1.8" fill="' + shade(c.main, 0.5) + '"/><circle cx="100" cy="144" r="1.8" fill="' + shade(c.main, 0.5) + '"/>' +
          '<path d="M90 116 Q100 126 110 116" fill="none" stroke="' + shade(c.main, 0.4) + '" stroke-width="2"/>';
      case 'suit':
        return base +
          '<polygon points="94,113 106,113 103,174 97,174" fill="' + WHITE + '"/>' +
          '<polygon points="97,113 103,113 104,128 100,134 96,128" fill="' + shade(c.main, 0.55) + '"/>' +
          '<path d="M96 134 L100 158 L104 134" fill="none" stroke="' + shade(c.main, 0.55) + '" stroke-width="2.4"/>' +
          '<g transform="translate(84 128) rotate(6)"><path d="M0 0 L10 4 L5 9 Z" fill="' + shade(c.main, 0.4) + '"/>' +
          '<rect x="2" y="10" width="6" height="9" rx="1" fill="' + WHITE + '" stroke="' + shade(c.main, 0.4) + '" stroke-width="1.4"/>' +
          '<circle cx="5" cy="13.5" r="1.6" fill="' + shade(c.main, 0.35) + '"/></g>';
      default:
        return base;
    }
  }

  // ---------- 道具 ----------

  var PROPS = {
    megaphone: { pose: 'float', svg:
      '<g transform="translate(148 78) rotate(-18)">' +
      '<path d="M-8 8 L26 -6 L26 22 L-8 14 Z" fill="' + INK + '"/>' +
      '<path d="M-4 10 L22 0 L22 16 L-4 12 Z" fill="' + WHITE + '"/>' +
      '<rect x="-14" y="6" width="8" height="12" rx="2" fill="' + INK + '"/></g>' +
      '<path d="M176 62 Q184 72 176 82 M182 52 Q194 72 182 92" stroke="#f5c84c" stroke-width="3.4" stroke-linecap="round" fill="none"/>'
    },
    bubbles: { pose: 'float', svg:
      '<circle cx="142" cy="48" r="11" fill="' + WHITE + '" opacity=".85"/>' +
      '<circle cx="163" cy="66" r="7" fill="' + WHITE + '" opacity=".7"/>' +
      '<circle cx="136" cy="68" r="5.5" fill="' + WHITE + '" opacity=".6"/>' +
      '<path d="M135 42 Q139 38 144 40" stroke="' + WHITE + '" stroke-width="2" stroke-linecap="round" fill="none"/>'
    },
    confettiBurst: { pose: 'float', svg:
      '<path d="M150 34 L154 44 L164 46 L156 53 L158 63 L150 58 L142 63 L144 53 L136 46 L146 44 Z" fill="#f5c84c"/>' +
      '<circle cx="172" cy="40" r="4" fill="#ee8fa6"/><circle cx="178" cy="60" r="3" fill="#8fd0b0"/>' +
      '<circle cx="164" cy="78" r="3.4" fill="#e8705f"/><circle cx="134" cy="30" r="3" fill="#8fd0b0"/>'
    },
    teacup: { pose: 'float', svg:
      '<g transform="translate(150 92)">' +
      '<path d="M-14 6 H14 L11 24 Q0 30 -11 24 Z" fill="' + WHITE + '"/>' +
      '<path d="M13 10 C21 10 21 19 11 20" stroke="' + WHITE + '" stroke-width="4" fill="none"/>' +
      '<path d="M-5 0 C-9 -5 -1 -8 -5 -14 M5 0 C1 -5 9 -8 5 -14" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round" fill="none"/></g>'
    },
    magnifier: { pose: 'float', svg:
      '<g transform="translate(154 82) rotate(14)">' +
      '<circle cx="0" cy="0" r="16" fill="' + WHITE + '" opacity=".55"/>' +
      '<circle cx="0" cy="0" r="16" fill="none" stroke="' + INK + '" stroke-width="4.5"/>' +
      '<path d="M-6 -4 L2 6" stroke="' + WHITE + '" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M12 12 L23 26" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/></g>'
    },
    mic: { pose: 'attach', svg:
      '<g transform="translate(137 88) rotate(8)">' +
      '<rect x="-8" y="-24" width="16" height="26" rx="8" fill="' + INK + '"/>' +
      '<path d="M-4 -18 H4 M-4 -12 H4 M-4 -6 H4" stroke="' + WHITE + '" stroke-width="1.6" stroke-linecap="round"/>' +
      '<rect x="-3.5" y="2" width="7" height="14" rx="3" fill="#e8705f"/></g>'
    },
    notes: { pose: 'float', svg:
      '<g fill="#e85d9e" stroke="#e85d9e">' +
      '<ellipse cx="46" cy="52" rx="6" ry="4.5" stroke="none"/><path d="M52 52 V32 L62 29 V39 L52 42" stroke-width="3" fill="none" stroke-linejoin="round"/>' +
      '<ellipse cx="164" cy="38" rx="5" ry="4" stroke="none"/><path d="M169 38 V22 L177 20 V28 L169 30" stroke-width="2.6" fill="none" stroke-linejoin="round"/></g>'
    },
    fan: { pose: 'attach', svg:
      '<g transform="translate(142 138) rotate(16)">' +
      '<path d="M-4 0 A24 24 0 0 1 20 -14 L2 20 Z" fill="#efe3c8"/>' +
      '<path d="M2 4 L14 -6 M4 10 L18 0" stroke="#d8c49a" stroke-width="1.6"/>' +
      '<path d="M-8 24 L-2 12" stroke="#8a6248" stroke-width="4" stroke-linecap="round"/></g>'
    },
    thermosSide: { pose: 'attach', svg:
      '<g transform="translate(64 142)">' +
      '<rect x="-9" y="-16" width="18" height="30" rx="5" fill="' + INK + '"/>' +
      '<rect x="-7" y="-8" width="14" height="3" rx="1.5" fill="' + WHITE + '"/>' +
      '<rect x="-6" y="-24" width="12" height="8" rx="3" fill="#8a5a2b"/></g>'
    },
    fish: { pose: 'behindArm', svg:
      '<ellipse cx="140" cy="150" rx="17" ry="11" fill="#9fc4d8"/>' +
      '<polygon points="155,150 168,142 168,158" fill="#8ab4cb"/>' +
      '<circle cx="132" cy="147" r="2.2" fill="' + INK + '"/>' +
      '<path d="M132 154 Q137 158 143 154" stroke="' + INK + '" stroke-width="2" stroke-linecap="round" fill="none"/>' +
      '<path d="M128 144 Q126 150 128 156" stroke="#8ab4cb" stroke-width="2" fill="none"/>'
    },
    zz: { pose: 'float', svg:
      '<g stroke="#8f9bb5" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
      '<path d="M40 40 H54 L40 54 H54"/>' +
      '<path d="M58 24 H68 L58 35 H68" stroke-width="2.8"/></g>'
    },
    hotbag: { pose: 'attach', svg:
      '<g transform="translate(138 146)">' +
      '<rect x="-15" y="-13" width="30" height="26" rx="10" fill="#f4a9a0"/>' +
      '<rect x="-5" y="-21" width="10" height="9" rx="3" fill="#e07a5f"/>' +
      '<path d="M-4 -2 L4 6 M4 -2 L-4 6" stroke="' + WHITE + '" stroke-width="3" stroke-linecap="round"/></g>'
    },
    cape: { pose: 'behind', svg: '' }, // 斗篷在人物后面单独画
    briefcase: { pose: 'attach', svg:
      '<g transform="translate(138 150)">' +
      '<rect x="-17" y="-12" width="34" height="24" rx="4" fill="#8a6248"/>' +
      '<path d="M-7 -12 V-17 Q0 -21 7 -17 V-12" fill="none" stroke="' + INK + '" stroke-width="3"/>' +
      '<rect x="-3" y="-4" width="6" height="7" rx="1.5" fill="#f5c84c"/></g>'
    }
  };

  function renderCape(color) {
    return '<path d="M80 116 Q120 112 126 118 Q150 138 158 172 Q140 168 128 174 Q136 200 130 224 Q112 196 100 190 Q86 200 72 226 Q66 194 76 172 Q64 166 46 170 Q54 136 80 116 Z" fill="' + shade(color, 0.2) + '" opacity=".92"/>' +
      '<path d="M100 128 Q122 150 128 190" stroke="' + light(color, 0.3) + '" stroke-width="3" fill="none" opacity=".7"/>';
  }

  /** 兜帽后片（电子咸鱼）：画在头后面的大帽子。 */
  function renderHoodBack(color) {
    return '<g transform="' + HEAD_TRANSFORM + '">' +
      '<path d="M64 96 C60 56 84 44 100 44 C116 44 140 56 136 96 L138 116 Q100 128 62 116 Z" fill="' + shade(color, 0.1) + '"/>' +
      '</g>';
  }

  /**
   * 各人设置型。pose 决定手臂，legs 决定腿型，prop 为标志性道具，
   * headExtra 为头饰，bodyTilt / bodyLift 为整体动势。
   */
  var LOOKS = {
    nong: {
      hair: 'flame', skin: 0, hairColor: 'black',
      eyes: 'eyesHappy', mouth: 'mouthBig', blush: true,
      outfit: 'jumpsuit', bottom: 'denim', legs: 'jump',
      pose: 'cheer', prop: 'megaphone', bodyLift: 8,
      float: ['exclaim']
    },
    dan: {
      hair: 'bob', skin: 1, hairColor: 'black',
      eyes: 'eyesCalm', mouth: 'mouthTiny', longHem: true,
      outfit: 'hoodie', bottom: 'dark', legs: 'together',
      pose: 'behindBack', prop: 'bubbles', float: ['dots']
    },
    feng: {
      hair: 'messy', skin: 0, hairColor: 'chestnut',
      eyes: 'eyesHappy', mouth: 'mouthTongue', blush: true, headExtra: 'partyHat',
      outfit: 'tee', bottom: 'khaki', legs: 'kick',
      pose: 'stand', prop: 'confettiBurst', bodyTilt: -6,
      rightHandProp: 'hornSide'
    },
    song: {
      hair: 'bun', skin: 2, hairColor: 'brown',
      eyes: 'eyesShut', mouth: 'mouthSmile', headExtra: 'leafSprig',
      outfit: 'tee', bottom: 'skirt', legs: 'wide',
      pose: 'handsBehindHead', prop: 'teacup', bodyTilt: 3
    },
    xing: {
      hair: 'side', skin: 1, hairColor: 'black', glasses: 'round',
      eyes: 'eyesOpen', mouth: 'mouthSmirk',
      outfit: 'jacket', bottom: 'dark',
      pose: 'crossed', prop: 'magnifier'
    },
    zui: {
      hair: 'curly', skin: 2, hairColor: 'gold',
      eyes: 'eyesWink', mouth: 'mouthBig', blush: true,
      outfit: 'tee', bottom: 'skirt',
      pose: 'micUpHip', prop: 'mic', extraProp: 'notes'
    },
    lao: {
      hair: 'bun', skin: 3, hairColor: 'silver', glasses: 'reading',
      eyes: 'eyesHappy', mouth: 'mouthContent',
      outfit: 'cardigan', bottom: 'khaki',
      pose: 'fanCrook', prop: 'fan', extraProp: 'thermosSide'
    },
    xianyu: {
      hair: 'fringe', skin: 1, hairColor: 'black',
      eyes: 'eyesSleepy', mouth: 'mouthContent', hoodUp: true, hoodColor: '#94a3b8',
      outfit: 'hoodie', bottom: 'dark', legs: 'slipper',
      pose: 'hipLean', prop: 'fish', extraProp: 'zz', bodyTilt: 4
    },
    cuipi: {
      hair: 'side', skin: 0, hairColor: 'brown',
      eyes: 'eyesOpen', mouth: 'mouthSmile', blush: true, bandaid: true, cape: true,
      outfit: 'tee', bottom: 'denim',
      pose: 'hold', prop: 'hotbag'
    },
    dagong: {
      hair: 'short', skin: 2, hairColor: 'black',
      eyes: 'eyesOpen', mouth: 'mouthSmile',
      outfit: 'suit', bottom: 'dark',
      pose: 'hold', prop: 'briefcase'
    }
  };

  var SIDE_PROPS = {
    hornSide: '<g transform="translate(131 156) rotate(-14)">' +
      '<path d="M0 0 L34 -12 L34 12 Z" fill="#f5c84c"/>' +
      '<rect x="-6" y="-4" width="8" height="8" rx="2" fill="#e8705f"/></g>'
  };

  var FLOAT_DECOS = {
    exclaim: '<g fill="#f5c84c" stroke="' + INK + '" stroke-width="1.6">' +
      '<rect x="46" y="42" width="9" height="22" rx="4"/><circle cx="50.5" cy="74" r="4.5"/>' +
      '<rect x="160" y="34" width="7" height="17" rx="3.5" stroke="none"/><circle cx="163.5" cy="59" r="3.5" stroke="none"/></g>',
    dots: '<g fill="' + INK + '" opacity=".38">' +
      '<circle cx="142" cy="38" r="3.4"/><circle cx="154" cy="36" r="3.4"/><circle cx="166" cy="38" r="3.4"/></g>'
  };

  function renderFigure(key, framing, color, soft) {
    var look = LOOKS[key];
    if (!look) {
      return '';
    }
    var view = framing === 'portrait' ? 'portrait' : 'full';
    var showProp = view === 'full';
    var c = { main: color, outfit: look.outfit };
    var pose = POSES[showProp ? look.pose : 'stand'];
    var skin = SKIN[look.skin];
    var armMain = color;
    var armDark = shade(color, 0.28);
    var prop = PROPS[look.prop] || {};

    var bodyTransform = '';
    if (showProp && look.bodyTilt) {
      bodyTransform = 'rotate(' + look.bodyTilt + ' 100 200)';
    }
    if (showProp && look.bodyLift) {
      bodyTransform += ' translate(0 -' + look.bodyLift + ')';
    }

    var arms = '';
    if (pose.left.poly) {
      arms += '<polygon points="' + pose.left.poly + '" fill="' + armMain + '"/>';
    }
    if (pose.left.hand) {
      arms += '<circle cx="' + pose.left.hand[0] + '" cy="' + pose.left.hand[1] + '" r="6" fill="' + skin + '"/>';
    }
    arms += '<g class="fig-arm">';
    if (pose.right.poly) {
      arms += '<polygon points="' + pose.right.poly + '" fill="' + armDark + '"/>';
    }
    if (look.rightHandProp && showProp) {
      arms += SIDE_PROPS[look.rightHandProp];
    }
    if (pose.right.hand) {
      arms += '<circle cx="' + pose.right.hand[0] + '" cy="' + pose.right.hand[1] + '" r="6" fill="' + skin + '"/>';
    }
    arms += '</g>';

    var floaters = '';
    if (showProp && look.float) {
      look.float.forEach(function (name) {
        floaters += FLOAT_DECOS[name] || '';
      });
    }
    if (showProp && look.extraProp && PROPS[look.extraProp]) {
      floaters += PROPS[look.extraProp].svg;
    }

    var mainProp = '';
    if (showProp && prop.svg && (prop.pose === 'float' || prop.pose === 'attach')) {
      mainProp = prop.svg;
    }
    // 抱在臂弯里的道具（咸鱼）要先画，手臂压在道具上形成"抱着"的层次
    var hugProp = '';
    if (showProp && prop.svg && prop.pose === 'behindArm') {
      hugProp = prop.svg;
    }

    return '' +
      '<svg class="figure figure-' + view + '" viewBox="' + VIEWBOX[view] + '" role="img" aria-label="' + key + ' 人物插画">' +
      (view === 'full' ? '<circle cx="100" cy="142" r="98" fill="' + soft + '"/>' : '') +
      (view === 'full' ? '<ellipse cx="100" cy="' + (look.bodyLift ? 265 : 259) + '" rx="' + (look.bodyLift ? 34 : 42) + '" ry="6" fill="#000" opacity=".08"/>' : '') +
      '<g class="fig-person" transform="' + bodyTransform.trim() + '">' +
      (view === 'full' && look.cape ? renderCape(color) : '') +
      (look.hoodUp ? renderHoodBack(color) : '') +
      (HAIR_BACK[look.hair] && !look.hoodUp ? '<g transform="' + HEAD_TRANSFORM + '" fill="' + HAIR[look.hairColor] + '">' + HAIR_BACK[look.hair] + '</g>' : '') +
      renderLegs(look, c) +
      '<rect x="93" y="98" width="14" height="20" rx="5" fill="' + skin + '"/>' +
      outfitTorso(c, look) +
      hugProp +
      arms +
      mainProp +
      '<g class="fig-head">' + renderHead(look) + '</g>' +
      '</g>' +
      floaters +
      '</svg>';
  }

  window.MENTAL_ART = { renderFigure: renderFigure };
})();
