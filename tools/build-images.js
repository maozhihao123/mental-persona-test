/**
 * 生成分享图片：小红书封面 + 10 张人设结果卡（1242×1656，3:4）。
 *
 * 用法：node tools/build-images.js
 * 依赖本机 Chrome，通过 headless 截图把 HTML 渲染成 PNG，输出到 mental/images/。
 */
'use strict';

var fs = require('fs');
var path = require('path');
var cp = require('child_process');

global.window = {};
require(path.join(__dirname, '..', 'js', 'data.js'));
require(path.join(__dirname, '..', 'js', 'art.js'));
var DATA = global.window.MENTAL_DATA;
var renderFigure = global.window.MENTAL_ART.renderFigure;

var ROOT = path.join(__dirname, '..');
var PAGES_DIR = path.join(ROOT, 'tools', 'pages');
var IMAGES_DIR = path.join(ROOT, 'images');
var CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

var W = 1242;
var H = 1656;

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function baseCss() {
  return '' +
    '* { box-sizing: border-box; margin: 0; padding: 0; }' +
    'html, body { width: ' + W + 'px; height: ' + H + 'px; overflow: hidden; }' +
    'body { font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; -webkit-font-smoothing: antialiased; }';
}

function wrap(title, bodyCss, body) {
  return '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>' + esc(title) + '</title>' +
    '<style>' + baseCss() + bodyCss + '</style></head><body>' + body + '</body></html>';
}

function coverPage() {
  var css = '' +
    'body { background: linear-gradient(165deg, #f6f1ff 0%, #ffeef6 45%, #eaf6ff 100%); display: flex; align-items: center; justify-content: center; }' +
    '.card { position: relative; width: 1062px; height: 1476px; background: #fff; border-radius: 64px; box-shadow: 0 30px 80px rgba(100, 73, 189, .18); text-align: center; padding: 90px 70px; }' +
    '.blob { position: absolute; border-radius: 50%; filter: blur(2px); opacity: .5; }' +
    '.b1 { width: 260px; height: 260px; background: #f3ecff; top: -90px; left: -70px; }' +
    '.b2 { width: 320px; height: 320px; background: #ffeaf3; bottom: -120px; right: -90px; }' +
    '.kicker { display: inline-block; background: rgba(122,95,208,.1); color: #6449bd; font-size: 30px; font-weight: 700; border-radius: 999px; padding: 14px 40px; letter-spacing: 4px; }' +
    'h1 { margin-top: 56px; font-size: 88px; line-height: 1.32; color: #33313d; letter-spacing: 2px; }' +
    'h1 .hl { color: #7a5fd0; }' +
    '.emojis { margin: 56px auto 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 26px; }' +
    '.e { background: #fff; border: 3px solid #f0ecf8; border-radius: 30px; padding: 18px 0 16px; }' +
    '.e svg { display: block; height: 168px; width: auto; margin: 0 auto; }' +
    '.e b { display: block; font-size: 26px; color: #55516a; margin-top: 8px; font-weight: 600; text-align: center; }' +
    '.meta { margin-top: 66px; display: flex; justify-content: center; gap: 22px; }' +
    '.meta span { background: #fff; border: 3px solid #eceaf4; color: #6b6878; font-size: 28px; font-weight: 600; border-radius: 999px; padding: 14px 34px; }' +
    '.cta { margin-top: 78px; display: inline-block; background: linear-gradient(135deg, #8a6ee8, #6449bd); color: #fff; font-size: 42px; font-weight: 800; border-radius: 999px; padding: 34px 90px; letter-spacing: 4px; box-shadow: 0 20px 44px rgba(110,84,210,.4); }' +
    '.foot { position: absolute; left: 0; right: 0; bottom: 44px; font-size: 24px; color: #9b98a6; letter-spacing: 2px; }';

  var emojiCells = DATA.personas.map(function (p) {
    return '<div class="e" style="border-color:' + p.soft + '">' + renderFigure(p.key, 'full', p.color, p.soft) + '<b>' + esc(p.name) + '</b></div>';
  }).join('');

  var body = '' +
    '<div class="card">' +
    '  <div class="blob b1"></div><div class="blob b2"></div>' +
    '  <span class="kicker">全网都在测的精神状态鉴定</span>' +
    '  <h1>测一测，你是哪种<br>「<span class="hl">精神状态</span>」人设？</h1>' +
    '  <div class="emojis">' + emojiCells + '</div>' +
    '  <div class="meta"><span>🎈 32 道趣味单选</span><span>⏱️ 约 3 分钟</span><span>🎭 10 种人设</span></div>' +
    '  <div class="cta">👉 点击开始鉴定</div>' +
    '  <p class="foot">纯娱乐向 · 玩梗皆为正向自嘲 · 测完 @ 朋友来测</p>' +
    '</div>';
  return wrap('cover', css, body);
}

