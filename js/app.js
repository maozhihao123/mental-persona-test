/**
 * 「精神状态人设」测试逻辑：屏幕切换、答题计分与结果渲染。
 *
 * 计分：每个选项绑定一个人设，选中即给该人设 +1；
 * 全部作答后取得分最高者，平分时按人设池顺序取先出现者，保证结果确定。
 * 进度保存在 localStorage，刷新后可继续；无痕模式下退化为不保存。
 */
(function () {
  'use strict';

  var DATA = window.MENTAL_DATA;
  var PERSONAS = DATA.personas;
  var QUESTIONS = DATA.questions;
  var renderFigure = window.MENTAL_ART.renderFigure;
  var STORAGE_KEY = 'mental-persona-v2';

  var el = {
    home: document.getElementById('screen-home'),
    quiz: document.getElementById('screen-quiz'),
    result: document.getElementById('screen-result'),
    btnStart: document.getElementById('btn-start'),
    btnResume: document.getElementById('btn-resume'),
    personaGrid: document.getElementById('persona-grid'),
    btnBack: document.getElementById('btn-back'),
    progressBar: document.getElementById('quiz-progress'),
    progressFill: document.getElementById('quiz-progress-fill'),
    progressCount: document.getElementById('quiz-count'),
    quizBody: document.getElementById('quiz-body'),
    btnQuit: document.getElementById('btn-quit'),
    resultBody: document.getElementById('result-body')
  };

  var state = load();

  function createEmptyState() {
    return { answers: [], index: 0, resultKey: null };
  }

  function load() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return createEmptyState();
      }
      var parsed = JSON.parse(raw);
      var answers = Array.isArray(parsed.answers) ? parsed.answers.slice(0, QUESTIONS.length) : [];
      return {
        answers: answers.map(function (v) { return typeof v === 'number' ? v : null; }),
        index: Math.min(Math.max(Number(parsed.index) || 0, 0), QUESTIONS.length - 1),
        resultKey: parsed.resultKey || null
      };
    } catch (e) {
      return createEmptyState();
    }
  }

  function save() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // 存储不可用时仅失去“刷新后继续”，不影响答题
    }
  }

  // ---------- 屏幕切换 ----------

  function showScreen(name) {
    el.home.hidden = name !== 'home';
    el.quiz.hidden = name !== 'quiz';
    el.result.hidden = name !== 'result';
    window.scrollTo(0, 0);
  }

  // ---------- 首页 ----------

  function figure(key, framing, height) {
    var p = findPersona(key);
    return '<span class="fig-box" style="height:' + height + 'px">' +
      renderFigure(key, framing, p.color, p.soft) + '</span>';
  }

  function renderPersonaGrid() {
    el.personaGrid.innerHTML = PERSONAS.map(function (p) {
      return '' +
        '<div class="persona-chip" style="--chip-soft:' + p.soft + ';--chip-color:' + p.color + '">' +
        '  ' + figure(p.key, 'portrait', 54) +
        '  <span><span class="name">' + p.name + '</span>' +
        '  <span class="tag">' + p.tags[0] + '</span></span>' +
        '</div>';
    }).join('');
  }

  function renderHeroBadges() {
    var trio = ['nong', 'dan', 'feng'];
    document.getElementById('hero-badges').innerHTML = trio.map(function (key) {
      return '<span class="hero-fig">' + renderFigure(key, 'full', findPersona(key).color, findPersona(key).soft) + '</span>';
    }).join('');
  }

  function renderHome() {
    var inProgress = state.answers.length > 0 && !state.resultKey;
    el.btnResume.hidden = !inProgress;
    if (state.resultKey) {
      el.btnStart.textContent = '查看我的鉴定结果';
    } else if (inProgress) {
      el.btnStart.textContent = '继续答题（' + state.answers.length + '/' + QUESTIONS.length + '）';
    } else {
      el.btnStart.textContent = '开始鉴定我的精神状态';
    }
    showScreen('home');
  }

  // ---------- 答题 ----------

  var OPTION_KEYS = ['A', 'B', 'C', 'D'];

  function renderQuestion(direction) {
    var index = state.index;
    var question = QUESTIONS[index];
    var picked = state.answers[index];

    el.quizBody.classList.remove('is-back');
    if (direction === 'back') {
      // 先重置动画再补上反向类，保证连续返回时也能播放动画
      void el.quizBody.offsetWidth;
      el.quizBody.classList.add('is-back');
    }

    el.quizBody.innerHTML = '' +
      '<p class="question-no">第 ' + (index + 1) + ' 题 / 共 ' + QUESTIONS.length + ' 题</p>' +
      '<p class="question-text">' + question.text + '</p>' +
      '<div class="options">' +
      question.options.map(function (option, i) {
        return '' +
          '<button type="button" class="option' + (picked === i ? ' is-picked' : '') + '" data-index="' + i + '">' +
          '<span class="opt-key">' + OPTION_KEYS[i] + '</span><span>' + option.text + '</span>' +
          '</button>';
      }).join('') +
      '</div>';

    var percent = Math.round(state.answers.length / QUESTIONS.length * 100);
    el.progressFill.style.width = percent + '%';
    el.progressBar.setAttribute('aria-valuenow', String(percent));
    el.progressCount.textContent = state.answers.length + '/' + QUESTIONS.length;
    el.btnBack.disabled = index === 0;
    showScreen('quiz');
  }

  /** 记录答案并自动前进；已是最后一题时结算。 */
  function pick(index) {
    state.answers[state.index] = index;
    // 补齐中间被跳过的空位（正常不会发生，防御性处理）
    for (var i = 0; i < state.index; i++) {
      if (state.answers[i] === undefined || state.answers[i] === null) {
        state.answers[i] = 0;
      }
    }
    save();

    if (state.index >= QUESTIONS.length - 1) {
      finish();
      return;
    }
    state.index += 1;
    save();
    window.setTimeout(function () {
      renderQuestion('next');
    }, 200);
  }

  function goBack() {
    if (state.index === 0) {
      return;
    }
    state.index -= 1;
    save();
    renderQuestion('back');
  }

  // ---------- 结果 ----------

  function calculateResult() {
    var scores = {};
    PERSONAS.forEach(function (p) { scores[p.key] = 0; });
    state.answers.forEach(function (answer, i) {
      scores[QUESTIONS[i].options[answer].tag] += 1;
    });

    var max = 0;
    PERSONAS.forEach(function (p) {
      if (scores[p.key] > max) {
        max = scores[p.key];
      }
    });
    var winner = PERSONAS.filter(function (p) { return scores[p.key] === max; })[0];
    return { winner: winner, scores: scores, max: max };
  }

  function finish() {
    var result = calculateResult();
    state.resultKey = result.winner.key;
    save();
    renderResult();
  }

  function findPersona(key) {
    return PERSONAS.filter(function (p) { return p.key === key; })[0];
  }

  function renderResult() {
    var saved = state.resultKey && findPersona(state.resultKey);
    if (!saved) {
      renderHome();
      return;
    }
    var result = calculateResult();
    var winner = result.winner;

    var ranked = PERSONAS.map(function (p) {
      return { persona: p, score: result.scores[p.key] };
    }).sort(function (a, b) { return b.score - a.score; }).slice(0, 5);

    var match = findPersona(winner.match);

    var confettiColors = [winner.color, '#f5c84c', '#ee8fa6', '#8fd0b0', winner.color, '#f5c84c'];
    var confettiHtml = confettiColors.map(function (c, i) {
      var left = 6 + (i * 88 / confettiColors.length) + (i % 2) * 5;
      var top = 10 + (i % 3) * 26;
      var size = 14 + (i % 2) * 6;
      return '<span style="left:' + left + '%;top:' + top + 'px">' +
        '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24"><path d="M12 1 L15 9 L23 12 L15 15 L12 23 L9 15 L1 12 L9 9 Z" fill="' + c + '"/></svg></span>';
    }).join('');

    el.resultBody.innerHTML = '' +
      '<div class="result-card" style="--p-color:' + winner.color + ';--p-soft:' + winner.soft + ';--m-color:' + match.color + ';--m-soft:' + match.soft + '">' +
      '  <div class="result-hero">' +
      '    <div class="confetti" aria-hidden="true">' + confettiHtml + '</div>' +
      '    <div class="result-art">' + renderFigure(winner.key, 'full', winner.color, winner.soft) + '</div>' +
      '    <p class="result-label">你的精神状态人设是</p>' +
      '    <h1 class="result-name">' + winner.name + '</h1>' +
      '    <p class="result-slogan">“' + winner.slogan + '”</p>' +
      '    <div class="result-tags">' + winner.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>' +
      '  </div>' +
      '  <div class="result-detail">' +
      '    <p class="result-desc">' + winner.desc + '</p>' +
      '    <p class="result-banger">' + winner.banger + '</p>' +
      '    <div class="result-match">' +
      '      ' + figure(match.key, 'portrait', 46) +
      '      <span><span class="m-name">速配人设：<b>' + match.name + '</b></span>' +
      '      <span class="m-desc">' + winner.matchDesc + '</span></span>' +
      '    </div>' +
      '  </div>' +
      '  <div class="result-mix">' +
      '    <h2 class="mix-title">你的精神状态成分表</h2>' +
      ranked.map(function (row, i) {
        var pct = Math.max(Math.round(row.score / result.max * 100), 4);
        return '' +
          '<div class="mix-row' + (i === 0 ? ' is-top' : '') + '" style="--m-color:' + row.persona.color + '">' +
          '  ' + figure(row.persona.key, 'portrait', 30) +
          '  <span class="m-name">' + row.persona.name + '</span>' +
          '  <span class="mix-bar"><span class="mix-fill" style="width:' + pct + '%"></span></span>' +
          '  <span class="mix-pct">' + pct + '%</span>' +
          '</div>';
      }).join('') +
      '  </div>' +
      '  <div class="result-actions">' +
      '    <a class="btn btn-primary-lg" href="images/result-' + winner.key + '.png" download="我的精神状态人设-' + winner.name + '.png">保存我的结果卡</a>' +
      '    <button type="button" class="btn btn-secondary-lg" id="btn-retake">再测一次</button>' +
      '    <p class="result-share-hint">把结果卡发到群里，@ 那个最像 TA 的人来测</p>' +
      '  </div>' +
      '</div>';

    document.getElementById('btn-retake').addEventListener('click', restart);
    document.title = '我是「' + winner.name + '」——测一测你的精神状态人设';
    showScreen('result');
  }

  function restart() {
    state = createEmptyState();
    save();
    document.title = '测一测，你是哪种“精神状态”人设？';
    renderQuestion('next');
  }

  // ---------- 事件 ----------

  el.btnStart.addEventListener('click', function () {
    if (state.resultKey) {
      renderResult();
      return;
    }
    renderQuestion('next');
  });

  el.btnResume.addEventListener('click', function () {
    state.index = Math.min(state.answers.length, QUESTIONS.length - 1);
    renderQuestion('next');
  });

  el.btnBack.addEventListener('click', goBack);
  el.btnQuit.addEventListener('click', renderHome);

  el.quizBody.addEventListener('click', function (event) {
    var option = event.target.closest('.option');
    if (!option) {
      return;
    }
    pick(Number(option.getAttribute('data-index')));
  });

  // 键盘 1-4 快捷选择当前题选项
  document.addEventListener('keydown', function (event) {
    if (el.quiz.hidden) {
      return;
    }
    var n = Number(event.key);
    if (n >= 1 && n <= QUESTIONS[state.index].options.length) {
      pick(n - 1);
    }
  });

  renderHeroBadges();
  renderPersonaGrid();
  renderHome();
})();