function resultPage(p) {
  var css = '' +
    'body { background: #f4f2fa; display: flex; align-items: center; justify-content: center; }' +
    '.card { position: relative; width: 1062px; height: 1476px; background: #fff; border-radius: 64px; overflow: hidden; text-align: center; box-shadow: 0 30px 80px rgba(60,50,100,.15); }' +
    '.top { position: relative; background: linear-gradient(180deg,' + p.soft + ' 0%, #ffffff 100%); padding: 72px 0 56px; }' +
    '.top .ring { position: absolute; top: -140px; left: 50%; transform: translateX(-50%); width: 720px; height: 720px; border-radius: 50%; background: ' + p.soft + '; opacity: .55; }' +
    '.figure-wrap { position: relative; width: 430px; margin: 0 auto; }' +
    '.figure-wrap svg { display: block; width: 100%; height: auto; }' +
    '.label { position: relative; margin-top: 24px; font-size: 30px; color: #9b98a6; letter-spacing: 8px; }' +
    'h1 { position: relative; margin-top: 6px; font-size: 104px; font-weight: 800; color: ' + p.color + '; letter-spacing: 6px; }' +
    '.slogan { position: relative; margin: 24px auto 0; font-size: 38px; font-weight: 700; color: #33313d; max-width: 820px; line-height: 1.5; }' +
    '.tags { position: relative; margin-top: 32px; display: flex; justify-content: center; gap: 18px; flex-wrap: wrap; }' +
    '.tags span { font-size: 28px; font-weight: 700; color: ' + p.color + '; background: ' + p.soft + '; border-radius: 999px; padding: 12px 30px; }' +
    '.desc { margin: 48px 74px 0; font-size: 32px; line-height: 1.75; color: #55516a; text-align: justify; }' +
    '.banger { margin: 36px 74px 0; font-size: 30px; font-weight: 700; color: #33313d; background: ' + p.soft + '; border-radius: 24px; padding: 24px 30px; }' +
    '.foot { position: absolute; left: 0; right: 0; bottom: 40px; font-size: 26px; color: #9b98a6; letter-spacing: 2px; }';

  var body = '' +
    '<div class="card">' +
    '  <div class="top">' +
    '    <div class="ring"></div>' +
    '    <div class="figure-wrap">' + renderFigure(p.key, 'full', p.color, p.soft) + '</div>' +
    '    <p class="label">你 的 精 神 状 态 人 设 是</p>' +
    '    <h1>' + esc(p.name) + '</h1>' +
    '    <p class="slogan">“' + esc(p.slogan) + '”</p>' +
    '    <div class="tags">' + p.tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' +
    '  </div>' +
    '  <p class="desc">' + esc(p.desc) + '</p>' +
    '  <p class="banger">' + esc(p.banger) + '</p>' +
    '  <p class="foot">测一测你是哪种「精神状态」人设 · 32 题速鉴 · @ 朋友来战</p>' +
    '</div>';
  return wrap(p.key, css, body);
}

function main() {
  fs.mkdirSync(PAGES_DIR, { recursive: true });
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  var jobs = [{ name: 'cover', html: coverPage() }].concat(DATA.personas.map(function (p) {
    return { name: 'result-' + p.key, html: resultPage(p) };
  }));

  jobs.forEach(function (job) {
    var pagePath = path.join(PAGES_DIR, job.name + '.html');
    var outPath = path.join(IMAGES_DIR, job.name + '.png');
    fs.writeFileSync(pagePath, job.html);
    cp.execFileSync(CHROME, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=' + W + ',' + H,
      '--screenshot=' + outPath,
      'file://' + pagePath
    ], { stdio: 'ignore' });
    console.log('generated', outPath);
  });
}

main();
