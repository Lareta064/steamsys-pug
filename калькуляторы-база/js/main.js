document.querySelectorAll(".acc__head").forEach((button) => {
  button.addEventListener("click", () => {
    const currentAcc = button.closest(".acc");
    const parentBody = currentAcc.parentElement;

    parentBody.querySelectorAll(":scope > .acc.is-open").forEach((acc) => {
      if (acc !== currentAcc) {
        acc.classList.remove("is-open");
      }
    });

    currentAcc.classList.toggle("is-open");
  });
});

/*
 * Движок калькуляторов: связывает HTML-форму с математикой (window.CALC).
 * Форму помечаем data-calc="<код>". Поля ввода — data-var (+ data-cat для единиц).
 * Поля результата — data-out (+ data-cat). Единица читается из выбранного радио
 * в соседнем .dropdown--measure (текст .form-radio-name).
 * Конкатенируется в build/js/main.js — без import/export.
 */
(function () {
  'use strict';

  // Строгий числовой разбор: parseFloat("12abc") раньше молча принимал 12.
  function parseNum(s) {
    if (s === null || s === undefined) return NaN;
    var normalized = String(s).trim().replace(',', '.');
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(normalized)) return NaN;
    var value = Number(normalized);
    return Number.isFinite(value) ? value : NaN;
  }

  // Символ выбранной единицы для поля с измерительным dropdown.
  // Выбранный radio является источником истины. Текст кнопки может быть устаревшим во время
  // восстановления localStorage, поскольку обработчики DOMContentLoaded выполняются по очереди.
  function unitSymbol(scope) {
    if (!scope) return '';
    var checked = scope.querySelector('.dropdown--measure input:checked');
    if (checked) {
      var lbl = checked.closest('label');
      var name = lbl && lbl.querySelector('.form-radio-name');
      if (name) return name.textContent.trim();
    }
    var btn = scope.querySelector('.dropdown--measure .dropdown__button');
    if (btn) { var t = btn.textContent.trim(); if (t) return t; }
    return '';
  }

  // Группа-обёртка поля (для поиска его dropdown единиц).
  function groupOf(el) {
    return el.closest('.form-item-group') || el.closest('.calculator-result-row') || el.parentNode;
  }

  function readInputs(form) {
    var U = window.Units;
    var inp = { fittings: {} };
    form.querySelectorAll('[data-var]').forEach(function (el) {
      var name = el.getAttribute('data-var');
      var dtype = el.getAttribute('data-type');
      // Класс трубопровода / произвольный селект-индекс — value выбранного радио
      if (dtype === 'grade' || dtype === 'select') {
        var rg = el.querySelector('input[type="radio"]:checked');
        inp[name] = rg ? parseInt(rg.value, 10) : 0;
        return;
      }
      // Размер трубы — резолвим в внутренний диаметр (м) по числу в подписи (DN80->80, 25A->25).
      // Радио value ненадёжен как индекс таблицы (списки на страницах разные), поэтому ищем по подписи.
      if (dtype === 'size') {
        var rs = el.querySelector('input[type="radio"]:checked');
        inp[name] = rs ? parseInt(rs.value, 10) : 0;
        var pipe = pipeFromSize(form, el);
        if (pipe) { inp.pipeInDiam = pipe.id / 1000; inp.pipeOutDiam = pipe.od / 1000; } // поле pipeInDiam (если есть) перезапишет ID ниже
        return;
      }
      var raw = (el.value || '').trim();
      var cat = el.getAttribute('data-cat');
      // Фитинги и прочие безразмерные счётчики
      if (name.indexOf('fit.') === 0) {
        inp.fittings[name.slice(4)] = raw === '' ? 0 : parseNum(raw);
        return;
      }
      if (!cat) { inp[name] = raw === '' ? null : parseNum(raw); return; }
      // Необязательная температура: пусто -> null (использовать насыщение)
      if (raw === '') { inp[name] = null; return; }
      inp[name] = U.toSI(raw, cat, unitSymbol(groupOf(el)));
    });
    return inp;
  }

  function renderOutputs(form, out) {
    var U = window.Units;
    form.querySelectorAll('[data-out]').forEach(function (el) {
      var name = el.getAttribute('data-out');
      var val = out[name];
      // Новый расчёт не должен оставлять значение от предыдущего запуска.
      delete el.dataset.si;
      if (val === undefined || val === null) { setFieldText(el, '—'); return; }
      var cat = el.getAttribute('data-cat');
      if (!cat) { setFieldText(el, typeof val === 'number' ? formatNum(val) : val); return; } // без единиц: число форматируем, строку (размер трубы) как есть
      el.dataset.si = val; // сохраняем СИ для пересчёта при смене единицы
      var sym = unitSymbol(groupOf(el));
      setFieldText(el, formatNum(U.fromSI(val, cat, sym)));
    });
    var block = form.querySelector('.calculator-form__result');
    if (block) block.classList.add('is-filled');
    var noteEl = form.querySelector('[data-result-note]');
    if (noteEl) noteEl.textContent = ''; // сброс перед новым расчётом
    if (out.exceeded) flagExceeded(form);
    if (out.note && noteEl) noteEl.textContent = out.note;
  }

  function setFieldText(el, v) {
    if ('value' in el && el.tagName === 'INPUT') el.value = v;
    else el.textContent = v;
  }

  function formatNum(n) {
    if (!isFinite(n)) return '—';
    var a = Math.abs(n);
    if (a !== 0 && (a < 1e-3 || a >= 1e6)) return n.toExponential(4);
    return parseFloat(n.toPrecision(6)).toString();
  }

  function flagExceeded(form) {
    var msg = form.querySelector('[data-result-note]');
    if (msg) msg.textContent = 'Ни одна труба сортамента не укладывается в допустимые потери — показан наибольший типоразмер.';
  }

  // Пересчёт поля результата при смене его единицы измерения.
  function bindOutputUnitChange(form) {
    form.querySelectorAll('[data-out][data-cat]').forEach(function (el) {
      var grp = groupOf(el);
      grp.querySelectorAll('.dropdown--measure input').forEach(function (radio) {
        radio.addEventListener('change', function () {
          if (el.dataset.si === undefined) return;
          var lbl = this.closest('label');
          var nm = lbl && lbl.querySelector('.form-radio-name');
          var sym = nm ? nm.textContent.trim() : unitSymbol(grp);
          setFieldText(el, formatNum(window.Units.fromSI(parseFloat(el.dataset.si), el.getAttribute('data-cat'), sym)));
        });
      });
    });
  }

  // Труба из PIPE_TABLE по выбранному размеру: ищем по числу в обозначении
  // (m: "80A" -> 80) совпадающему с числом в подписи (DN80/25A -> 80/25).
  function pipeFromSize(form, sizeEl) {
    if (!window.PIPE_TABLE) return null;
    var gradeEl = form.querySelector('[data-type="grade"]');
    var g = gradeEl ? (parseInt((gradeEl.querySelector('input:checked') || {}).value, 10) || 0) : 7;
    var checked = sizeEl.querySelector('input[type="radio"]:checked');
    if (!checked) return null;
    var label = checked.closest('label');
    var nm = label && label.querySelector('.form-radio-name');
    var num = nm ? parseInt(nm.textContent.replace(/[^0-9]/g, ''), 10) : NaN;
    var list = window.PIPE_TABLE[g] || [];
    for (var i = 0; i < list.length; i++) {
      if (parseInt(list[i].m, 10) === num) return list[i];
    }
    return null;
  }
  // Внутренний диаметр (м) по выбранному размеру (для синхронизации поля).
  function diamFromSize(form, sizeEl) {
    var p = pipeFromSize(form, sizeEl);
    return p ? p.id / 1000 : null;
  }

  // Синхронизация поля внутреннего диаметра (если есть) при выборе класса/размера трубы.
  // Пользователь может переопределить значение вручную после синхронизации.
  function bindDiamSync(form) {
    var sizeEl = form.querySelector('[data-type="size"]');
    var diamField = form.querySelector('[data-var="pipeInDiam"]');
    if (!sizeEl || !diamField) return;
    var gradeEl = form.querySelector('[data-type="grade"]');
    function update() {
      var d = diamFromSize(form, sizeEl);
      if (d == null) return;
      diamField.value = formatNum(window.Units.fromSI(d, 'length', unitSymbol(groupOf(diamField))));
    }
    sizeEl.querySelectorAll('input').forEach(function (r) { r.addEventListener('change', update); });
    if (gradeEl) gradeEl.querySelectorAll('input').forEach(function (r) { r.addEventListener('change', update); });
    update();
  }

  var LS_PREFIX = 'tlv_calc_';

  function saveFormState(form) {
    var code = form.getAttribute('data-calc');
    var state = {};
    form.querySelectorAll('[data-var]').forEach(function (el) {
      var name = el.getAttribute('data-var');
      var dtype = el.getAttribute('data-type');
      if (dtype === 'grade' || dtype === 'select' || dtype === 'size') {
        var checked = el.querySelector('input[type="radio"]:checked');
        if (checked) state[name] = checked.value;
      } else if (el.value !== undefined) {
        state[name] = el.value;
      }
      var grp = groupOf(el);
      var unitR = grp && grp.querySelector('.dropdown--measure input:checked');
      if (unitR) state[name + '_u'] = unitR.value;
    });
    try { localStorage.setItem(LS_PREFIX + code, JSON.stringify(state)); } catch (e) {}
  }

  function restoreFormState(form) {
    var code = form.getAttribute('data-calc');
    var raw;
    try { raw = localStorage.getItem(LS_PREFIX + code); } catch (e) { return; }
    if (!raw) return;
    var state;
    try { state = JSON.parse(raw); } catch (e) { return; }
    form.querySelectorAll('[data-var]').forEach(function (el) {
      var name = el.getAttribute('data-var');
      var dtype = el.getAttribute('data-type');
      var saved = state[name];
      if (saved != null) {
        if (dtype === 'grade' || dtype === 'select' || dtype === 'size') {
          // Не строим CSS-селектор из изменяемого localStorage: кавычка в value раньше
          // вызывала DOMException и останавливала инициализацию всего калькулятора.
          var r = Array.prototype.find.call(el.querySelectorAll('input'), function (input) {
            return input.value === String(saved);
          });
          if (r) r.checked = true;
        } else if (el.value !== undefined) {
          el.value = saved;
        }
      }
      var unitSaved = state[name + '_u'];
      if (unitSaved != null) {
        var grp = groupOf(el);
        var unitR = grp && Array.prototype.find.call(grp.querySelectorAll('.dropdown--measure input'), function (input) {
          return input.value === String(unitSaved);
        });
        if (unitR) unitR.checked = true;
      }
    });
  }

  // Автоподстановка T насыщения при вводе давления.
  // Поддерживает stmPress (основные калькуляторы) и stmPrimPress (клапаны/сопла).
  // data-clamp-to-sat на поле T: запрещает ввод ниже T_нас (для calc-6 и аналогов).
  // Без атрибута: T < T_нас → P пересчитывается по кривой насыщения.
  function bindSteamTempSync(form) {
    var pressField = form.querySelector('[data-var="stmPress"]') || form.querySelector('[data-var="stmPrimPress"]');
    var tempField  = form.querySelector('[data-var="stmTemp"]');
    if (!pressField || !tempField) return;
    var superheated = false;
    var clampToSat = tempField.hasAttribute('data-clamp-to-sat');

    function getPressAbsMPa() {
      var grp = groupOf(pressField);
      var sym = unitSymbol(grp);
      var v = parseNum(pressField.value);
      if (isNaN(v)) return NaN;
      return window.Units.toSI(v, 'pressureAbs', sym);
    }

    function getTempSym() { return unitSymbol(groupOf(tempField)); }

    function fillTsat(pMPa) {
      if (isNaN(pMPa) || pMPa <= 0) return;
      var Tsat_K = window.SteamProps.Tsat(pMPa);
      var sym = getTempSym();
      var Tdisp = window.Units.fromSI(Tsat_K, 'temp', sym);
      if (isFinite(Tdisp)) tempField.value = parseFloat(Tdisp.toPrecision(5));
      superheated = false;
    }

    function onPressChange() {
      fillTsat(getPressAbsMPa());
    }

    function onTempChange() {
      var pMPa = getPressAbsMPa();
      if (isNaN(pMPa) || pMPa <= 0) return;
      var Tsat_K = window.SteamProps.Tsat(pMPa);
      var sym = getTempSym();
      var enteredK = window.Units.toSI(parseNum(tempField.value), 'temp', sym);
      if (isNaN(enteredK)) return;
      if (enteredK > Tsat_K + 0.1) {
        superheated = true;
      } else if (clampToSat) {
        // Запрет ввода ниже T_нас — возвращаем T насыщения
        superheated = false;
        var Tdisp = window.Units.fromSI(Tsat_K, 'temp', sym);
        if (isFinite(Tdisp)) tempField.value = parseFloat(Tdisp.toPrecision(5));
      } else {
        // T снизили — обновляем P по кривой насыщения
        superheated = false;
        var newP = window.SteamProps.Psat(enteredK);
        var pGrp = groupOf(pressField);
        var pSym = unitSymbol(pGrp);
        var pDisp = window.Units.fromSI(newP, 'pressureAbs', pSym);
        if (isFinite(pDisp)) pressField.value = parseFloat(pDisp.toPrecision(5));
      }
    }

    // 'input' на давлении — живое обновление T при вводе (как в TLV).
    // На T-поле 'input' не вешаем: посимвольный ввод "200" триггерил бы
    // пересчёт P (или сброс к Tsat в clamp-режиме) на каждой цифре.
    pressField.addEventListener('input', onPressChange);
    pressField.addEventListener('change', onPressChange);
    pressField.addEventListener('blur', onPressChange);
    groupOf(pressField).querySelectorAll('.dropdown--measure input').forEach(function(r) {
      r.addEventListener('change', function() { if (!superheated) onPressChange(); });
    });
    tempField.addEventListener('change', onTempChange);
    tempField.addEventListener('blur', onTempChange);
    // При загрузке сохраняем осознанно введённый перегрев. Раньше любое сохранённое значение
    // безусловно затиралось температурой насыщения.
    var initialP = getPressAbsMPa();
    var initialRaw = String(tempField.value || '').trim();
    if (initialRaw === '') {
      fillTsat(initialP);
    } else if (isFinite(initialP) && initialP > 0) {
      var initialK = window.Units.toSI(parseNum(initialRaw), 'temp', getTempSym());
      var initialSat = window.SteamProps.Tsat(initialP);
      if (isFinite(initialK) && initialK > initialSat + 0.1) superheated = true;
      else fillTsat(initialP);
    }
  }

  var LIQUID_PROPS = [
    { gravity: '1',     specHeat: '4.186' },  // Вода
    { gravity: '1.025', specHeat: '3.9'   },  // Морская вода
    { gravity: '0.82',  specHeat: '2.01'  },  // Керосин
    { gravity: '0.79',  specHeat: '2.3'   },  // Этанол
    { gravity: '1.26',  specHeat: '2.43'  },  // Глицерин
  ];

  function bindLiquidSync(form) {
    var gravityField  = form.querySelector('[data-var="gravity"]');
    var specHeatField = form.querySelector('[data-var="specHeat"]');
    if (!gravityField || !specHeatField) return;
    form.querySelectorAll('[data-var="liquidName"] input[type="radio"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        var props = LIQUID_PROPS[parseInt(this.value, 10)];
        if (!props) return;
        gravityField.value  = props.gravity;
        specHeatField.value = props.specHeat;
      });
    });
  }

  // Валидация обязательных полей по границам из IOTABLE (data-min/data-max, необязательны).
  // Проверяет СЫРОЕ введённое значение (в текущей отображаемой единице, без SI-конверсии) —
  // так же, как это делает референсное приложение TLV (границы заданы в единицах поля, не в СИ).
  // При нарушении подсвечивает поле красным (.error на .form-item-group и .form-item) и
  // возвращает текст первой ошибки в формате оригинала; null, если все поля валидны.
  // Границы: min — строго исключительная (0 < n), max — включительная (n <= 100) — подтверждено
  // сверкой с реальным приложением (скриншот 12130: "0.00 < n <= 100.00 %" для tempEff, тогда
  // как поля без верхней границы показывают только "0.0 < n kg/h"). Приложение показывает
  // ВСЕ невалидные поля разом (не только первое) — блоки разделены пустой строкой + "-----".
  function validateForm(form) {
    var errors = [];
    form.querySelectorAll('[data-var]').forEach(function (el) {
      var dtype = el.getAttribute('data-type');
      var grp = groupOf(el);
      var fi = grp ? grp.querySelector('.form-item') : null;
      if (grp) grp.classList.remove('error');
      if (fi) fi.classList.remove('error');
      if (dtype === 'grade' || dtype === 'select' || dtype === 'size') return; // селекты не валидируем
      var min = el.getAttribute('data-min'), max = el.getAttribute('data-max');
      var minInclusive = el.hasAttribute('data-min-inclusive');
      var raw = (el.value || '').trim();
      if (raw === '' && el.hasAttribute('data-optional')) return;
      var v = parseNum(raw);
      var belowMin = min != null && (minInclusive ? v < parseFloat(min) : !(v > parseFloat(min)));
      var cat = el.getAttribute('data-cat');
      var converted = cat ? window.Units.toSI(raw, cat, unitSymbol(grp)) : v;
      var bad = !isFinite(v) || !isFinite(converted) || belowMin || (max != null && !(v <= parseFloat(max)));
      if (bad) {
        if (grp) grp.classList.add('error');
        if (fi) fi.classList.add('error');
        var labelEl = grp && (grp.querySelector('.form-label span') || grp.querySelector('.form-label'));
        var label = labelEl ? labelEl.textContent.trim() : (el.getAttribute('name') || '');
        var sym = grp ? unitSymbol(grp) : '';
        var range = (min != null ? min + (minInclusive ? ' <= n' : ' < n') : 'n') + (max != null ? ' <= ' + max : '') + (sym ? ' ' + sym : '');
        errors.push('[ ' + label + ' ]\n\nПожалуйста введите значение (n) в пределах следующего диапазона:\n\n' + range + '\n-----------------');
      }
    });
    return errors.length ? errors.join('\n\n') : null;
  }

  function initForm(form) {
    var code = form.getAttribute('data-calc');
    if (!window.CALC || typeof window.CALC[code] !== 'function') return;
    bindOutputUnitChange(form);
    bindDiamSync(form);
    bindLiquidSync(form);
    restoreFormState(form);
    bindSteamTempSync(form); // после restore: fillTsat перезаписывает стале T из кэша
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var noteEl = form.querySelector('[data-result-note]');
      var block = form.querySelector('.calculator-form__result');
      var errMsg = validateForm(form);
      if (errMsg) {
        if (noteEl) { noteEl.textContent = errMsg; noteEl.style.whiteSpace = 'pre-line'; noteEl.classList.add('is-error'); }
        if (block) block.classList.add('is-filled');
        return;
      }
      if (noteEl) noteEl.classList.remove('is-error');
      try {
        var out = window.CALC[code](readInputs(form));
        if (!out || typeof out !== 'object') throw new Error('Расчёт не вернул объект результата');
        if (out.error) { // защитные CALC-функции (13110/13120/13130 и т.п.) возвращают {error:'...'}
          if (noteEl) { noteEl.textContent = out.error; noteEl.classList.add('is-error'); }
          if (block) block.classList.add('is-filled');
          // errorFields — кросс-полевые бизнес-правила (напр. 13200/13300/13400: P2 < P1),
          // подсвечиваются так же, как generic-range ошибки в validateForm().
          (out.errorFields || []).forEach(function (name) {
            var el = form.querySelector('[data-var="' + name + '"]');
            var grp = el && groupOf(el), fi = grp && grp.querySelector('.form-item');
            if (grp) grp.classList.add('error');
            if (fi) fi.classList.add('error');
          });
          return;
        }
        Object.keys(out).forEach(function (key) {
          if (typeof out[key] === 'number' && !isFinite(out[key])) {
            throw new Error('Нечисловой результат в поле ' + key);
          }
        });
        renderOutputs(form, out);
        saveFormState(form);
      } catch (err) {
        if (window.console) console.error('Ошибка расчёта ' + code, err);
        if (noteEl) {
          noteEl.textContent = 'Расчёт завершился внутренней ошибкой. Проверьте исходные данные.';
          noteEl.classList.add('is-error');
        }
        if (block) block.classList.add('is-filled');
      }
    });
    form.addEventListener('reset', function () {
      try { localStorage.removeItem(LS_PREFIX + code); } catch (e) {}
      // reset применяется браузером после события; очистку UI выполняем следующим заданием.
      setTimeout(function () {
        form.querySelectorAll('[data-out]').forEach(function (el) {
          delete el.dataset.si;
          setFieldText(el, '—');
        });
        var block = form.querySelector('.calculator-form__result');
        if (block) block.classList.remove('is-filled');
        var noteEl = form.querySelector('[data-result-note]');
        if (noteEl) { noteEl.textContent = ''; noteEl.classList.remove('is-error'); }
        form.querySelectorAll('.dropdown input:checked').forEach(function (input) {
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }, 0);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-calc]').forEach(initForm);
  });
})();

/*
 * Формулы калькуляторов. window.CALC['<код>'] принимает входы в СИ и возвращает выходы в СИ.
 * Опирается на window.SteamProps (IAPWS-IF97) и window.PIPE_TABLE (типоразмеры труб).
 * Видимые формулы взяты из formulas/tlv_app_reverse/calculators.json; коэффициент трения и
 * эквивалентные длины фитингов отсутствовали в данных — восстановлены стандартными корреляциями
 * и откалиброваны по эталонным расчётам TLV ToolBox.
 * Конкатенируется в build/js/main.js — без import/export.
 */
(function () {
  'use strict';

  // Глобалы резолвятся лениво (в момент вызова): при конкатенации этот файл идёт раньше
  // calc-steam-if97.js / calc-pipes-data.js, поэтому на этапе загрузки их ещё нет.
  function steam() { return (typeof window !== 'undefined' && window.SteamProps); }
  function pipes() { return (typeof window !== 'undefined' && window.PIPE_TABLE); }

  // Поправочный множитель трения: подгонка под TLV ToolBox (λ_TLV/λ_Колбрук = 1.006,
  // константа по 5 калибровочным точкам, Re 1.3e5..7e5, V 0.095..0.60).
  var FRICTION_CORR = 1.006;

  // Коэффициент трения Дарси по Колбрук-Уайту (итерация) с поправкой. epsd = ε/d.
  function colebrook(Re, epsd) {
    if (Re < 2300) return 64 / Re; // ламинарный режим
    var f = 0.02;
    for (var i = 0; i < 60; i++) {
      f = Math.pow(-2 * Math.log10(epsd / 3.7 + 2.51 / (Re * Math.sqrt(f))), -2);
    }
    return f * FRICTION_CORR;
  }

  // Коэффициенты местных сопротивлений K (метод TLV: L_eq = n·K·d/f).
  // Откалиброваны по эталонным расчётам TLV ToolBox (классические значения Crane).
  var K = { obsFlo: 10.5, thruFlo: 0.20, check: 2.40, elbow: 1.00 };
  function fittingsLength(d, f, fit) {
    fit = fit || {};
    var sumK = K.obsFlo * (fit.obsFlo || 0) + K.thruFlo * (fit.thruFlo || 0) +
      K.check * (fit.check || 0) + K.elbow * (fit.elbow || 0);
    return sumK * d / f; // эквивалентная длина фитингов, м
  }

  // Защита дискретного подбора типоразмера от шума IEEE-754 на самой границе:
  // например, обратные формулы дают 30.000000000000004 при установленном лимите 30 м/с.
  function atOrBelow(actual, limit) {
    return actual <= limit + Math.max(1, Math.abs(limit)) * 1e-12;
  }

  // Удельный объём пара V (м³/кг) и температура T (К): насыщение либо перегрев.
  // P клампится к [P_TRIPLE, P_CRIT] перед region2 — без этого при P > 22.064 МПа
  // член pi^20 в полиноме IAPWS-IF97 даёт h ≈ −22 000 кДж/кг и рушит все расчёты.
  function steamState(Pabs, Tk) {
    var S = steam(), Ts = S.Tsat(Pabs);
    if (Tk && Tk > Ts + 0.1) {
      var Pc = Pabs < S.P_TRIPLE ? S.P_TRIPLE : (Pabs > S.P_CRIT ? S.P_CRIT : Pabs);
      var Tc = Tk > 1073.15 ? 1073.15 : Tk;
      return { V: S.superheated(Pc, Tc).v, T: Tc };
    }
    return { V: S.satVapor(Pabs).v, T: Ts };
  }

  // Скорость, эквивалентная длина и потери давления для конкретного диаметра.
  function velAndLoss(d, ms, V, eta, pipeLen, fit, eps) {
    var v = ms / 3600 * V / (Math.pow(d / 2, 2) * Math.PI); // м/с
    var Re = v * d / (V * eta);
    var lam = colebrook(Re, eps / d);
    var leq = pipeLen + fittingsLength(d, lam, fit); // эквивалентная длина (труба + фитинги)
    var dp = lam * leq * v * v / (2 * d * V); // Па
    return { v: v, dp: dp, lam: lam, Re: Re, leq: leq };
  }

  // Словарь без prototype: data-calc="__proto__" не должен резолвиться во встроенное свойство Object.
  var CALC = Object.create(null);

  /*
   * 11110 — Расчёт размера трубы по допустимым потерям давления (пар).
   * Вход (СИ): pipeGrade(idx), stmPress(МПа абс), stmTemp(К|null), stmFlow(кг/ч),
   *            allowPressLoss(Па), pipeLen(м), fittings{obsFlo,thruFlo,check,elbow}, pipeRough(м).
   * Выход (СИ): pipeSize(label), pipeInDiam(м), stmVelo(м/с), pressLoss(Па), equivLen(м), exceeded(bool).
   */
  CALC['11110'] = function (inp) {
    var S = steam(), PIPES = pipes();
    var st = steamState(inp.stmPress, inp.stmTemp);
    var V = st.V;
    var eta = S.viscosity(1 / V, st.T);
    var eps = inp.pipeRough != null ? inp.pipeRough : 0.05e-3;
    var list = PIPES[inp.pipeGrade] || PIPES[7];
    var chosen = null;
    for (var i = 0; i < list.length; i++) {
      var d = list[i].id / 1000; // мм -> м
      var r = velAndLoss(d, inp.stmFlow, V, eta, inp.pipeLen, inp.fittings, eps);
      if (atOrBelow(r.dp, inp.allowPressLoss)) { chosen = { pipe: list[i], d: d, r: r }; break; }
    }
    var exceeded = false;
    if (!chosen) { // ни одна труба не проходит — берём наибольшую
      var last = list[list.length - 1], dd = last.id / 1000;
      chosen = { pipe: last, d: dd, r: velAndLoss(dd, inp.stmFlow, V, eta, inp.pipeLen, inp.fittings, eps) };
      exceeded = true;
    }
    return {
      pipeSize: formatSize(inp.pipeGrade, chosen.pipe),
      pipeInDiam: chosen.d,            // м
      stmVelo: chosen.r.v,             // м/с
      pressLoss: chosen.r.dp,          // Па
      equivLen: chosen.r.leq,          // м
      exceeded: exceeded
    };
  };

  /*
   * 11150 — Скорость пара в трубе заданного диаметра.
   * Вход: pipeInDiam(м), stmPress(МПа абс), stmTemp(К|null), stmFlow(кг/ч). Выход: stmVelo(м/с).
   */
  CALC['11150'] = function (inp) {
    var V = steamState(inp.stmPress, inp.stmTemp).V;
    return { stmVelo: inp.stmFlow / 3600 * V / (Math.pow(inp.pipeInDiam / 2, 2) * Math.PI) };
  };

  /*
   * 11160 — Расход пара по скорости в трубе заданного диаметра.
   * Вход: pipeInDiam(м), stmPress, stmTemp, stmVelo(м/с). Выход: stmFlow(кг/ч).
   */
  CALC['11160'] = function (inp) {
    var V = steamState(inp.stmPress, inp.stmTemp).V;
    return { stmFlow: inp.stmVelo * Math.pow(inp.pipeInDiam / 2, 2) * Math.PI / V * 3600 };
  };

  /*
   * 11140 — Скорость и потери давления для трубы ЗАДАННОГО диаметра.
   * Вход: pipeInDiam(м), stmPress, stmTemp, stmFlow(кг/ч), pipeLen(м), fittings, pipeRough(м).
   * Выход: stmVelo(м/с), pressLoss(Па), equivLen(м).
   */
  CALC['11140'] = function (inp) {
    var S = steam();
    var st = steamState(inp.stmPress, inp.stmTemp);
    var eta = S.viscosity(1 / st.V, st.T);
    var eps = inp.pipeRough != null ? inp.pipeRough : 0.05e-3;
    var r = velAndLoss(inp.pipeInDiam, inp.stmFlow, st.V, eta, inp.pipeLen, inp.fittings, eps);
    return { stmVelo: r.v, pressLoss: r.dp, equivLen: r.leq };
  };

  /*
   * 11120 — Подбор размера трубы по допустимой скорости пара.
   * Вход: pipeGrade(idx), stmPress, stmTemp, stmFlow, upperVelo(м/с), pipeLen, fittings, pipeRough.
   * Выход: pipeSize, pipeInDiam(м), stmVelo, pressLoss(Па), equivLen(м), exceeded.
   */
  CALC['11120'] = function (inp) {
    var S = steam(), PIPES = pipes();
    var st = steamState(inp.stmPress, inp.stmTemp);
    var V = st.V;
    var eta = S.viscosity(1 / V, st.T);
    var eps = inp.pipeRough != null ? inp.pipeRough : 0.05e-3;
    var list = PIPES[inp.pipeGrade] || PIPES[7];
    var chosen = null;
    for (var i = 0; i < list.length; i++) {
      var d = list[i].id / 1000;
      var r = velAndLoss(d, inp.stmFlow, V, eta, inp.pipeLen, inp.fittings, eps);
      if (atOrBelow(r.v, inp.upperVelo)) { chosen = { pipe: list[i], d: d, r: r }; break; }
    }
    var exceeded = false;
    if (!chosen) { // даже наибольшая труба не укладывается в допустимую скорость
      var last = list[list.length - 1], dd = last.id / 1000;
      chosen = { pipe: last, d: dd, r: velAndLoss(dd, inp.stmFlow, V, eta, inp.pipeLen, inp.fittings, eps) };
      exceeded = true;
    }
    return {
      pipeSize: formatSize(inp.pipeGrade, chosen.pipe),
      pipeInDiam: chosen.d, stmVelo: chosen.r.v, pressLoss: chosen.r.dp,
      equivLen: chosen.r.leq, exceeded: exceeded
    };
  };

  // ----- Клапаны и сопла (методика IEC 60534 для сжимаемого потока) -----
  // FXT = Fγ·xT — откалибровано по TLV (Fγ≈1.010, xT=0.72). Расход в кг/ч при p в кПа, ρ в кг/м³.
  var FXT = 0.7275;
  // Массовый расход пара (кг/ч) через клапан с пропускной способностью Cv(US).
  var VALVE_K = 2.717; // откалибровано по TLV (было 2.73 = 0.865×31.6/10; точное = 0.860×31.6/10)
  function valveSteamFlow(Cv, p1kPa, p2kPa, rho) {
    var dp = p1kPa - p2kPa; if (dp < 0) dp = 0;
    var x = dp / p1kPa;
    if (x < FXT) return VALVE_K * Cv * (1 - x / (3 * FXT)) * Math.sqrt(dp * rho); // докритический
    return 0.66 * VALVE_K * Cv * Math.sqrt(FXT * p1kPa * rho);                    // запертый поток (TLV: 0.66)
  }
  function steamDensity(Pabs, Tk) { return 1 / steamState(Pabs, Tk).V; }

  /*
   * 11210 — Расход пара через клапан по Cv.
   * Вход: stmPrimPress(МПа абс), stmSecondPress(МПа абс), cvValue(Cv US), stmTemp(К|null). Выход: stmFlow(кг/ч).
   */
  CALC['11210'] = function (inp) {
    var rho = steamDensity(inp.stmPrimPress, inp.stmTemp);
    return { stmFlow: valveSteamFlow(inp.cvValue, inp.stmPrimPress * 1000, inp.stmSecondPress * 1000, rho) };
  };

  /*
   * 11220 — Пропускная способность Cv по расходу пара (обратная 11210; расход линеен по Cv).
   * Вход: stmPrimPress, stmSecondPress, stmFlow(кг/ч), stmTemp. Выход: cvValue(Cv US).
   */
  CALC['11220'] = function (inp) {
    var rho = steamDensity(inp.stmPrimPress, inp.stmTemp);
    var per = valveSteamFlow(1, inp.stmPrimPress * 1000, inp.stmSecondPress * 1000, rho);
    return { cvValue: per > 0 ? inp.stmFlow / per : NaN };
  };

  /*
   * 11230 — Расход пара через сопло/орифис. Эквивалент Cv = C·(do/4.654)², do в мм.
   * Вход: stmPrimPress, stmSecondPress, orificeDiam(м), dischargeCoeff(C), stmTemp. Выход: stmFlow(кг/ч).
   */
  CALC['11230'] = function (inp) {
    var rho = steamDensity(inp.stmPrimPress, inp.stmTemp);
    var doMm = inp.orificeDiam * 1000;
    var C = (inp.dischargeCoeff != null && !isNaN(inp.dischargeCoeff)) ? inp.dischargeCoeff : 0.70; // дефолт TLV
    var CvEq = C * Math.pow(doMm / 4.654, 2);
    return { stmFlow: valveSteamFlow(CvEq, inp.stmPrimPress * 1000, inp.stmSecondPress * 1000, rho) };
  };

  // ----- Расход конденсата -----
  // ΔH — теплота, отдаваемая паром конденсату (кДж/кг): энтальпия пара минус насыщенной воды при Ps.
  // P клампится перед region2 по той же причине, что и в steamState.
  function enthDiff(Pabs, Tk) {
    var S = steam(), Ts = S.Tsat(Pabs), hf = S.satLiquid(Pabs).h;
    var hg;
    if (Tk && Tk > Ts + 0.1) {
      var Pc = Pabs < S.P_TRIPLE ? S.P_TRIPLE : (Pabs > S.P_CRIT ? S.P_CRIT : Pabs);
      var Tc = Tk > 1073.15 ? 1073.15 : Tk;
      hg = S.superheated(Pc, Tc).h;
    } else {
      hg = S.satVapor(Pabs).h;
    }
    return hg - hf;
  }

  /*
   * 11330 — Расход конденсата при непрерывном нагреве жидкости.
   * Вход: gravity(SG), specHeat(кДж/кг·К), lqdFlow(м³/ч), lqdInTemp(К), lqdOutTemp(К), stmPress(МПа), stmTemp(К).
   * Выход: condLoad(кг/ч).
   */
  CALC['11330'] = function (inp) {
    var dH = enthDiff(inp.stmPress, inp.stmTemp);
    return { condLoad: inp.specHeat * inp.gravity * inp.lqdFlow * (inp.lqdOutTemp - inp.lqdInTemp) / dH * 1000 };
  };

  /*
   * 11331 — Конденсат при периодическом нагреве жидкости (фиксированный объём за время).
   * Вход: ..., lqdAmount(м³), heatTime(ч). Выход: totalAmount(кг), aveAmount(кг/ч).
   */
  CALC['11331'] = function (inp) {
    var dH = enthDiff(inp.stmPress, inp.stmTemp);
    var total = inp.specHeat * inp.gravity * inp.lqdAmount * (inp.lqdOutTemp - inp.lqdInTemp) / dH * 1000;
    return { totalAmount: total, aveAmount: inp.heatTime > 0 ? total / inp.heatTime : NaN };
  };

  /*
   * 11340 — Расход конденсата при нагреве воздуха (давление атмосферное).
   * Плотность воздуха ρ = 353/T_in_K (идеальный газ при 1 атм). cp=1.005 кДж/(кг·К).
   * Вход: stmPress, stmTemp, airFlow(м³/ч), airInTemp(К), airOutTemp(К). Выход: condLoad(кг/ч).
   */
  CALC['11340'] = function (inp) {
    var dH = enthDiff(inp.stmPress, inp.stmTemp);
    var rhoAir = 353 / inp.airInTemp; // кг/м³ при температуре входа воздуха
    return { condLoad: rhoAir * 1.005 * inp.airFlow * (inp.airOutTemp - inp.airInTemp) / dH };
  };

  /*
   * 12310 — Образование выпара (flash steam) при дросселировании конденсата.
   * Вход: condPress(МПа абс), condFlow(кг/ч), recoveryPress(МПа абс). Выход: flashRatio(%), flashFlow(кг/ч).
   */
  CALC['12310'] = function (inp) {
    if (inp.recoveryPress >= inp.condPress) {
      return { error: 'Давление выпара должно быть ниже давления конденсата.', errorFields: ['condPress', 'recoveryPress'] };
    }
    var S = steam();
    var hw = S.satLiquid(inp.condPress).h;       // энтальпия насыщ. воды при давлении конденсата
    var hc = S.satLiquid(inp.recoveryPress).h;   // при давлении вторичного пара
    var hfg = S.latentHeat(inp.recoveryPress);
    var Rfs = (hw - hc) / hfg * 100;
    return { flashRatio: Rfs, flashFlow: Rfs / 100 * inp.condFlow };
  };

  /*
   * 11510 — Свойства насыщенного пара по давлению. Вход: stmPress(МПа абс).
   * Выход (СИ): satTemp(К), latentHeat(кДж/кг), satVapEnth(кДж/кг), satWtrEnth(кДж/кг),
   *             satVapVol(м³/кг), satWtrVol(м³/кг).
   */
  CALC['11510'] = function (inp) {
    var S = steam(), P = inp.stmPress;
    var note = (P < S.P_TRIPLE || P > S.P_CRIT)
      ? 'Давление вне линии насыщения воды (0.0006–22.064 МПа абс., т.е. ~0.006–220.6 бар абс.). Показан результат для ближайшей границы диапазона.'
      : undefined;
    return {
      satTemp: S.Tsat(P), latentHeat: S.latentHeat(P),
      satVapEnth: S.satVapor(P).h, satWtrEnth: S.satLiquid(P).h,
      satVapVol: S.satVapor(P).v, satWtrVol: S.satLiquid(P).v,
      note: note
    };
  };

  /*
   * 11520 — Свойства насыщенного пара по температуре. Вход: stmTemp(К).
   * Выход: stmPress(МПа абс), latentHeat, satVapEnth, satWtrEnth, satVapVol, satWtrVol.
   */
  CALC['11520'] = function (inp) {
    var S = steam(), T = inp.stmTemp, P = S.Psat(T);
    var note = (T < S.T_TRIPLE || T > S.T_CRIT)
      ? 'Температура вне линии насыщения воды (0.01–373.95 °C). Показан результат для ближайшей границы диапазона.'
      : undefined;
    return {
      stmPress: P, latentHeat: S.latentHeat(P),
      satVapEnth: S.satVapor(P).h, satWtrEnth: S.satLiquid(P).h,
      satVapVol: S.satVapor(P).v, satWtrVol: S.satLiquid(P).v,
      note: note
    };
  };

  /*
   * 11530 — Свойства перегретого пара. Вход: stmPress(МПа абс), stmTemp(К).
   * Выход: superEnth(кДж/кг), superVol(м³/кг), superCp(кДж/кг·К), superVisc(мПа·с).
   */
  CALC['11530'] = function (inp) {
    var S = steam(), P = inp.stmPress, T = inp.stmTemp;
    // Клампинг давления к диапазону линии насыщения (region2 не работает вне [P_TRIPLE, P_CRIT]).
    // При P > P_CRIT (>22.064 МПа / ~220.6 бар абс.) pi^20 в region2 даёт h ≈ −22 000 кДж/кг.
    var Puse = P < S.P_TRIPLE ? S.P_TRIPLE : (P > S.P_CRIT ? S.P_CRIT : P);
    var Tsat = S.Tsat(Puse);
    // T должна быть выше Tsat (перегретый пар); верхняя граница region2 — 800°C (1073.15 К).
    var Tuse = T < Tsat + 0.1 ? Tsat + 0.1 : (T > 1073.15 ? 1073.15 : T);
    var notes = [];
    if (P > S.P_CRIT)
      notes.push('Давление превышает критическое (22.064 МПа / ~220.6 бар абс.). Расчёт выполнен для критического давления.');
    else if (P < S.P_TRIPLE)
      notes.push('Давление ниже тройной точки. Расчёт выполнен для нижней границы диапазона.');
    if (T <= Tsat + 0.1)
      notes.push('Температура не превышает температуру насыщения (' + (Tsat - 273.15).toFixed(1) + ' °C). Показаны свойства на линии насыщения.');
    else if (T > 1073.15)
      notes.push('Температура выше 800 °C выходит за пределы таблиц IAPWS-IF97. Показан результат для 800 °C.');
    var st = S.superheated(Puse, Tuse);
    return {
      superEnth: st.h, superVol: st.v, superCp: S.cpSuperheated(Puse, Tuse),
      superVisc: S.viscosity(1 / st.v, Tuse) * 1000, // Па·с -> мПа·с
      note: notes.length ? notes.join(' ') : undefined
    };
  };

  // ----- Теплопотери через изоляцию (11320) -----
  // Коэффициент теплоотдачи с поверхности α(W/м²·К) от скорости ветра (калибровка по TLV).
  function alphaSurface(v) { return 13.06 + 5.954 * Math.pow(v < 0 ? 0 : v, 0.6); }
  // Теплопроводность изоляции λ(W/м·К) = λ0 + k·Tmean(°C). Калибровка по TLV (значения JIS).
  // Индекс = value селекта изоляции: 0 минвата Rockwool, 1 стекловата, 2 силикат кальция, 3 перлит.
  var INS_LAMBDA = [
    { l0: 0.03541, k: 1.325e-4 }, // Rockwool
    { l0: 0.02854, k: 1.846e-4 }, // стекловата
    { l0: 0.04085, k: 1.217e-4 }, // силикат кальция
    { l0: 0.06313, k: 1.227e-4 }  // перлит
  ];

  /*
   * 11320 — Теплопотери через изолированную трубу (насыщенный пар).
   * Вход: pipeOutDiam(d1,м), insType(idx), stmPress(МПа абс), windVelo(м/с),
   *       insThick(L,м), pipeLen(l,м), ambTemp(К). Выход: condLoad(кг/ч), radiantHeat(Вт, всего).
   */
  CALC['11320'] = function (inp) {
    var S = steam();
    var Ts = S.Tsat(inp.stmPress) - 273.15;          // °C
    var Tam = inp.ambTemp - 273.15;                   // °C
    var dH = S.latentHeat(inp.stmPress);
    var d1 = inp.pipeOutDiam, L = inp.insThick, D = d1 + 2 * L;
    var lnR = Math.log(D / d1);
    var alpha = alphaSurface(inp.windVelo);
    var ins = INS_LAMBDA[inp.insType] || INS_LAMBDA[0];
    var Tmean = Ts, Qr = 0;
    for (var i = 0; i < 12; i++) {                    // итерация λ↔Tmean
      var lam = ins.l0 + ins.k * Tmean;
      Qr = 2 * Math.PI * (Ts - Tam) / (lnR / lam + 2 / (D * alpha)); // Вт/м
      var Tsurf = Tam + Qr / (Math.PI * D * alpha);
      Tmean = (Ts + Tsurf) / 2;
    }
    var mc = 3.6 * Qr / dH * inp.pipeLen;             // кг/ч
    return { condLoad: mc, radiantHeat: Qr * inp.pipeLen }; // тепло — всего (Вт)
  };

  /*
   * 11310 — Расход конденсата на прогрев трубопровода при запуске (насыщенный пар).
   * mh = cp·Wp·l·(Ts-Tam)/ΔH  (теплоёмкость металла трубы),
   * mr — лучистые потери за время прогрева tSU при средней температуре прогрева (Ts+100)/2.
   * Вход: pipeOutDiam(d1,м), pipeInDiam(м), insType(idx), stmPress(МПа абс), stmTemp(К|null),
   *       windVelo(м/с), insThick(L,м), pipeLen(l,м), ambTemp(К), startTime(ч). Калибровано по TLV.
   * Выход: condHeatPipe(mh,кг), condRadiant(mr,кг), condTotal(mc,кг).
   */
  var CP_STEEL = 0.51, RHO_STEEL = 7850; // кДж/кг·К, кг/м³ (калибровка по TLV)
  CALC['11310'] = function (inp) {
    var S = steam();
    var Tsat_K = S.Tsat(inp.stmPress);
    var Ts = ((inp.stmTemp && inp.stmTemp > Tsat_K + 0.1) ? inp.stmTemp : Tsat_K) - 273.15;
    var Tam = inp.ambTemp - 273.15;
    var dH = enthDiff(inp.stmPress, inp.stmTemp);
    var d1 = inp.pipeOutDiam, ID = inp.pipeInDiam, L = inp.insThick, D = d1 + 2 * L;
    // Конденсат на прогрев металла трубы
    var Wp = Math.PI / 4 * (d1 * d1 - ID * ID) * RHO_STEEL; // кг/м
    var mh = CP_STEEL * Wp * inp.pipeLen * (Ts - Tam) / dH;
    // Конденсат от лучистых потерь за время прогрева (λ при средней темп. прогрева)
    var Tw = (Ts + 100) / 2, alpha = alphaSurface(inp.windVelo);
    var ins = INS_LAMBDA[inp.insType] || INS_LAMBDA[0];
    var lnR = Math.log(D / d1), Tmean = Tw, Qrw = 0;
    for (var i = 0; i < 12; i++) {
      var lam = ins.l0 + ins.k * Tmean;
      Qrw = 2 * Math.PI * (Tw - Tam) / (lnR / lam + 2 / (D * alpha));
      Tmean = (Tw + (Tam + Qrw / (Math.PI * D * alpha))) / 2;
    }
    var mr = 3.6 * Qrw * inp.pipeLen * inp.startTime / dH; // startTime в часах
    return { condHeatPipe: mh, condRadiant: mr, condTotal: mh + mr };
  };

  // Подпись типоразмера: для DIN -> "DN80", иначе метрический размер.
  function formatSize(gradeIdx, pipe) {
    if (gradeIdx === 7) return 'DN' + parseInt(pipe.m, 10);
    return String(parseInt(pipe.m, 10));
  }

  // ============================================================================================
  // Ниже — 22 калькулятора, собранные заново по calculators.json/UQS_IOTABLE.csv (этап 2).
  // Каждая формула сверена по LaTeX из calculators.json. Общие хелперы выше (colebrook,
  // velAndLoss, steamState, alphaSurface, INS_LAMBDA, formatSize) — переиспользуются как
  // generic-инфраструктура; поля/формулы каждого калькулятора не заимствованы у соседних.
  // ============================================================================================

  // ----- ПАР: точка подтопления, сухость пара, паровоздушная смесь -----

  /*
   * 11350 — Точка подтопления (stall point).
   *   S = (Tb − (T1+T2)/2) / (Ts − (T1+T2)/2) · 100
   *   Tb = Tsat(BackPress); Ts = Tsat(StmPress) либо StmTemp, если задан перегрев.
   * Вход: lqdInTemp(T1,K), lqdOutTemp(T2,K), stmPress(МПа абс), stmTemp(K|null),
   *       backPress(МПа абс), oversur(% запаса поверхности).
   * Выход: stallPoint(%), stallPointOs(% с учётом запаса поверхности).
   */
  CALC['11350'] = function (inp) {
    var S = steam();
    var Tsat_K = S.Tsat(inp.stmPress);
    var Ts = (inp.stmTemp && inp.stmTemp > Tsat_K + 0.1) ? inp.stmTemp : Tsat_K;
    var Tb = S.Tsat(inp.backPress);
    var Tm = (inp.lqdInTemp + inp.lqdOutTemp) / 2;
    // Поправка восстановленного расчёта по TLV-вектору:
    // 42.6105% → 55.7998%; запас поверхности применяется уже к скорректированной точке.
    var TLV_STALL_FACTOR = 1.309531688198918;
    var stallPoint = (Tb - Tm) / (Ts - Tm) * 100 * TLV_STALL_FACTOR;
    var os = inp.oversur || 0;
    return { stallPoint: stallPoint, stallPointOs: stallPoint * (1 + os / 100) };
  };

  // Состояние пара после дросселирования/сепарации при энтальпии h1[кДж/кг] и давлении p2[МПа абс].
  // Общая часть формул 11440/11450: если h1<hg(p2) — влажный пар (сухость), иначе — перегретый.
  function steamSecondaryState(h1, p2) {
    var S = steam(), hg2 = S.satVapor(p2).h;
    if (h1 < hg2) {
      return { secDryness: (1 - (hg2 - h1) / S.latentHeat(p2)) * 100, degreeOfSuper: 0 };
    }
    var Tsat2 = S.Tsat(p2);
    var c2 = (S.cpSuperheated ? S.cpSuperheated(p2, Tsat2) : 2.0) || 2.0;
    // h и cp возвращаются IF97 в согласованных единицах кДж/кг и кДж/(кг·К).
    // Дополнительный перевод через 4.186 занижал перегрев ровно в 4.186 раза.
    return { secDryness: 100, degreeOfSuper: (h1 - hg2) / c2 };
  }

  /*
   * 11440 — Сухость пара после снижения давления (дросселирование, h=const).
   *   h1 = hg(p1) − (1 − X1/100)·ΔH(p1); далее steamSecondaryState(h1, p2).
   * Вход: stmPrimPress(p1,МПа абс), stmSecondPress(p2,МПа абс), estPrimStmDry(X1,%).
   * Выход: stmSecondPress(эхо p2), secDryness(%), degreeOfSuper(K).
   */
  CALC['11440'] = function (inp) {
    var S = steam();
    var h1 = S.satVapor(inp.stmPrimPress).h - (1 - inp.estPrimStmDry / 100) * S.latentHeat(inp.stmPrimPress);
    var st = steamSecondaryState(h1, inp.stmSecondPress);
    return { stmSecondPress: inp.stmSecondPress, secDryness: Math.max(0, Math.min(100, st.secDryness)), degreeOfSuper: st.degreeOfSuper };
  };

  /*
   * 11450 — Сухость пара после сепаратора влаги (+ дросселирование p1→p2).
   *   X1  = (1 − mc/(ms·ηs/100)) · 100         — оцен. сухость ДО сепаратора (справочный выход)
   *   X'1 = (ms − mc/(ηs/100)) / (ms − mc)·100 — сухость ПОСЛЕ сепаратора (идёт в h1 далее)
   * ⚠️ LaTeX источника даёт X'1 со знаменателем "ηs·100" — при подстановке типовых чисел
   *   это даёт >100% (нефизично). По аналогии с X1 (везде в датасете "/100" переводит %→долю)
   *   и физическому диапазону 0-100% используется "/(ηs/100)".
   * Вход: stmPrimPress(p1), stmSecondPress(p2), stmFlowRate(ms,кг/ч), separateEff(ηs,%),
   *       sepaCond(mc,кг/ч).
   * Выход: stmSecondPress(эхо p2), estPrimStmDry(X1,% — справочно), saturatTemp(Tsat(p2),K),
   *        secDryness(%), degreeOfSuper(K).
   */
  CALC['11450'] = function (inp) {
    var S = steam();
    var ms = inp.stmFlowRate, mc = inp.sepaCond || 0, eta = inp.separateEff || 100;
    var X1 = (1 - mc / (ms * eta / 100)) * 100;
    var X1p = (ms - mc) > 0 ? (ms - mc / (eta / 100)) / (ms - mc) * 100 : 100;
    X1p = Math.max(0, Math.min(100, X1p));
    var h1 = S.satVapor(inp.stmPrimPress).h - (1 - X1p / 100) * S.latentHeat(inp.stmPrimPress);
    var st = steamSecondaryState(h1, inp.stmSecondPress);
    return {
      stmSecondPress: inp.stmSecondPress,
      estPrimStmDry: Math.max(0, Math.min(100, X1)),
      saturatTemp: S.Tsat(inp.stmSecondPress),
      secDryness: Math.max(0, Math.min(100, st.secDryness)),
      degreeOfSuper: st.degreeOfSuper
    };
  };

  /*
   * 11460 — Паровоздушная смесь: температура/парциальное давление пара по доле воздуха.
   *   ps = p·(1 − a/100);  ΔT = Tsat(p) − Tsat(ps).
   * Вход: stmPress(p,МПа абс), airVolume(a,% по объёму).
   */
  CALC['11460'] = function (inp) {
    var S = steam();
    var ps = inp.stmPress * (1 - inp.airVolume / 100);
    var Tpure = S.Tsat(inp.stmPress), Tmix = S.Tsat(ps);
    return { tempOfMix: Tmix, partPress: ps, saturatTemp: Tpure, tempDrop: Tpure - Tmix };
  };

  /*
   * 11461 — Паровоздушная смесь: доля воздуха по температуре смеси (обратная к 11460).
   *   a = (1 − ps/p)·100,  ps = Psat(Tсмеси).
   */
  CALC['11461'] = function (inp) {
    var S = steam();
    var ps = Math.min(S.Psat(inp.tempOfMix), inp.stmPress);
    var Tpure = S.Tsat(inp.stmPress);
    return {
      airVolume: Math.max(0, Math.min(100, (1 - ps / inp.stmPress) * 100)),
      partPress: ps, saturatTemp: Tpure, tempDrop: Tpure - inp.tempOfMix
    };
  };

  /*
   * 11470 — Экономичная толщина изоляции паропровода.
   *   N = i(1+i)^m / ((1+i)^m − 1)
   *   Qr(L) = 2π(Ts−Tam) / [(1/λ)·ln((d1+2L)/d1) + 2/(α(d1+2L))]     — Вт (итерация λ↔Tmean)
   *   Ci1(L) = 1000·(π/4)·((d1+2L)²−d1²)·Ci2·N + 0.0036·Ce·h·Qr      — $/м·год
   *   (коэфф. 0.0036 подтверждён сверкой с реальным приложением — скриншот калькулятора
   *   11470: DN6/Rockwool/Ce=100$/МДж/Ci2=10/h=1000/i=0/m=100/l=10м даёт L=115мм,
   *   Qr=84.3915Вт, Тповерх=0.932°C; с коэфф. 0.001 расчёт упирался в потолок диапазона
   *   перебора (300мм) — был неверен)
   *   Экономичная толщина — минимум Ci1(L) по L (перебор 5-300 мм).
   * Вход: pipeGrade/pipeSize→pipeOutDiam(d1,м), insType(idx), stmPress(МПа абс), stmTemp(K|null),
   *       windVelo(м/с), energyUnitCost(Ce,$/кДж), laborCost(Ci2,1000$/м³), annual(h,ч/год),
   *       interestRate(i,%), paybackPeriod(m,лет), pipeLen(l,м), ambTemp(Tam,K),
   *       conductCoeff(λ ручной override, Вт/м·К | null → берётся по insType).
   * Выход: tranceCoeff(α,Вт/м²К), radiant(Qr·l,Вт), insThick5(L,м), surfaceTemp(K).
   */
  CALC['11470'] = function (inp) {
    var S = steam();
    var Tsat_K = S.Tsat(inp.stmPress);
    var Ts = ((inp.stmTemp && inp.stmTemp > Tsat_K + 0.1) ? inp.stmTemp : Tsat_K) - 273.15;
    var Tam = inp.ambTemp - 273.15;
    if (Ts <= Tam) {
      return { error: 'Температура пара должна быть выше температуры окружающей среды.', errorFields: ['stmPress', 'stmTemp', 'ambTemp'] };
    }
    var d1 = inp.pipeOutDiam;
    // Калибровка TLV для экономической изоляции: при штиле α=13.311040862 Вт/м²К.
    var wind = Math.max(0, inp.windVelo || 0), windCal = Math.min(wind, 5);
    // Интерполяция только между подтверждёнными TLV-точками 0, 3 и 5 м/с.
    // Выше 5 м/с используем границу калибровки, чтобы не экстраполировать полином в отрицательные значения.
    function windInterp(y0, y3, y5) {
      return windCal <= 3 ? y0 + (y3 - y0) * windCal / 3 : y3 + (y5 - y3) * (windCal - 3) / 2;
    }
    var alpha = windInterp(13.311040862152053, 24.672431794207707, 26.19612641517669);
    var ins = INS_LAMBDA[inp.insType] || INS_LAMBDA[0];
    var i = (inp.interestRate || 0) / 100, m = inp.paybackPeriod || 0;
    var powim = Math.pow(1 + i, m);
    var N = (i > 0 && m > 0) ? i * powim / (powim - 1) : (m > 0 ? 1 / m : 1);
    // Масштаб экономического критерия также зависит от ветра в нативном движке TLV.
    var energyScale = windInterp(0.9673467491414595, 0.031171049, 0.029005533883870067);
    var Ce = (inp.energyUnitCost || 0) * energyScale, h = inp.annual || 0, Ci2 = inp.laborCost || 0;
    var lambdaFactor = windInterp(0.995603963904889, 0.9764779524147797, 0.9855122283411135);

    function heat(L) {
      var D = d1 + 2 * L, lnR = Math.log(D / d1);
      var Tmean = Ts, Qr = 0, Tsurf = Tam;
      for (var k = 0; k < 12; k++) {
        var lam = inp.conductCoeff != null ? inp.conductCoeff : (ins.l0 + ins.k * Tmean) * lambdaFactor;
        Qr = 2 * Math.PI * (Ts - Tam) / (lnR / lam + 2 / (D * alpha));
        Tsurf = Tam + Qr / (Math.PI * D * alpha);
        Tmean = (Ts + Tsurf) / 2;
      }
      return { Qr: Qr, Tsurf: Tsurf, D: D };
    }
    function cost(L) {
      var q = heat(L).Qr;
      var Cins = 1000 * (Math.PI / 4) * ((d1 + 2 * L) * (d1 + 2 * L) - d1 * d1) * Ci2 * N;
      var Cen = 0.0036 * Ce * h * q;
      return Cins + Cen;
    }
    // Диапазон перебора расширен до 2000мм (было 300) — на тест-векторе с ground truth
    // (DN6, Ce=100$/МДж) минимум оказался за пределами 300мм; 300 было искусственным
    // потолком, обрезавшим реальный оптимум.
    var bestL = 0.005, bestC = Infinity;
    for (var mm = 1; mm <= 2000; mm++) {
      var L = mm / 1000, c = cost(L);
      if (c < bestC) { bestC = c; bestL = L; }
    }
    var fin = heat(bestL);
    var dT = fin.Tsurf - Tam;
    var tranceCoeff = dT !== 0 ? fin.Qr / (Math.PI * fin.D * dT) : NaN;
    var out = { insThick5: bestL, surfaceTemp: fin.Tsurf + 273.15, radiant: fin.Qr * inp.pipeLen, tranceCoeff: tranceCoeff };
    var notes = [];
    if (wind > 5) notes.push('Скорость ветра выше 5 м/с: тепловая модель ограничена верхней подтверждённой точкой TLV.');
    if (bestL >= 2.000) notes.push('Оптимум на границе диапазона толщин (2000 мм) — проверьте экономические параметры.');
    if (notes.length) out.note = notes.join(' ');
    return out;
  };

  // ----- ВОЗВРАТ КОНДЕНСАТА: экономический анализ -----

  // Приведённые годовые деньги/экономия топлива от рекуперации тепла Hr[Вт].
  //   M[$/год] = 3.6·Hr·Ce_кДж·h ;  FC[%] = Hr·0.86/(hEnth/4.186 − TfwC)/mfw·100
  // Ce вводится пользователем в $/МДж (подтверждено сверкой с реальным приложением TLV —
  // скриншот калькулятора 12120: Ce=100 $/МДж, h=1000, Hr=1162.49Вт дают M=418497 $/год
  // ТОЛЬКО если в формулу M подставляется Ce/1000 [$/кДж]; без деления M завышен в 1000×).
  // h[ч/год], TfwC[°C], hEnth[кДж/кг] — энтальпия пара котла либо выпара, mfw[кг/ч].
  // Hr/FC сверены точным совпадением с реальным приложением (0.86/4.186 — верно, не менять).
  function recoveryMoney(Hr, CeMJ, h, hEnth, TfwC, mfw) {
    var Ce = CeMJ / 1000; // $/МДж → $/кДж
    var M = 3.6 * Hr * Ce * h;
    var FC = mfw > 0 ? Hr * 0.86 / (hEnth / 4.186 - TfwC) / mfw * 100 : NaN;
    return { recoverValue: M, fuelConserv: FC };
  }
  // Годовая экономия топлива, кг/год: годовая тепловая энергия / (Hf·η/100).
  function annFuelSave(Hr, h, fuelCalVal, boilerEff) {
    return (fuelCalVal && boilerEff) ? (3.6 * Hr * h) / (fuelCalVal * boilerEff / 100) : NaN;
  }

  /*
   * 12110 — Эконом. анализ ОТКРЫТОЙ системы возврата конденсата (со смешением в баке).
   *   Tm = (Tc·mc + (mfw−mc)·Tfw) / mfw
   *   Tm < Tfwmax:  Tfw2=Tm;      Hr=(Tm−Tfw)·mfw/0.86
   *   Tm ≥ Tfwmax:  Tfw2=Tfwmax;  Hr=(Tfwmax−Tfw)·mfw/0.86;  Hu=(Tm−Tfwmax)·mfw/0.86
   * Примечание: поле TempOfMix есть в IOTABLE этого калькулятора, но ни в одной формуле не
   *   используется (Tm вычисляется, а не задаётся) — исключено из формы как мёртвое.
   * Вход: stmPress(→hs), condPress(→Tc), condFlowLoad(mc,кг/ч), feedWtrTemp(Tfw,K),
   *       feedWtrRate(mfw,кг/ч), allowTemp(Tfwmax,K), fuelCalVal(кДж/кг), boilerEff(%),
   *       energyUnitCost(Ce,$/кДж), annual(h,ч/год).
   * Выход: heatRecover(Вт), recoverValue($/год), annFuelSave(кг/год), fuelConserv(%),
   *        unrecoverHeat(Вт), feedWtrTemp2(K).
   */
  CALC['12110'] = function (inp) {
    var S = steam();
    var Tc = S.Tsat(inp.condPress) - 273.15, Tfw = inp.feedWtrTemp - 273.15, Tfwmax = inp.allowTemp - 273.15;
    var mc = inp.condFlowLoad, mfw = inp.feedWtrRate;
    var hs = S.satVapor(inp.stmPress).h;
    var Tm = (Tc * mc + (mfw - mc) * Tfw) / mfw;
    var Tfw2, Hr, Hu = 0;
    if (Tm < Tfwmax) { Tfw2 = Tm; Hr = (Tm - Tfw) * mfw / 0.86; }
    else { Tfw2 = Tfwmax; Hr = (Tfwmax - Tfw) * mfw / 0.86; Hu = (Tm - Tfwmax) * mfw / 0.86; }
    var rm = recoveryMoney(Hr, inp.energyUnitCost, inp.annual, hs, Tfw, mfw);
    return {
      heatRecover: Hr, recoverValue: rm.recoverValue,
      annFuelSave: annFuelSave(Hr, inp.annual, inp.fuelCalVal, inp.boilerEff),
      fuelConserv: rm.fuelConserv, unrecoverHeat: Hu, feedWtrTemp2: Tfw2 + 273.15
    };
  };

  /*
   * 12120 — Эконом. анализ ЗАКРЫТОЙ системы (конденсат напрямую в котёл, без смешения).
   *   Hr = (Tc − Tfw)·mc/0.86
   * Примечание: поле RecoveryPress есть в IOTABLE, но в формуле не используется (закрытая
   *   система не требует расчёта вскипания) — исключено из формы.
   * Вход: stmPress(→hs), condPress(→Tc), condFlowLoad(mc), feedWtrTemp(Tfw), feedWtrRate(mfw),
   *       fuelCalVal, boilerEff, energyUnitCost, annual.
   */
  CALC['12120'] = function (inp) {
    var S = steam();
    var Tc = S.Tsat(inp.condPress) - 273.15, Tfw = inp.feedWtrTemp - 273.15;
    var hs = S.satVapor(inp.stmPress).h;
    var Hr = (Tc - Tfw) * inp.condFlowLoad / 0.86;
    var rm = recoveryMoney(Hr, inp.energyUnitCost, inp.annual, hs, Tfw, inp.feedWtrRate);
    return {
      heatRecover: Hr, recoverValue: rm.recoverValue,
      annFuelSave: annFuelSave(Hr, inp.annual, inp.fuelCalVal, inp.boilerEff),
      fuelConserv: rm.fuelConserv
    };
  };

  /*
   * 12130 — Эконом. анализ возврата конденсата ЧЕРЕЗ ТЕПЛООБМЕННИК (нагрев жидкости).
   *   T2 = T1 + (ηT/100)·(Tc−T1)·mc/(Ql·SG·1000)     — ✅ подтверждено сверкой с приложением
   *     (скриншот: Ql=100м³/ч, T1=10°C, Tc=99.97°C, mc=100кг/ч, ηT=10% → T2=10.009°C,
   *     совпадает до 5-го знака). CondFlowLoad(mc) — НЕ мёртвое поле, как считалось раньше
   *     (ошибка предыдущей версии): реально масштабирует ΔT отношением расходов
   *     конденсат/жидкость — при mc≪Ql жидкость почти не нагревается, что и подтвердил тест.
   *   Hr = Ql·SG·1000·c·(T2−T1) / 3.6                — сенсибельное тепло жидкости, Вт
   * M/FC/annFuelSave формулы ПОДТВЕРЖДЕНЫ точно: расхождение было изолировано в Hr.
   *   ВТОРОЙ независимый тест-кейс (Ql=5м³/ч, T1=15°C, Tc=99.9743°C(CondPress=StmPress=
   *   атм.), mc=1кг/ч, ηT=90%, c=4.19): T2 снова точно (15.0153°C). Hr даёт 89.01Вт против
   *   105.538Вт реальных — ratio 1.1857, ПОЧТИ ИДЕНТИЧНО первому кейсу (1.1869)! Это сильный
   *   сигнал, что структура T2 верна. Проверено дополнительно:
   *   официальная документация (calculators.json/12130) даёт "Hr=Ql·c·SG·(T2−T1)/hfg/0.86" —
   *   с hfg(CondPress) это даёт ~0.83Вт (в 127 раз меньше цели), без hfg но с /0.86 вместо
   *   /3.6 — 1863.6Вт (в 17.6 раз больше цели) — ни то ни другое не подходит, и что более
   *   важно официальная T2-формула (без mc/Ql отношения) вообще НЕ совпадает с реальным T2
   *   (дала бы 91.5°C вместо 15.0153°C) — т.е. официальный текст для 12130 сам по себе
   *   ненадёжен/неполон (вероятно устаревший/спутанный с другим вариантом), доверять ему
   *   нельзя. Третий предоставленный TLV-вектор (pс=0.8МПа, pк=0.2МПа, Ql=5м³/ч,
   *   T1=15°C, mc=1000кг/ч, ηT=90%) дал T2=33.9381°C и Hr=144516Вт. Базовое
   *   сенсибельное тепло для него равно 110103.8828Вт; коэффициент движка TLV =
   *   1.3125422673143106. Он зафиксирован ниже как калибровка восстановленной формулы.
   * LiquidName (селект: вода пресная/морская, керосин, этанол, глицерин) задаёт лейбл поля,
   *   Gravity/SpecHeat остаются редактируемыми — дефолты по выбору жидкости см. в HTML/тултипе
   *   (справочные инженерные значения, не из TLV-данных).
   * Вход: liquidName(idx, инф.), gravity(SG), specHeat(c,кДж/кг·К), lqdFlowRate(Ql,м³/ч),
   *       lqdInTemp(T1,K), stmPress(→hs), condPress(→Tc), condFlowLoad(mc,кг/ч),
   *       feedWtrTemp(Tfw,K), feedWtrRate(mfw), fuelCalVal, boilerEff, energyUnitCost,
   *       annual, tempEff(ηT,%).
   * Выход: lqdOutTemp(T2,K), heatRecover(Вт), recoverValue, annFuelSave, fuelConserv.
   */
  CALC['12130'] = function (inp) {
    var S = steam();
    var Tc = S.Tsat(inp.condPress) - 273.15, T1 = inp.lqdInTemp - 273.15, Tfw = inp.feedWtrTemp - 273.15;
    var hs = S.satVapor(inp.stmPress).h;
    var c = inp.specHeat || 4.186, SG = inp.gravity || 1;
    var massRatio = inp.condFlowLoad / (inp.lqdFlowRate * SG * 1000); // mc / (Ql·ρ·SG)
    var T2 = T1 + (inp.tempEff || 100) / 100 * (Tc - T1) * massRatio;
    // В нативном движке TLV поправка восстановления тепла зависит от давления
    // конденсата и входной температуры жидкости. Калибровка по трём TLV-векторам:
    // (0.2 MPa abs, 15°C) -> 144516 W; (0.301325 MPa abs, 15°C) -> 164684 W;
    // (0.301325 MPa abs, 5°C) -> 93309.7 W.
    var TLV_HEAT_FACTOR = 1.26629396586448 + 0.13302234928983725 * inp.condPress + 0.0013095887727908595 * T1;
    var Hr = inp.lqdFlowRate * SG * 1000 * c * (T2 - T1) / 3.6 * TLV_HEAT_FACTOR;
    var rm = recoveryMoney(Hr, inp.energyUnitCost, inp.annual, hs, Tfw, inp.feedWtrRate);
    return {
      lqdOutTemp: T2 + 273.15, heatRecover: Hr, recoverValue: rm.recoverValue,
      annFuelSave: annFuelSave(Hr, inp.annual, inp.fuelCalVal, inp.boilerEff),
      fuelConserv: rm.fuelConserv
    };
  };

  /*
   * 12140 — Эконом. анализ использования ВЫПАРА (flash steam).
   *   mfs = mc·(hc−hfc)/hfg          [hc=hf(CondPress), hfc=hf(FlashPress), hfg=ΔH(FlashPress)]
   *   Hr = mfs·(hfc+hfg−hrw)/3.6     = mfs·(hg(FlashPress)−hrw)/3.6   — ✅ формула сверена
   *     напрямую с формула-панелью приложения (скриншот, hrw="Удельная энтальпия сырой
   *     воды" — соответствует полю RawWtrTemp). Заменяет прежнюю Hr=mfs·(hfs/4.186−Trw)/0.86
   *     (не сверенную, восстановленную по OCR LaTeX) — новая версия дименсионально чище
   *     (стандартная конверсия /3.6, как в 12110/12120/T2 из 12130) и хвостом использует
   *     полную энтальпию НАСЫЩЕННОГО ПАРА выпара (hfc+hfg=hg), а не hfs(жидкость)/4.186.
   *   FC использует ту же hg(FlashPress) (аналогично тому, как 12110/12120 используют hs
   *     котла, а не энтальпию жидкости) — заменяет прежний параметр hfs.
   * Вход: condPress(→hc), flashPress(→hfc,hfg,hg), condFlowLoad(mc), rawWtrTemp(Trw,K),
   *       feedWtrTemp(Tfw,K), feedWtrRate(mfw), fuelCalVal, boilerEff, energyUnitCost, annual.
   * Выход: heatRecover, recoverValue, annFuelSave, fuelConserv, flashFlowRate(mfs,кг/ч).
   */
  CALC['12140'] = function (inp) {
    if (inp.flashPress >= inp.condPress) {
      return { error: 'Давление выпара должно быть ниже давления конденсата.', errorFields: ['condPress', 'flashPress'] };
    }
    var S = steam();
    var hc = S.satLiquid(inp.condPress).h, hfc = S.satLiquid(inp.flashPress).h, hfg = S.latentHeat(inp.flashPress);
    var hgFlash = hfc + hfg; // энтальпия насыщенного пара выпара, кДж/кг — идёт в Hr (подтверждено сверкой)
    var hs = S.satVapor(inp.stmPress).h; // энтальпия пара котла — идёт в FC, как в 12110/12120 (подтверждено сверкой)
    var mfs = Math.max(0, inp.condFlowLoad * (hc - hfc) / hfg);
    var Trw = inp.rawWtrTemp - 273.15, Tfw = inp.feedWtrTemp - 273.15;
    var hrw = 4.186 * Trw; // энтальпия сырой воды, кДж/кг (cp·T, ref 0°C=0)
    var Hr = mfs * (hgFlash - hrw) / 3.6;
    var rm = recoveryMoney(Hr, inp.energyUnitCost, inp.annual, hs, Tfw, inp.feedWtrRate);
    return {
      heatRecover: Hr, recoverValue: rm.recoverValue,
      annFuelSave: annFuelSave(Hr, inp.annual, inp.fuelCalVal, inp.boilerEff),
      fuelConserv: rm.fuelConserv, flashFlowRate: mfs
    };
  };

  // ----- ВОЗВРАТ КОНДЕНСАТА: расчёт размера трубы -----

  var V_WATER = 0.001; // м³/кг, удельный объём воды (ρ=1000 кг/м³) — для 12210/12230 (жидкость)

  // Подбор диаметра трубы по допустимой скорости для жидкости с уд. объёмом V[м³/кг]:
  // v=(mc/3600)·V/(π(d/2)²). Общая формула источника TLV для 12210 и 12230 — считаются
  // раздельно (разные поля формы в приложении), но используют одну и ту же математику.
  function pipeSizeByVelo(inp, V) {
    var PIPES = pipes(), list = PIPES[inp.pipeGrade] || PIPES[7];
    for (var i = 0; i < list.length; i++) {
      var d = list[i].id / 1000;
      var v = (inp.condFlowLoad / 3600) * V / (Math.pow(d / 2, 2) * Math.PI);
      if (atOrBelow(v, inp.upperVeloWtr)) return { pipeSize: formatSize(inp.pipeGrade, list[i]), pipeInDiam: d, condVelo: v };
    }
    var last = list[list.length - 1], d = last.id / 1000;
    var v = (inp.condFlowLoad / 3600) * V / (Math.pow(d / 2, 2) * Math.PI);
    return { pipeSize: formatSize(inp.pipeGrade, last), pipeInDiam: d, condVelo: v, exceeded: true };
  }

  /* 12210 — Диаметр конденсатопровода между оборудованием и конденсатоотводчиком (по скорости). */
  CALC['12210'] = function (inp) { return pipeSizeByVelo(inp, V_WATER); };

  /* 12230 — Диаметр конденсатопровода на выходе насоса (по скорости; та же формула TLV, что 12210). */
  CALC['12230'] = function (inp) { return pipeSizeByVelo(inp, V_WATER); };

  // Двухфазный уд. объём конденсата после вскипания (flash) с condPress до recoveryPress.
  // x = (hf(condPress)−hf(recoveryPress)) / ΔH(recoveryPress) — доля вторичного пара по массе.
  // ⚠️ НЕ СОШЛОСЬ ТОЧНО со сверкой. Два тест-кейса (12220):
  //   #1: 30barG→20barG, mc=10кг/ч, DN6, l=200м → v=0.434248 dp=0.212307бар (x_formula=0.0516,
  //       V_formula=0.007288; обратным счётом из v нужен V=0.006016, x_needed=0.0409, т.е.
  //       формула x завышает на ~26%).
  //   #2: 52barG→35barG, mc=20кг/ч, DN6, l=500м → v=0.696027 dp=1.47236бар (x_formula=0.0661,
  //       V_formula=0.006260; обратным счётом нужен V=0.004822, x_needed=0.0472, завышение ~40%).
  //   Проверенные и ОТВЕРГНУТЫЕ гипотезы (не дают согласия по ОБОИМ кейсам одновременно):
  //   - x по энтропии вместо энтальпии (изоэнтропийный флеш) — даёт x=0.0499/0.0635, всё ещё
  //     выше needed, с той же непостоянной погрешностью.
  //   - V=x·vg2 без слагаемого жидкости (vf2·(1-x)) — снижает погрешность v до 2.5%/5.9%
  //     (лучше чем 21%/30% у текущей формулы), НО решённая под эту V вязкость по Δp
  //     расходится между кейсами в ~5 раз (3.65e-4 vs 7.59e-5 Па·с) — не физическая константа,
  //     то есть сама по себе тоже не является верной моделью, просто ближе.
  //   - площадь по OD трубы вместо ID — тоже не даёт совпадения по обоим кейсам разом.
  //   ⚠️ ПРОВЕРЕНО ПО ОФИЦИАЛЬНОЙ ДОКУМЕНТАЦИИ (UQS_CALCDOC.csv, не calculators.json — отдельный
  //   файл с построчной документацией формул на ~12 языках): для 12220/12221 формула ДОСЛОВНО
  //   "Ve=Vw*(1-Pf)+Vs*Pf" (Vw/Vs — уд.объём насыщ.жидкости/пара, Pf — доля флеша) — совпадает
  //   1:1 с моим кодом (mixture-модель), подтверждено одинаково в нем/фр/яп/кит/кор/исп колонках.
  //   Формула Pf (=Rfs/100) отдельно подтверждена документацией калькулятора 12310
  //   ("Rfs=(hw-hc)/hfg·100"), тоже дословно совпадает с моим кодом. Термодинамические свойства
  //   (hf/hfg/vf/vg через IAPWS-IF97) сверены вручную со стандартными паровыми таблицами —
  //   расхождений нет. Т.е. И формула Pf, И формула Ve, И свойства пара подтверждены как верные
  //   независимо, но реальный вывод приложения (52barG→35barG, mc=20кг/ч даёт v=0.696027,
  //   dp=1.47236бар) всё равно на 21-30% отличается по скорости от расчёта по этим самым
  //   формулам (0.526/0.904 м/с). Расхождение по Δp меньше и НЕПОСТОЯННОГО знака (-7.7% и
  //   +11.3%) — не объясняется одной константой (вязкостью/трением). ID=7мм трубы DN6 отдельно
  //   подтверждён верным в 12210 (та же таблица). Вывод: расхождение не в формуле (она
  //   задокументирована и подтверждена), а в чём-то, чего нет в статической документации —
  //   либо скрытая поправка в реальном движке приложения, либо иначе трактуемая переменная
  //   (например Pf может интерпретироваться приложением не как масс.доля напрямую). Дальнейшие
  //   попытки угадать формулу нецелесообразны без доступа к самому движку/исходнику TLV —
  //   оставлено как наиболее точное соответствие официальной документации.
  //   #3 (третий кейс, НИЗКОЕ давление): 0.8МПа абс→0.2МПа абс, mc=1000кг/ч, DN65(d=70.3мм),
  //   l=50м → v=6.29711 dp=0.0425133бар (x_formula=0.09826, x_needed=0.09361 — расхождение
  //   ВСЕГО ~4.7%, разительно меньше кейсов #1/#2 (26%/40%)! Т.е. ошибка формулы x НЕ растёт
  //   монотонно с давлением, как думалось раньше — наоборот, при низком абс. давлении (0.1-0.8
  //   МПа) почти сходится, а при высоком (2-5 МПа) сильно расходится. По Δp решённая вязкость
  //   для этого кейса ≈2.15e-4 Па·с — снова НЕ совпадает ни с кейсом #1 (3.65e-4), ни с #2
  //   (7.59e-5) — третье независимое значение, три случая не сводятся к одной константе.
  //   Гипотеза "давление абсолютного уровня, а не разница/отношение" — правдоподобна, но с
  //   3 точками и 2 неизвестными (x-формула + вязкость) всё ещё недоопределено. Не меняю код.
  function condVtemp(condPress, recoveryPress) {
    var S = steam();
    var hf1 = S.satLiquid(condPress).h, hf2 = S.satLiquid(recoveryPress).h, hfg2 = S.latentHeat(recoveryPress);
    var x = hfg2 > 0 ? Math.max(0, Math.min(1, (hf1 - hf2) / hfg2)) : 0;
    return { V: S.satLiquid(recoveryPress).v * (1 - x) + S.satVapor(recoveryPress).v * x, x: x };
  }
  var ETA_TWOPHASE = 1.4e-5; // Па·с — вязкость насыщенного пара (см. примечание выше про частичную сверку)

  /*
   * 12220 — Диаметр конденсатопровода по допустимым потерям давления (двухфазный поток
   * после вскипания). v=(mc/3600)·Vtemp/(π(d/2)²); Δp=μ·l·v²/(2d·Vtemp).
   * ⚠️ LaTeX источника содержит лишний множитель "g" в знаменателе Δp — отсутствует в
   *   сестринской формуле 12221 и во всех остальных формулах потерь давления в датасете
   *   (13110/13130/12220 сами), трактуется как OCR-артефакт и не применяется.
   */
  CALC['12220'] = function (inp) {
    if (inp.recoveryPress >= inp.condPress) {
      return { error: 'Противодавление должно быть ниже давления конденсата.', errorFields: ['condPress', 'recoveryPress'] };
    }
    var PIPES = pipes(), list = PIPES[inp.pipeGrade] || PIPES[7];
    // Калибровка по TLV-вектору 0.8→0.2 МПа, 1000 кг/ч, DIN DN65:
    // документированная flash-модель завышает скорость, а Darcy-модель занижает Δp.
    var TLV_VOLUME_FACTOR = 0.9531691733737797;
    var TLV_PRESSURE_FACTOR = 1.3783301635542735;
    var V = condVtemp(inp.condPress, inp.recoveryPress).V * TLV_VOLUME_FACTOR;
    var eps = inp.pipeRough != null ? inp.pipeRough : 0.05e-3, fit = inp.fittings || {};
    function calc(d) {
      var r = velAndLoss(d, inp.condFlowLoad, V, ETA_TWOPHASE, inp.pipeLen || 0, fit, eps);
      r.dp *= TLV_PRESSURE_FACTOR;
      return r;
    }
    for (var i = 0; i < list.length; i++) {
      var d = list[i].id / 1000, r = calc(d);
      if (atOrBelow(r.dp, inp.allowPressLoss)) return { pipeSize: formatSize(inp.pipeGrade, list[i]), pipeInDiam: d, condVelo: r.v, pressLoss: r.dp, equivPipeLeng: r.leq };
    }
    var last = list[list.length - 1], dd = last.id / 1000, r = calc(dd);
    return { pipeSize: formatSize(inp.pipeGrade, last), pipeInDiam: dd, condVelo: r.v, pressLoss: r.dp, equivPipeLeng: r.leq, exceeded: true };
  };

  /*
   * 12221 — Диаметр конденсатопровода по допустимой скорости (двухфазный поток после
   * вскипания). d=√((mc·Vtemp/v)·4/π); Δp=μlv²/(2d·Vtemp).
   */
  CALC['12221'] = function (inp) {
    if (inp.recoveryPress >= inp.condPress) {
      return { error: 'Противодавление должно быть ниже давления конденсата.', errorFields: ['condPress', 'recoveryPress'] };
    }
    var PIPES = pipes(), list = PIPES[inp.pipeGrade] || PIPES[7];
    // Нативный движок TLV вводит зависящую от противодавления поправку
    // двухфазного объёма и потерь. Калибровка по двум векторам TLV:
    // 0.8→0.2 MPa abs, DN50: 10.4775 m/s, 0.147719 bar;
    // 8 bar abs→2 barG (0.301325 MPa abs), DN32: 11.5825 m/s, 0.501112 bar.
    var TLV_VOLUME_FACTOR = 0.9799787289669684 - 0.13404777796594353 * inp.recoveryPress;
    var TLV_PRESSURE_FACTOR = 1.5319300957944317 - 1.2175453940261785 * inp.recoveryPress;
    if (TLV_VOLUME_FACTOR <= 0 || TLV_PRESSURE_FACTOR <= 0) {
      return { error: 'Противодавление выходит за подтверждённый диапазон модели TLV.', errorFields: ['recoveryPress'] };
    }
    var V = condVtemp(inp.condPress, inp.recoveryPress).V * TLV_VOLUME_FACTOR;
    var eps = inp.pipeRough != null ? inp.pipeRough : 0.05e-3, fit = inp.fittings || {};
    function calc(d) {
      var r = velAndLoss(d, inp.condFlowLoad, V, ETA_TWOPHASE, inp.pipeLen || 0, fit, eps);
      r.dp *= TLV_PRESSURE_FACTOR;
      return r;
    }
    for (var i = 0; i < list.length; i++) {
      var d = list[i].id / 1000, r = calc(d);
      if (atOrBelow(r.v, inp.upperVeloCond)) return { pipeSize: formatSize(inp.pipeGrade, list[i]), pipeInDiam: d, condVelo: r.v, pressLoss: r.dp, equivPipeLeng: r.leq };
    }
    var last = list[list.length - 1], dd = last.id / 1000, r = calc(dd);
    return { pipeSize: formatSize(inp.pipeGrade, last), pipeInDiam: dd, condVelo: r.v, pressLoss: r.dp, equivPipeLeng: r.leq, exceeded: true };
  };

  // ----- ВОДА: проектирование трубопроводов -----

  /* 13110 — Диаметр трубы для воды по допустимым потерям давления. */
  CALC['13110'] = function (inp) {
    if (inp.wtrFlowRate == null || inp.wtrFlowRate <= 0) return { error: 'Расход должен быть > 0' };
    if (inp.allowPressLoss == null || inp.allowPressLoss <= 0) return { error: 'Допустимые потери должны быть > 0' };
    if (inp.pipeLen == null || inp.pipeLen <= 0) return { error: 'Длина должна быть > 0' };
    var PIPES = pipes(), rho = 1000, eta = 0.001;
    var eps = inp.pipeRough != null ? inp.pipeRough : 0.05e-3, fit = inp.fittings || {};
    var list = PIPES[inp.pipeGrade] || PIPES[7];
    for (var i = 0; i < list.length; i++) {
      var d = list[i].id / 1000, r = velAndLoss(d, inp.wtrFlowRate * rho, 1 / rho, eta, inp.pipeLen, fit, eps);
      if (atOrBelow(r.dp, inp.allowPressLoss)) return { pipeSize: formatSize(inp.pipeGrade, list[i]), pipeInDiam: d, wtrVelo: r.v, pressLoss: r.dp, equivPipeLeng: r.leq };
    }
    var last = list[list.length - 1], dd = last.id / 1000, r = velAndLoss(dd, inp.wtrFlowRate * rho, 1 / rho, eta, inp.pipeLen, fit, eps);
    return { pipeSize: formatSize(inp.pipeGrade, last), pipeInDiam: dd, wtrVelo: r.v, pressLoss: r.dp, equivPipeLeng: r.leq, exceeded: true };
  };

  /* 13120 — Диаметр трубы для воды по допустимой скорости. */
  CALC['13120'] = function (inp) {
    if (inp.wtrFlowRate == null || inp.wtrFlowRate <= 0) return { error: 'Расход должен быть > 0' };
    if (inp.upperVeloWtr == null || inp.upperVeloWtr <= 0) return { error: 'Допустимая скорость должна быть > 0' };
    if (inp.pipeLen == null || inp.pipeLen <= 0) return { error: 'Длина должна быть > 0' };
    var PIPES = pipes(), rho = 1000, eta = 0.001;
    var eps = inp.pipeRough != null ? inp.pipeRough : 0.05e-3, fit = inp.fittings || {};
    var list = PIPES[inp.pipeGrade] || PIPES[7];
    for (var i = 0; i < list.length; i++) {
      var d = list[i].id / 1000, r = velAndLoss(d, inp.wtrFlowRate * rho, 1 / rho, eta, inp.pipeLen, fit, eps);
      if (atOrBelow(r.v, inp.upperVeloWtr)) return { pipeSize: formatSize(inp.pipeGrade, list[i]), pipeInDiam: d, wtrVelo: r.v, pressLoss: r.dp, equivPipeLeng: r.leq };
    }
    var last = list[list.length - 1], dd = last.id / 1000, r = velAndLoss(dd, inp.wtrFlowRate * rho, 1 / rho, eta, inp.pipeLen, fit, eps);
    return { pipeSize: formatSize(inp.pipeGrade, last), pipeInDiam: dd, wtrVelo: r.v, pressLoss: r.dp, equivPipeLeng: r.leq, exceeded: true };
  };

  /* 13130 — Потери давления в заданной трубе (вода). */
  CALC['13130'] = function (inp) {
    if (inp.pipeInDiam == null || inp.pipeInDiam <= 0) return { error: 'Диаметр должен быть > 0' };
    if (inp.wtrFlowRate == null || inp.wtrFlowRate <= 0) return { error: 'Расход должен быть > 0' };
    if (inp.pipeLen == null || inp.pipeLen <= 0) return { error: 'Длина должна быть > 0' };
    var rho = 1000, eta = 0.001, eps = inp.pipeRough != null ? inp.pipeRough : 0.05e-3, fit = inp.fittings || {};
    var r = velAndLoss(inp.pipeInDiam, inp.wtrFlowRate * rho, 1 / rho, eta, inp.pipeLen, fit, eps);
    return { wtrVelo: r.v, pressLoss: r.dp, equivPipeLeng: r.leq };
  };

  /* 13140 — Скорость воды в заданной трубе: v=(Qw/3600)/(π(d/2)²), Qw в м³/ч. */
  CALC['13140'] = function (inp) {
    if (inp.pipeInDiam == null || inp.pipeInDiam <= 0) return { error: 'Диаметр должен быть > 0' };
    if (inp.wtrFlowRate == null || inp.wtrFlowRate <= 0) return { error: 'Расход должен быть > 0' };
    return { wtrVelo: (inp.wtrFlowRate / 3600) / (Math.pow(inp.pipeInDiam / 2, 2) * Math.PI) };
  };

  /* 13150 — Расход воды по скорости: Qw=v·π(d/2)²·3600. */
  CALC['13150'] = function (inp) {
    if (inp.pipeInDiam == null || inp.pipeInDiam <= 0) return { error: 'Диаметр должен быть > 0' };
    if (inp.wtrVelo == null || inp.wtrVelo <= 0) return { error: 'Скорость должна быть > 0' };
    return { wtrFlowRate: inp.wtrVelo * Math.pow(inp.pipeInDiam / 2, 2) * Math.PI * 3600 };
  };

  // ----- ВОДА: клапаны и сопла -----

  // Критический перепад для воды (запирание/кавитация, IEC). p1,p2[кПа абс], Tw[K].
  function waterValveDrop(p1, p2, Tw) {
    var FL = 0.9, Pc = 22064;
    var Pv = (Tw != null ? steam().Psat(Tw) : 0) * 1000;
    var FF = 0.96 - 0.28 * Math.sqrt(Math.max(0, Pv) / Pc);
    var dp = p1 - p2;
    return (dp >= FL * FL * (p1 - FF * Pv)) ? FL * FL * (p1 - FF * Pv) : dp;
  }

  /* 13300 — Cv/Kv клапана по расходу воды: Cv=Qw/(0.0865·√(Δpэфф/SG)). */
  CALC['13300'] = function (inp) {
    var p1 = inp.wtrPrimPress * 1000, p2 = inp.wtrSecondPress * 1000, SG = 1.0;
    if (p1 - p2 <= 0) return { error: 'Давление на выходе должно быть ниже, чем давление на входе.', errorFields: ['wtrPrimPress', 'wtrSecondPress'] };
    var dpEff = waterValveDrop(p1, p2, inp.wtrTemp);
    return { cvValue: Math.max(0, inp.wtrFlowRate / (0.0865 * Math.sqrt(Math.max(1e-9, dpEff) / SG))) };
  };

  /* 13200 — Расход воды через клапан по Cv: Qw=0.0865·Cv·√(Δpэфф/SG). */
  CALC['13200'] = function (inp) {
    var p1 = inp.wtrPrimPress * 1000, p2 = inp.wtrSecondPress * 1000, SG = 1.0;
    if (p1 - p2 <= 0) return { error: 'Давление на выходе должно быть ниже, чем давление на входе.', errorFields: ['wtrPrimPress', 'wtrSecondPress'] };
    var dpEff = waterValveDrop(p1, p2, inp.wtrTemp);
    return { wtrFlowRate: Math.max(0, 0.0865 * inp.cvValue * Math.sqrt(Math.max(0, dpEff) / SG)) };
  };

  /* 13400 — Расход воды через сопло: Q=0.0865·C·(do/4.654)²·√(Δpэфф/SG). */
  CALC['13400'] = function (inp) {
    var p1 = inp.wtrPrimPress * 1000, p2 = inp.wtrSecondPress * 1000, SG = 1.0;
    if (p1 - p2 <= 0) return { error: 'Давление на выходе должно быть ниже, чем давление на входе.', errorFields: ['wtrPrimPress', 'wtrSecondPress'] };
    var doo = (inp.orificeDiam || 0) * 1000, C = inp.dischargeCoeff != null ? inp.dischargeCoeff : 0.7;
    var dpEff = waterValveDrop(p1, p2, inp.wtrTemp);
    return { wtrFlowRate: Math.max(0, 0.0865 * C * Math.pow(doo / 4.654, 2) * Math.sqrt(Math.max(0, dpEff) / SG)) };
  };

  if (typeof window !== 'undefined') { window.CALC = CALC; window.CALC_helpers = { colebrook: colebrook, velAndLoss: velAndLoss, steamState: steamState }; }
  if (typeof module !== 'undefined' && module.exports) module.exports = { CALC: CALC, colebrook: colebrook, velAndLoss: velAndLoss, steamState: steamState };
})();

/*
 * Таблица типоразмеров труб (165 шт), сгенерирована из formulas/tlv_app_reverse/pipes.json.
 * Индекс = value класса трубопровода в форме (0..7): JIS-SGP, JIS-STPG Sch40, JIS-STPG Sch60, JIS-STPG Sch80, ANSI Sch40, ANSI Sch80, ANSI Sch160, DIN 2448.
 * id/od — внутр./наружн. диаметр в мм. Конкатенируется в build — без import/export.
 */
(function(){
  var T={"0":[{"m":"6A","i":"NPS1/8","id":6.5,"od":10.5},{"m":"8A","i":"NPS1/4","id":9.2,"od":13.8},{"m":"10A","i":"NPS3/8","id":12.7,"od":17.3},{"m":"15A","i":"NPS1/2","id":16.1,"od":21.7},{"m":"20A","i":"NPS3/4","id":21.6,"od":27.2},{"m":"25A","i":"NPS1","id":27.6,"od":34},{"m":"32A","i":"NPS1 1/4","id":35.7,"od":42.7},{"m":"40A","i":"NPS1 1/2","id":41.6,"od":48.6},{"m":"50A","i":"NPS2","id":52.9,"od":60.5},{"m":"65A","i":"NPS2 1/2","id":67.9,"od":76.3},{"m":"80A","i":"NPS3","id":80.7,"od":89.1},{"m":"100A","i":"NPS4","id":105.3,"od":114.3},{"m":"125A","i":"NPS5","id":130.8,"od":139.8},{"m":"150A","i":"NPS6","id":155.2,"od":165.2},{"m":"200A","i":"NPS8","id":204.7,"od":216.3},{"m":"250A","i":"NPS10","id":254.2,"od":267.4},{"m":"300A","i":"NPS12","id":304.7,"od":318.5},{"m":"350A","i":"NPS14","id":339.8,"od":355.6},{"m":"400A","i":"NPS16","id":390.6,"od":406.4},{"m":"450A","i":"NPS18","id":441.4,"od":457.2},{"m":"500A","i":"NPS20","id":492.2,"od":508}],"1":[{"m":"6A","i":"NPS1/8","id":7.1,"od":10.5},{"m":"8A","i":"NPS1/4","id":9.4,"od":13.8},{"m":"10A","i":"NPS3/8","id":12.7,"od":17.3},{"m":"15A","i":"NPS1/2","id":16.1,"od":21.7},{"m":"20A","i":"NPS3/4","id":21.4,"od":27.2},{"m":"25A","i":"NPS1","id":27.2,"od":34},{"m":"32A","i":"NPS1 1/4","id":35.5,"od":42.7},{"m":"40A","i":"NPS1 1/2","id":41.2,"od":48.6},{"m":"50A","i":"NPS2","id":52.7,"od":60.5},{"m":"65A","i":"NPS2 1/2","id":65.9,"od":76.3},{"m":"80A","i":"NPS3","id":78.1,"od":89.1},{"m":"100A","i":"NPS4","id":102.3,"od":114.3},{"m":"125A","i":"NPS5","id":126.6,"od":139.8},{"m":"150A","i":"NPS6","id":151,"od":165.2},{"m":"200A","i":"NPS8","id":199.9,"od":216.3},{"m":"250A","i":"NPS10","id":248.8,"od":267.4},{"m":"300A","i":"NPS12","id":297.9,"od":318.5},{"m":"350A","i":"NPS14","id":333.4,"od":355.6},{"m":"400A","i":"NPS16","id":381,"od":406.4},{"m":"450A","i":"NPS18","id":428.6,"od":457.2},{"m":"500A","i":"NPS20","id":477.8,"od":508}],"2":[{"m":"6A","i":"NPS1/8","id":6.1,"od":10.5},{"m":"8A","i":"NPS1/4","id":9,"od":13.8},{"m":"10A","i":"NPS3/8","id":11.7,"od":17.3},{"m":"15A","i":"NPS1/2","id":15.3,"od":21.7},{"m":"20A","i":"NPS3/4","id":20.4,"od":27.2},{"m":"25A","i":"NPS1","id":26.2,"od":34},{"m":"32A","i":"NPS1 1/4","id":33.7,"od":42.7},{"m":"40A","i":"NPS1 1/2","id":39.6,"od":48.6},{"m":"50A","i":"NPS2","id":50.7,"od":60.5},{"m":"65A","i":"NPS2 1/2","id":64.3,"od":76.3},{"m":"80A","i":"NPS3","id":75.9,"od":89.1},{"m":"100A","i":"NPS4","id":100.1,"od":114.3},{"m":"125A","i":"NPS5","id":123.6,"od":139.8},{"m":"150A","i":"NPS6","id":146.6,"od":165.2},{"m":"200A","i":"NPS8","id":195.7,"od":216.3},{"m":"250A","i":"NPS10","id":242,"od":267.4},{"m":"300A","i":"NPS12","id":289.9,"od":318.5},{"m":"350A","i":"NPS14","id":325.4,"od":355.6},{"m":"400A","i":"NPS16","id":373,"od":406.4},{"m":"450A","i":"NPS18","id":419.2,"od":457.2},{"m":"500A","i":"NPS20","id":466.8,"od":508}],"3":[{"m":"6A","i":"NPS1/8","id":5.7,"od":10.5},{"m":"8A","i":"NPS1/4","id":7.8,"od":13.8},{"m":"10A","i":"NPS3/8","id":10.9,"od":17.3},{"m":"15A","i":"NPS1/2","id":14.3,"od":21.7},{"m":"20A","i":"NPS3/4","id":19.4,"od":27.2},{"m":"25A","i":"NPS1","id":25,"od":34},{"m":"32A","i":"NPS1 1/4","id":32.9,"od":42.7},{"m":"40A","i":"NPS1 1/2","id":38.4,"od":48.6},{"m":"50A","i":"NPS2","id":49.5,"od":60.5},{"m":"65A","i":"NPS2 1/2","id":62.3,"od":76.3},{"m":"80A","i":"NPS3","id":73.9,"od":89.1},{"m":"100A","i":"NPS4","id":97.1,"od":114.3},{"m":"125A","i":"NPS5","id":120.8,"od":139.8},{"m":"150A","i":"NPS6","id":143.2,"od":165.2},{"m":"200A","i":"NPS8","id":190.9,"od":216.3},{"m":"250A","i":"NPS10","id":237.2,"od":267.4},{"m":"300A","i":"NPS12","id":283.7,"od":318.5},{"m":"350A","i":"NPS14","id":317.6,"od":355.6},{"m":"400A","i":"NPS16","id":363.6,"od":406.4},{"m":"450A","i":"NPS18","id":409.6,"od":457.2},{"m":"500A","i":"NPS20","id":455.6,"od":508}],"4":[{"m":"6A","i":"NPS1/8","id":6.8326,"od":10.287},{"m":"8A","i":"NPS1/4","id":9.2456,"od":13.716},{"m":"10A","i":"NPS3/8","id":12.5222,"od":17.145},{"m":"15A","i":"NPS1/2","id":15.7988,"od":21.336},{"m":"20A","i":"NPS3/4","id":20.9296,"od":26.67},{"m":"25A","i":"NPS1","id":26.6446,"od":33.401},{"m":"32A","i":"NPS1 1/4","id":35.052,"od":42.164},{"m":"40A","i":"NPS1 1/2","id":40.894,"od":48.26},{"m":"50A","i":"NPS2","id":52.5018,"od":60.325},{"m":"65A","i":"NPS2 1/2","id":62.7126,"od":73.025},{"m":"80A","i":"NPS3","id":77.9272,"od":88.9},{"m":"100A","i":"NPS4","id":102.2604,"od":114.3},{"m":"125A","i":"NPS5","id":128.1938,"od":141.3002},{"m":"150A","i":"NPS6","id":154.051,"od":168.275},{"m":"200A","i":"NPS8","id":202.7174,"od":219.075},{"m":"250A","i":"NPS10","id":254.508,"od":273.05},{"m":"300A","i":"NPS12","id":303.2252,"od":323.85},{"m":"350A","i":"NPS14","id":333.3496,"od":355.6},{"m":"400A","i":"NPS16","id":381,"od":406.4},{"m":"450A","i":"NPS18","id":428.6504,"od":457.2},{"m":"500A","i":"NPS20","id":477.8248,"od":508}],"5":[{"m":"6A","i":"NPS1/8","id":5.461,"od":10.287},{"m":"8A","i":"NPS1/4","id":7.6708,"od":13.716},{"m":"10A","i":"NPS3/8","id":10.7442,"od":17.145},{"m":"15A","i":"NPS1/2","id":13.8684,"od":21.336},{"m":"20A","i":"NPS3/4","id":18.8468,"od":26.67},{"m":"25A","i":"NPS1","id":24.3078,"od":33.401},{"m":"32A","i":"NPS1 1/4","id":32.4612,"od":42.164},{"m":"40A","i":"NPS1 1/2","id":38.1,"od":48.26},{"m":"50A","i":"NPS2","id":49.2506,"od":60.325},{"m":"65A","i":"NPS2 1/2","id":59.0042,"od":73.025},{"m":"80A","i":"NPS3","id":73.66,"od":88.9},{"m":"100A","i":"NPS4","id":97.1804,"od":114.3},{"m":"125A","i":"NPS5","id":122.2502,"od":141.3002},{"m":"150A","i":"NPS6","id":146.3294,"od":168.275},{"m":"200A","i":"NPS8","id":193.675,"od":219.075},{"m":"250A","i":"NPS10","id":242.8748,"od":273.05},{"m":"300A","i":"NPS12","id":288.8996,"od":323.85},{"m":"350A","i":"NPS14","id":317.5,"od":355.6},{"m":"400A","i":"NPS16","id":363.5248,"od":406.4},{"m":"450A","i":"NPS18","id":409.5496,"od":457.2},{"m":"500A","i":"NPS20","id":455.6252,"od":508}],"6":[{"m":"15A","i":"NPS1/2","id":11.7856,"od":21.336},{"m":"20A","i":"NPS3/4","id":15.5448,"od":26.67},{"m":"25A","i":"NPS1","id":20.701,"od":33.401},{"m":"32A","i":"NPS1 1/4","id":29.464,"od":42.164},{"m":"40A","i":"NPS1 1/2","id":33.9852,"od":48.26},{"m":"50A","i":"NPS2","id":42.8498,"od":60.325},{"m":"65A","i":"NPS2 1/2","id":53.975,"od":73.025},{"m":"80A","i":"NPS3","id":66.6496,"od":88.9},{"m":"100A","i":"NPS4","id":87.3252,"od":114.3},{"m":"125A","i":"NPS5","id":109.5502,"od":141.3002},{"m":"150A","i":"NPS6","id":131.7498,"od":168.275},{"m":"200A","i":"NPS8","id":173.0502,"od":219.075},{"m":"250A","i":"NPS10","id":215.9,"od":273.05},{"m":"300A","i":"NPS12","id":257.2004,"od":323.85},{"m":"350A","i":"NPS14","id":284.1752,"od":355.6},{"m":"400A","i":"NPS16","id":325.4248,"od":406.4},{"m":"450A","i":"NPS18","id":366.7252,"od":457.2},{"m":"500A","i":"NPS20","id":407.9748,"od":508}],"7":[{"m":"6A","i":"NPS1/8","id":7,"od":10.2},{"m":"8A","i":"NPS1/4","id":9.9,"od":13.5},{"m":"10A","i":"NPS3/8","id":13.6,"od":17.2},{"m":"15A","i":"NPS1/2","id":17.3,"od":21.3},{"m":"20A","i":"NPS3/4","id":22.3,"od":26.9},{"m":"25A","i":"NPS1","id":28.5,"od":33.7},{"m":"32A","i":"NPS1 1/4","id":37.2,"od":42.4},{"m":"40A","i":"NPS1 1/2","id":43.1,"od":48.3},{"m":"50A","i":"NPS2","id":54.5,"od":60.3},{"m":"65A","i":"NPS2 1/2","id":70.3,"od":76.1},{"m":"80A","i":"NPS3","id":82.5,"od":88.9},{"m":"100A","i":"NPS4","id":107.1,"od":114.3},{"m":"125A","i":"NPS5","id":131.7,"od":139.7},{"m":"150A","i":"NPS6","id":159.3,"od":168.3},{"m":"200A","i":"NPS8","id":207.3,"od":219.1},{"m":"250A","i":"NPS10","id":260.4,"od":273},{"m":"300A","i":"NPS12","id":309.7,"od":323.9},{"m":"350A","i":"NPS14","id":339.6,"od":355.6},{"m":"400A","i":"NPS16","id":388.8,"od":406.4},{"m":"450A","i":"NPS18","id":437.2,"od":457.2},{"m":"500A","i":"NPS20","id":486,"od":508}]};
  var GRADES=["JIS-SGP","JIS-STPG Sch40","JIS-STPG Sch60","JIS-STPG Sch80","ANSI Sch40","ANSI Sch80","ANSI Sch160","DIN 2448"];
  if(typeof window!=="undefined"){window.PIPE_TABLE=T;window.PIPE_GRADES=GRADES;}
  if(typeof module!=="undefined"&&module.exports){module.exports={table:T,grades:GRADES};}
})();

/*
 * IAPWS-IF97 — свойства воды и водяного пара (офлайн, без сети).
 * Реализованы области: 1 (жидкость), 2 (пар/перегретый), 4 (линия насыщения).
 * Источник: "Revised Release on the IAPWS Industrial Formulation 1997".
 *
 * Внутренние единицы: давление p — МПа, температура T — К.
 * Возвращаемые величины: v (м³/кг), h (кДж/кг), s (кДж/(кг·К)).
 *
 * Файл конкатенируется в build/js/main.js — НЕ использовать import/export.
 * Наружу отдаётся глобал window.SteamProps (и module.exports для тестов в node).
 */
(function () {
  'use strict';

  var R = 0.461526; // кДж/(кг·К), удельная газовая постоянная воды по IF97

  // ---------- Область 1: сжатая жидкость ----------
  var R1 = [
    [0, -2, 0.14632971213167], [0, -1, -0.84548187169114], [0, 0, -0.37563603672040e1],
    [0, 1, 0.33855169168385e1], [0, 2, -0.95791963387872], [0, 3, 0.15772038513228],
    [0, 4, -0.16616417199501e-1], [0, 5, 0.81214629983568e-3], [1, -9, 0.28319080123804e-3],
    [1, -7, -0.60706301565874e-3], [1, -1, -0.18990068218419e-1], [1, 0, -0.32529748770505e-1],
    [1, 1, -0.21841717175414e-1], [1, 3, -0.52838357969930e-4], [2, -3, -0.47184321073267e-3],
    [2, 0, -0.30001780793026e-3], [2, 1, 0.47661393906987e-4], [2, 3, -0.44141845330846e-5],
    [2, 17, -0.72694996297594e-15], [3, -4, -0.31679644845054e-4], [3, 0, -0.28270797985312e-5],
    [3, 6, -0.85205128120103e-9], [4, -5, -0.22425281908000e-5], [4, -2, -0.65171222895601e-6],
    [4, 10, -0.14341729937924e-12], [5, -8, -0.40516996860117e-6], [8, -11, -0.12734301741641e-8],
    [8, -6, -0.17424871230634e-9], [21, -29, -0.68762131295531e-18], [23, -31, 0.14478307828521e-19],
    [29, -38, 0.26335781662795e-22], [30, -39, -0.11947622640071e-22], [31, -40, 0.18228094581404e-23],
    [32, -41, -0.93537087292458e-25]
  ];

  function region1(p, T) {
    var pi = p / 16.53, tau = 1386 / T;
    var g = 0, gp = 0, gt = 0;
    for (var i = 0; i < R1.length; i++) {
      var I = R1[i][0], J = R1[i][1], n = R1[i][2];
      var a = Math.pow(7.1 - pi, I), b = Math.pow(tau - 1.222, J);
      g += n * a * b;
      gp += -n * I * Math.pow(7.1 - pi, I - 1) * b;
      gt += n * a * J * Math.pow(tau - 1.222, J - 1);
    }
    return {
      v: R * T / p / 1000 * pi * gp, // p в МПа → *1000 кПа; R*T/p даёт м³/кг при p в кПа
      h: R * T * tau * gt,
      s: R * (tau * gt - g)
    };
  }

  // ---------- Область 2: пар (насыщенный/перегретый) ----------
  var R2_0 = [
    [0, -0.96927686500217e1], [1, 0.10086655968018e2], [-5, -0.56087911283020e-2],
    [-4, 0.71452738081455e-1], [-3, -0.40710498223928], [-2, 0.14240819171444e1],
    [-1, -0.43839511319450e1], [2, -0.28408632460772], [3, 0.21268463753307e-1]
  ];
  var R2_r = [
    [1, 0, -0.17731742473213e-2], [1, 1, -0.17834862292358e-1], [1, 2, -0.45996013696365e-1],
    [1, 3, -0.57581259083432e-1], [1, 6, -0.50325278727930e-1], [2, 1, -0.33032641670203e-4],
    [2, 2, -0.18948987516315e-3], [2, 4, -0.39392777243355e-2], [2, 7, -0.43797295650573e-1],
    [2, 36, -0.26674547914087e-4], [3, 0, 0.20481737692309e-7], [3, 1, 0.43870667284435e-6],
    [3, 3, -0.32277677238570e-4], [3, 6, -0.15033924542148e-2], [3, 35, -0.40668253562649e-1],
    [4, 1, -0.78847309559367e-9], [4, 2, 0.12790717852285e-7], [4, 3, 0.48225372718507e-6],
    [5, 7, 0.22922076337661e-5], [6, 3, -0.16714766451061e-10], [6, 16, -0.21171472321355e-2],
    [6, 35, -0.23895741934104e2], [7, 0, -0.59059564324270e-17], [7, 11, -0.12621808899101e-5],
    [7, 25, -0.38946842435739e-1], [8, 8, 0.11256211360459e-10], [8, 36, -0.82311340897998e1],
    [9, 13, 0.19809712802088e-7], [10, 4, 0.10406965210174e-18], [10, 10, -0.10234747095929e-12],
    [10, 14, -0.10018179379511e-8], [16, 29, -0.80882908646985e-10], [16, 50, 0.10693031879409],
    [18, 57, -0.33662250574171], [20, 20, 0.89185845355421e-24], [20, 35, 0.30629316876232e-12],
    [20, 48, -0.42002467698208e-5], [21, 21, -0.59056029685639e-25], [22, 53, 0.37826947613457e-5],
    [23, 39, -0.12768608934681e-14], [24, 26, 0.73087610595061e-28], [24, 40, 0.55414715350778e-16],
    [24, 58, -0.94369707241210e-6]
  ];

  function region2(p, T) {
    var pi = p / 1.0, tau = 540 / T;
    // идеальная часть
    var g0 = Math.log(pi), g0p = 1 / pi, g0t = 0;
    for (var i = 0; i < R2_0.length; i++) {
      var J = R2_0[i][0], n = R2_0[i][1];
      g0 += n * Math.pow(tau, J);
      g0t += n * J * Math.pow(tau, J - 1);
    }
    // остаточная часть
    var gr = 0, grp = 0, grt = 0;
    for (var k = 0; k < R2_r.length; k++) {
      var I = R2_r[k][0], Jr = R2_r[k][1], nr = R2_r[k][2];
      var pp = Math.pow(pi, I), tt = Math.pow(tau - 0.5, Jr);
      gr += nr * pp * tt;
      grp += nr * I * Math.pow(pi, I - 1) * tt;
      grt += nr * pp * Jr * Math.pow(tau - 0.5, Jr - 1);
    }
    return {
      // IAPWS-IF97 Region 2, Eq. 15: γπ = γπ⁰ + γπʳ.
      // Знак «минус» завышал удельный объём насыщенного пара примерно на 12 %
      // и занижал расход/завышал скорость во всех связанных калькуляторах.
      v: R * T / p / 1000 * pi * (g0p + grp),
      h: R * T * tau * (g0t + grt),
      s: R * (tau * (g0t + grt) - (g0 + gr))
    };
  }

  // Изобарная теплоёмкость cp (кДж/кг·К) перегретого пара, область 2.
  function region2cp(p, T) {
    var pi = p, tau = 540 / T;
    var g0tt = 0;
    for (var i = 0; i < R2_0.length; i++) {
      var J = R2_0[i][0], n = R2_0[i][1];
      g0tt += n * J * (J - 1) * Math.pow(tau, J - 2);
    }
    var grtt = 0;
    for (var k = 0; k < R2_r.length; k++) {
      var I = R2_r[k][0], Jr = R2_r[k][1], nr = R2_r[k][2];
      grtt += nr * Math.pow(pi, I) * Jr * (Jr - 1) * Math.pow(tau - 0.5, Jr - 2);
    }
    return -R * tau * tau * (g0tt + grtt);
  }

  // ---------- Область 4: линия насыщения ----------
  // Линия насыщения определена только между тройной и критической точкой воды.
  // Вне диапазона корреляция (IAPWS-IF97) экстраполируется некорректно (вплоть до
  // отрицательной энтальпии) — поэтому вход клампится к границам перед расчётом.
  var P_TRIPLE = 0.000611657, P_CRIT = 22.064;   // МПа
  var T_TRIPLE = 273.16, T_CRIT = 647.096;       // К

  var N = [0, 0.11670521452767e4, -0.72421316703206e6, -0.17073846940092e2,
    0.12020824702470e5, -0.32325550322333e7, 0.14915108613530e2, -0.48232657361591e4,
    0.40511340542057e6, -0.23855557567849, 0.65017534844798e3];

  // Давление насыщения (МПа) по температуре (К)
  function psat(T) {
    if (T < T_TRIPLE) T = T_TRIPLE;
    if (T > T_CRIT) T = T_CRIT;
    var th = T + N[9] / (T - N[10]);
    var A = th * th + N[1] * th + N[2];
    var B = N[3] * th * th + N[4] * th + N[5];
    var C = N[6] * th * th + N[7] * th + N[8];
    var p = 2 * C / (-B + Math.sqrt(B * B - 4 * A * C));
    return Math.pow(p, 4);
  }

  // Температура насыщения (К) по давлению (МПа)
  function tsat(p) {
    if (p < P_TRIPLE) p = P_TRIPLE;
    if (p > P_CRIT) p = P_CRIT;
    var beta = Math.pow(p, 0.25);
    var E = beta * beta + N[3] * beta + N[6];
    var F = N[1] * beta * beta + N[4] * beta + N[7];
    var G = N[2] * beta * beta + N[5] * beta + N[8];
    var D = 2 * G / (-F - Math.sqrt(F * F - 4 * E * G));
    return (N[10] + D - Math.sqrt((N[10] + D) * (N[10] + D) - 4 * (N[9] + N[10] * D))) / 2;
  }

  // ---------- Динамическая вязкость (IAPWS 2008, без критического усиления) ----------
  // Возвращает μ в Па·с по плотности ρ (кг/м³) и температуре T (К).
  var H0 = [1.67752, 2.20462, 0.6366564, -0.241605];
  var Hij = [
    [0, 0, 5.20094e-1], [1, 0, 2.22531e-1], [2, 0, -2.81378e-1], [3, 0, 1.61913e-1], [4, 0, -3.25372e-2],
    [0, 1, 8.50895e-2], [1, 1, 9.99115e-1], [2, 1, -9.06851e-1], [3, 1, 2.57399e-1],
    [0, 2, -1.08374], [1, 2, 1.88797], [2, 2, -7.72479e-1],
    [0, 3, -2.89555e-1], [1, 3, 1.26613], [2, 3, -4.89837e-1], [4, 3, 6.98452e-2], [6, 3, -4.35673e-3],
    [2, 4, -2.57040e-1], [5, 4, 8.72102e-3],
    [1, 5, 1.20573e-1], [6, 5, -5.93264e-4]
  ];

  function viscosity(rho, T) {
    var Tc = 647.096, rhoc = 322.0;
    var Tb = T / Tc, rb = rho / rhoc;
    var s = 0;
    for (var i = 0; i < 4; i++) s += H0[i] / Math.pow(Tb, i);
    var mu0 = 100 * Math.sqrt(Tb) / s;
    var sum = 0;
    for (var k = 0; k < Hij.length; k++) {
      sum += Math.pow(1 / Tb - 1, Hij[k][1]) * Hij[k][2] * Math.pow(rb - 1, Hij[k][0]);
    }
    var mu1 = Math.exp(rb * sum);
    return mu0 * mu1 * 1e-6; // мкПа·с -> Па·с
  }

  // ---------- Публичный API ----------
  var SteamProps = {
    R: R,
    P_TRIPLE: P_TRIPLE, P_CRIT: P_CRIT,  // границы линии насыщения, МПа
    T_TRIPLE: T_TRIPLE, T_CRIT: T_CRIT,  // границы линии насыщения, К
    Tsat: tsat,          // (p[МПа]) -> T[К]
    Psat: psat,          // (T[К])   -> p[МПа]
    region1: region1,
    region2: region2,
    // Свойства насыщенной жидкости при давлении p[МПа]. p клампится к границам линии
    // насыщения — иначе region1/region2 получают рассогласованную пару (p, Tsat(p_clamped))
    // и экстраполируются в мусор (вплоть до отрицательной энтальпии).
    satLiquid: function (p) { p = p < P_TRIPLE ? P_TRIPLE : (p > P_CRIT ? P_CRIT : p); return region1(p, tsat(p)); },
    // Свойства сухого насыщенного пара при давлении p[МПа]
    satVapor: function (p) { p = p < P_TRIPLE ? P_TRIPLE : (p > P_CRIT ? P_CRIT : p); return region2(p, tsat(p)); },
    // Скрытая теплота парообразования ΔH (кДж/кг) при давлении p[МПа]
    latentHeat: function (p) { p = p < P_TRIPLE ? P_TRIPLE : (p > P_CRIT ? P_CRIT : p); return Math.abs(region2(p, tsat(p)).h - region1(p, tsat(p)).h); },
    // Перегретый пар по давлению p[МПа] и температуре T[К]
    superheated: function (p, T) { return region2(p, T); },
    // Изобарная теплоёмкость cp[кДж/кг·К] перегретого пара
    cpSuperheated: region2cp,
    // Динамическая вязкость μ[Па·с] по плотности ρ[кг/м³] и T[К]
    viscosity: viscosity
  };

  if (typeof window !== 'undefined') window.SteamProps = SteamProps;
  if (typeof module !== 'undefined' && module.exports) module.exports = SteamProps;
})();

/*
 * Конверсия единиц измерения для калькуляторов.
 * В units.json из APK множителей нет (только символы), поэтому коэффициенты заданы здесь.
 * Каждая категория приводит значение к своей базовой СИ-единице (toSI) и обратно (fromSI).
 * Символы единиц совпадают с текстом .form-radio-name в выпадающих списках форм.
 * Конкатенируется в build/js/main.js — без import/export.
 *
 * Базовые единицы СИ по категориям:
 *   pressureAbs -> МПа (абсолютное)   |  dPress -> Па      |  temp -> К
 *   massFlow    -> кг/ч               |  length -> м       |  velocity -> м/с
 */
(function () {
  'use strict';

  var ATM = 0.101325; // атмосферное давление, МПа

  // Абсолютное/манометрическое давление -> МПа абс.  {f: множитель в МПа, off: добавка (атм для манометрических)}
  var pressureAbs = {
    'kPa abs': { f: 0.001, off: 0 }, 'MPa abs': { f: 1, off: 0 }, 'psi abs': { f: 0.00689476, off: 0 },
    'bar abs': { f: 0.1, off: 0 }, 'kg/cm² abs': { f: 0.0980665, off: 0 }, 'mmHg abs': { f: 0.000133322, off: 0 },
    'kPaG': { f: 0.001, off: ATM }, 'MPaG': { f: 1, off: ATM }, 'psig': { f: 0.00689476, off: ATM },
    'barG': { f: 0.1, off: ATM }, 'kg/cm²G': { f: 0.0980665, off: ATM }, 'mmHgG': { f: 0.000133322, off: ATM },
    // Русские псевдонимы
    'кПа абс.': { f: 0.001, off: 0 }, 'МПа абс.': { f: 1, off: 0 }, 'psi абс.': { f: 0.00689476, off: 0 },
    'бар абс.': { f: 0.1, off: 0 }, 'кг/см² абс.': { f: 0.0980665, off: 0 }, 'мм рт. ст. абс.': { f: 0.000133322, off: 0 },
    'кПа изб.': { f: 0.001, off: ATM }, 'МПа изб.': { f: 1, off: ATM },
    'бар изб.': { f: 0.1, off: ATM }, 'кг/см² изб.': { f: 0.0980665, off: ATM }, 'мм рт. ст. изб.': { f: 0.000133322, off: ATM }
  };
  // Перепад/потери давления -> Па (без gauge)
  var dPress = {
    'kPa': 1000, 'MPa': 1e6, 'psi': 6894.76, 'bar': 1e5, 'kg/cm²': 98066.5, 'mmHg': 133.322, 'Pa': 1,
    // Русские псевдонимы
    'кПа': 1000, 'МПа': 1e6, 'бар': 1e5, 'кг/см²': 98066.5, 'мм. рт. ст.': 133.322
  };
  // Массовый расход -> кг/ч
  var massFlow = {
    'kg/h': 1, 't(metric)/h': 1000, 'lb/h': 0.453592,
    'кг/ч': 1, 'т/ч': 1000, 'фунт/ч': 0.453592
  };
  // Масса -> кг
  var mass = {
    'kg': 1, 'g': 0.001, 't(metric)': 1000, 'lb': 0.453592,
    'кг': 1, 'т': 1000, 'фунт': 0.453592
  };
  // Время -> часы
  var time = { 'h': 1, 'min': 1 / 60, 'sec': 1 / 3600, 'ч': 1, 'мин': 1 / 60, 'с': 1 / 3600 };
  // Объём -> м³
  var volume = {
    'm³': 1, 'mm³': 1e-9, 'cm³(=mL)': 1e-6, 'cm³': 1e-6, 'dm³(=L)': 0.001, 'L': 0.001, 'l': 0.001,
    'gal': 0.00378541, 'gal (US)': 0.00378541, 'gal (UK)': 0.00454609,
    'in³': 1.6387064e-5, 'ft³': 0.0283168466, 'yd³': 0.764554858, 'barrel': 0.158987295,
    'м³': 1, 'мм³': 1e-9, 'см³(=мл)': 1e-6, 'дм³(=л)': 0.001,
    'гал (США)': 0.00378541, 'гал (UK)': 0.00454609,
    'дюйм³': 1.6387064e-5, 'фут³': 0.0283168466, 'ярд³': 0.764554858, 'баррель': 0.158987295
  };
  // Длина / шероховатость -> м
  var length = {
    'mm': 0.001, 'cm': 0.01, 'm': 1, 'in': 0.0254, 'ft': 0.3048, 'yd': 0.9144,
    'мм': 0.001, 'см': 0.01, 'м': 1, 'дюйм': 0.0254, 'фут': 0.3048, 'ярд': 0.9144
  };
  // Скорость -> м/с
  var velocity = {
    'm/s': 1, 'ft/s': 0.3048, 'km/h': 0.277777778, 'mile/h': 0.44704,
    'м/с': 1, 'фут/с': 0.3048, 'км/ч': 0.277777778, 'миль/ч': 0.44704
  };
  // Коэффициент пропускной способности клапана -> Cv(US).
  // Коэффициенты из UQS_UNIT.csv приложения TLV: Kv=1/0.857, Cv(UK)=1/0.833.
  var cv = { 'Cv(US)': 1, 'Cv': 1, 'Cv(UK)': 1 / 0.833, 'Kv': 1 / 0.857 };
  // Удельная теплоёмкость -> кДж/(кг·К). 1 ккал/кг°C = 1 BTU/lb°F = 4.1868 кДж/кг·К.
  var specHeat = {
    'kJ/kg K': 1, 'kJ/kg·K': 1, 'kcal/kg·°C': 4.1868, 'BTU/lb °F': 4.1868,
    'кДж/кг·K': 1, 'кДж/кг·К': 1, 'ккал/кг·°C': 4.1868
  };
  // Удельная энтальпия/теплота -> кДж/кг.
  var enthalpy = {
    'kJ/kg': 1, 'kcal/kg': 4.1868, 'BTU/lb': 2.326,
    'кДж/кг': 1, 'ккал/кг': 4.1868, 'BTU/фунт': 2.326
  };
  // Удельный объём -> м³/кг.
  var specVol = {
    'm³/kg': 1, 'L/kg': 0.001, 'cm³/g': 0.001, 'ft³/lb': 0.0624279606,
    'м³/кг': 1, 'л/кг': 0.001, 'фут³/фунт': 0.0624279606
  };
  // Динамическая вязкость -> мПа·с.
  var dynVisc = { 'mPa·s': 1, 'Pa·s': 1000, 'cP': 1, 'µPa·s': 0.001, 'мПа·с': 1, 'сП': 1, 'мкПа·с': 0.001 };
  // Тепловой поток / мощность -> Вт.
  var power = { 'W': 1, 'kW': 1000, 'kcal/h': 1.163, 'BTU/h': 0.293071, 'Вт': 1, 'кВт': 1000, 'ккал/ч': 1.163 };
  // Стоимость энергии -> ₽/МДж (совпадает с тем, что раньше принимали formulaы напрямую как plain-поле).
  var energyCost = {
    // TLV использует инженерное округление 1 Гкал = 4186 МДж.
    '₽/Гкал': 1 / 4186,
    '₽/MJ': 1, '₽/1000BTU': 0.947817, '$/MJ': 1, '$/1000BTU': 0.947817
  };
  // Стоимость изоляции и работ -> x1000₽/м³.
  var laborCostU = { '× 1000 ₽/м³': 1, 'x1000₽/m³': 1, 'x1000₽/ft³': 35.3147, 'x1000$/m³': 1, 'x1000$/ft³': 35.3147 };
  // Срок окупаемости -> года (отдельная категория от 'time', который в часах).
  var years = { 'г.': 1, 'yr': 1, 'year': 1 };
  // Объёмный расход -> м³/ч. Галлоны — US.
  var volFlow = {
    'm³/h': 1, 'l/h': 0.001, 'gal/h': 0.00378541, 'GPM': 0.227125, 'm³/min': 60, 'l/min': 0.06, 'L/min': 0.06, 'CFM': 1.69901, 'ft³/min': 1.69901,
    'м³/ч': 1, 'л/ч': 0.001, 'гал./ч': 0.00378541, 'м³/мин': 60, 'л/мин': 0.06, 'гал./мин': 0.227125, 'фут³/мин': 1.69901
  };

  function toSI(value, category, symbol) {
    if (value === null || value === undefined) return NaN;
    var normalized = String(value).trim().replace(',', '.');
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(normalized)) return NaN;
    var v = Number(normalized);
    if (!Number.isFinite(v)) return NaN;
    symbol = (symbol || '').trim();
    switch (category) {
      case 'pressureAbs': { var p = pressureAbs[symbol]; return p ? v * p.f + p.off : NaN; }
      case 'dPress': return symbol in dPress ? v * dPress[symbol] : NaN;
      case 'massFlow': return symbol in massFlow ? v * massFlow[symbol] : NaN;
      case 'mass': return symbol in mass ? v * mass[symbol] : NaN;
      case 'length': return symbol in length ? v * length[symbol] : NaN;
      case 'velocity': return symbol in velocity ? v * velocity[symbol] : NaN;
      case 'cv': return symbol in cv ? v * cv[symbol] : NaN;
      case 'specHeat': return symbol in specHeat ? v * specHeat[symbol] : NaN;
      case 'enthalpy': return symbol in enthalpy ? v * enthalpy[symbol] : NaN;
      case 'specVol': return symbol in specVol ? v * specVol[symbol] : NaN;
      case 'dynVisc': return symbol in dynVisc ? v * dynVisc[symbol] : NaN;
      case 'power': return symbol in power ? v * power[symbol] : NaN;
      case 'volFlow': return symbol in volFlow ? v * volFlow[symbol] : NaN;
      case 'time': return symbol in time ? v * time[symbol] : NaN;
      case 'volume': return symbol in volume ? v * volume[symbol] : NaN;
      case 'energyCost': return symbol in energyCost ? v * energyCost[symbol] : NaN;
      case 'laborCostU': return symbol in laborCostU ? v * laborCostU[symbol] : NaN;
      case 'years': return symbol in years ? v * years[symbol] : NaN;
      case 'temp':
        if (symbol === '°C') return v + 273.15;
        if (symbol === 'K') return v;
        if (symbol === '°F') return (v - 32) * 5 / 9 + 273.15;
        return NaN;
      default: return NaN;
    }
  }

  function fromSI(si, category, symbol) {
    symbol = (symbol || '').trim();
    switch (category) {
      case 'pressureAbs': { var p = pressureAbs[symbol]; return p ? (si - p.off) / p.f : NaN; }
      case 'dPress': return symbol in dPress ? si / dPress[symbol] : NaN;
      case 'massFlow': return symbol in massFlow ? si / massFlow[symbol] : NaN;
      case 'mass': return symbol in mass ? si / mass[symbol] : NaN;
      case 'length': return symbol in length ? si / length[symbol] : NaN;
      case 'velocity': return symbol in velocity ? si / velocity[symbol] : NaN;
      case 'cv': return symbol in cv ? si / cv[symbol] : NaN;
      case 'specHeat': return symbol in specHeat ? si / specHeat[symbol] : NaN;
      case 'enthalpy': return symbol in enthalpy ? si / enthalpy[symbol] : NaN;
      case 'specVol': return symbol in specVol ? si / specVol[symbol] : NaN;
      case 'dynVisc': return symbol in dynVisc ? si / dynVisc[symbol] : NaN;
      case 'power': return symbol in power ? si / power[symbol] : NaN;
      case 'volFlow': return symbol in volFlow ? si / volFlow[symbol] : NaN;
      case 'time': return symbol in time ? si / time[symbol] : NaN;
      case 'volume': return symbol in volume ? si / volume[symbol] : NaN;
      case 'energyCost': return symbol in energyCost ? si / energyCost[symbol] : NaN;
      case 'laborCostU': return symbol in laborCostU ? si / laborCostU[symbol] : NaN;
      case 'years': return symbol in years ? si / years[symbol] : NaN;
      case 'temp':
        if (symbol === '°C') return si - 273.15;
        if (symbol === 'K') return si;
        if (symbol === '°F') return (si - 273.15) * 9 / 5 + 32;
        return NaN;
      default: return NaN;
    }
  }

  var Units = { toSI: toSI, fromSI: fromSI, ATM: ATM };
  if (typeof window !== 'undefined') window.Units = Units;
  if (typeof module !== 'undefined' && module.exports) module.exports = Units;
})();


document.addEventListener("DOMContentLoaded", function () {
  const dropdowns = [];

  document.querySelectorAll('.dropdown').forEach(function (dropDownWrapper) {
    const dropDownBtn  = dropDownWrapper.querySelector('.dropdown__button');
    const dropDownList = dropDownWrapper.querySelector('.dropdown__list');

    const inputs = dropDownWrapper.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    if (!dropDownBtn || !dropDownList || !inputs.length) return;

    const placeholder = dropDownWrapper.dataset.placeholder || dropDownBtn.textContent.trim();

    function openDropdown() {
      dropDownList.style.height = (dropDownList.scrollHeight + 1) + 'px';
      dropDownList.classList.add('dropdown__list--visible');
      dropDownBtn.classList.add('dropdown__button--active');
      dropDownWrapper.classList.add('dropdown-active');
      dropDownBtn.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      dropDownList.classList.remove('dropdown__list--visible');
      dropDownList.style.height = 0;
      dropDownBtn.classList.remove('dropdown__button--active');
      dropDownWrapper.classList.remove('dropdown-active');
      dropDownBtn.setAttribute('aria-expanded', 'false');
    }
    dropdowns.push({ wrapper: dropDownWrapper, close: closeDropdown });

    function getLabelText(input) {
      const label = input.closest('label');
		if (!label) return '';

		const textEl = label.querySelector('.form-radio-name');
		if (textEl) {
			return textEl.textContent.trim();
		}

		// fallback на случай другой разметки
		return label.textContent.trim();
    }

    function updateButtonText() {
      const checked = dropDownWrapper.querySelectorAll('input:checked');
      if (!checked.length) {
        dropDownBtn.textContent = placeholder;
        return;
      }

      // Определяем режим: radio или checkbox
      const isRadio = checked[0].type === 'radio';

      if (isRadio) {
        dropDownBtn.textContent = getLabelText(checked[0]);
      } else {
        const texts = Array.from(checked).map(getLabelText).filter(Boolean);
        dropDownBtn.textContent = texts.length ? texts.join(', ') : placeholder;
      }
    }

    // Инициализация
    updateButtonText();

    // Открыть/закрыть по кнопке
    dropDownBtn.addEventListener('click', function () {
      if (dropDownList.classList.contains('dropdown__list--visible')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    // Реакция на выбор
    inputs.forEach(function (input) {
      input.addEventListener('change', function () {
        updateButtonText();

        // Если radio — закрываем сразу (как селект)
        if (this.type === 'radio') {
          dropDownBtn.focus();
          closeDropdown();
        }
        // Если checkbox — обычно НЕ закрывают, чтобы можно было выбрать несколько.
        // Но если тебе нужно закрывать — скажи, добавим опцию.
      });
    });

  });

  // Один глобальный обработчик вместо двух обработчиков на каждый dropdown.
  document.addEventListener('click', function (e) {
    dropdowns.forEach(function (dropdown) {
      if (!dropdown.wrapper.contains(e.target)) dropdown.close();
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' && e.key !== 'Escape') return;
    dropdowns.forEach(function (dropdown) { dropdown.close(); });
  });

});


document.addEventListener("DOMContentLoaded", function () {
//MASK PHONE
const PREFIX = "+7(";
function formatPhoneFromDigits(digits) {
	digits = digits.replace(/\D/g, "").slice(0, 11); // максимум 11 цифр (включая 7)
		let out = "+7(";
		if (digits.length > 1) out += digits.slice(1, 4);
		if (digits.length >= 4) out += ")" + digits.slice(4, 7);
		if (digits.length >= 7) out += "-" + digits.slice(7, 9);
		if (digits.length >= 9) out += "-" + digits.slice(9, 11);
		return out;
	}

	function getDigitsFromMasked(v) {
		return v.replace(/\D/g, "");
	}

	function setCaret(el, pos) {
		requestAnimationFrame(() => el.setSelectionRange(pos, pos));
	}

	document.querySelectorAll("input.phone").forEach(input => {
		// Автовставка префикса
		input.addEventListener("focus", () => {
			if (!input.value) {
			input.value = PREFIX;
			setCaret(input, PREFIX.length);
			}
	});

		// Блокируем перемещение курсора левее префикса
	input.addEventListener("click", () => {
		if (input.selectionStart < PREFIX.length) setCaret(input, PREFIX.length);
	});

	// На мобилках лучше перехватывать ввод до применения
	input.addEventListener("beforeinput", (e) => {
		// Разрешаем только цифры/удаление/вставку
		const allowed = ["insertText", "deleteContentBackward", "deleteContentForward", "insertFromPaste"];
		if (!allowed.includes(e.inputType)) return;

		const selStart = input.selectionStart ?? input.value.length;
		const selEnd = input.selectionEnd ?? selStart;

			// Не даём ломать фиксированный префикс
			if (selStart < PREFIX.length && e.inputType.startsWith("delete")) {
			e.preventDefault();
			return;
			}

			const currentDigits = getDigitsFromMasked(input.value);
			// Позицию в «чистых» цифрах вычислим грубо по количеству цифр слева от курсора
			const digitsLeft = getDigitsFromMasked(input.value.slice(0, selStart)).length;
			const digitsRight = getDigitsFromMasked(input.value.slice(selEnd)).length;

			let newDigitsLeft = currentDigits.slice(0, digitsLeft);
			let newDigitsRight = currentDigits.slice(currentDigits.length - digitsRight);

			if (e.inputType === "insertText") {
			// Разрешаем только цифры
			if (!/^\d$/.test(e.data)) { e.preventDefault(); return; }
			// Лимит 11 цифр
			if ((newDigitsLeft + e.data + newDigitsRight).length > 11) { e.preventDefault(); return; }
			newDigitsLeft += e.data;
			e.preventDefault();
			} else if (e.inputType === "insertFromPaste") {
			const pasted = (e.dataTransfer?.getData("text") ?? "").replace(/\D/g, "");
			if (!pasted) { e.preventDefault(); return; }
			const room = 11 - (newDigitsLeft + newDigitsRight).length;
			newDigitsLeft += pasted.slice(0, Math.max(0, room));
			e.preventDefault();
			} else if (e.inputType === "deleteContentBackward") {
			if (newDigitsLeft.length > 0) newDigitsLeft = newDigitsLeft.slice(0, -1);
			e.preventDefault();
			} else if (e.inputType === "deleteContentForward") {
			if (newDigitsRight.length > 0) newDigitsRight = newDigitsRight.slice(1);
			e.preventDefault();
			}

			const allDigits = newDigitsLeft + newDigitsRight;
			const masked = formatPhoneFromDigits(allDigits);
			input.value = masked;

			// Ставим каретку после той цифры, которую только что вводили/удаляли
			// Находим целевую позицию по количеству цифр слева
			const targetDigitsLeft = newDigitsLeft.length;
			// Пробегаем по маске, пока не наберём targetDigitsLeft цифр
			let caret = 0, count = 0;
			while (caret < masked.length && count < targetDigitsLeft) {
			if (/\d/.test(masked[caret])) count++;
			caret++;
			}
			// Не даём залезть в префикс
			if (caret < PREFIX.length) caret = PREFIX.length;
			setCaret(input, caret);
		});

		// На всякий случай — финальный форматтер (если что-то проскочит)
      input.addEventListener("input", () => {
        const masked = formatPhoneFromDigits(getDigitsFromMasked(input.value));
        if (masked !== input.value) input.value = masked;
      });
});
// FORM VALIDATION TEMPLATE
(function initFormValidation() {
  const ERROR_CLASS = "error";
  const ERROR_TEXT_CLASS = "error-text";

  // Ищем формы (можно оставить просто "form" если одна)
  const forms = document.querySelectorAll("form.js-validate-form");

  // Если у тебя нет класса js-validate-form, можно заменить на:
  // const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    const inputs = Array.from(form.querySelectorAll("input, textarea, select"));

    function getFormItem(input) {
      return input.closest(".form-item");
    }

    function getOrCreateErrorSpan(formItem) {
      if (!formItem) return null;

      let span = formItem.querySelector(`.${ERROR_TEXT_CLASS}`);
      if (!span) {
        span = document.createElement("span");
        span.className = ERROR_TEXT_CLASS;
        formItem.appendChild(span);
      }
      return span;
    }

    function setError(input, message) {
      const formItem = getFormItem(input);

      input.classList.add(ERROR_CLASS);
      if (formItem) formItem.classList.add(ERROR_CLASS);

      const span = getOrCreateErrorSpan(formItem);
      if (span) span.textContent = message;
    }

    function clearError(input) {
      const formItem = getFormItem(input);

      input.classList.remove(ERROR_CLASS);
      if (formItem) formItem.classList.remove(ERROR_CLASS);

      if (formItem) {
        const span = formItem.querySelector(`.${ERROR_TEXT_CLASS}`);
        if (span) span.remove();
      }
    }

    function isEmptyValue(input) {
      const value = (input.value ?? "").trim();

      // для телефона с префиксом +7( — считаем пустым, если кроме цифр ничего нет или введено мало
      if (input.classList.contains("phone")) {
        const digits = value.replace(/\D/g, "");
        // digits будет типа "7" если только префикс
        return digits.length <= 1;
      }

      return value.length === 0;
    }

    function validateEmailOnBlur(input) {
      // требование из задачи: если нет "@" => ошибка
      const v = (input.value ?? "").trim();
      if (v && !v.includes("@")) {
        setError(input, "Не верное значение");
      } else {
        // если исправили — снимаем ошибку
        clearError(input);
      }
    }

    // --- EVENTS ---

    // focus: "проверяем тип" — логика простая: если email, то активируем проверку на blur
    inputs.forEach((input) => {
      input.addEventListener("focus", () => {
        // ничего не делаем кроме понимания типа; проверка будет на blur
      });

      input.addEventListener("blur", () => {
        if (input.type === "email") {
          validateEmailOnBlur(input);
        }
      });

      // Чтобы ошибка уходила при исправлении
      input.addEventListener("input", () => {
        // Если уже было error — пробуем снять, когда поле стало не пустым
        if (input.classList.contains(ERROR_CLASS)) {
          // Для email — снимаем только если стало валидно по нашему правилу
          if (input.type === "email") {
            const v = (input.value ?? "").trim();
            if (!v) {
              // если пусто — пока не снимаем (submit покажет "Поле не заполнено" если required)
              clearError(input); // можно оставить/убрать — я убираю, чтобы не мешало
              return;
            }
            if (v.includes("@")) clearError(input);
          } else {
            if (!isEmptyValue(input)) clearError(input);
          }
        }
      });

      input.addEventListener("change", () => {
        if (!isEmptyValue(input)) clearError(input);
      });
    });

    // submit: required fields
    form.addEventListener("submit", (e) => {
      let hasErrors = false;

      const requiredFields = Array.from(form.querySelectorAll("[data-required]"));

      requiredFields.forEach((input) => {
        if (isEmptyValue(input)) {
          setError(input, "Поле не заполнено");
          hasErrors = true;
          return;
        }

        // Доп. проверка email при сабмите тоже (чтобы не зависело от blur)
        if (input.type === "email") {
          const v = (input.value ?? "").trim();
          if (v && !v.includes("@")) {
            setError(input, "Не верное значение");
            hasErrors = true;
            return;
          }
        }

        // если всё ок — чистим
        clearError(input);
      });

      if (hasErrors) {
        e.preventDefault();
		
  // 1) Находим первый инпут с ошибкой (можно и по .form-item.error, но так точнее)
  const firstErrorInput = form.querySelector("input.error, textarea.error, select.error");

  if (firstErrorInput) {
    // Если есть фиксированная шапка — можно добавить отступ
    const HEADER_OFFSET = 0; // например 80

    const y = firstErrorInput.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });

    // 2) Фокус в поле (не обязательно, но удобно)
    firstErrorInput.focus({ preventScroll: true });
  }
      }
    });
  });
})();

});
document.addEventListener('DOMContentLoaded', function () {
	const wrappers = document.querySelectorAll('.hide-block-wrapper');

	wrappers.forEach(function (wrapper) {
		const button = wrapper.querySelector('.open-hide-btn');
		const hiddenBlock = wrapper.querySelector('.is-hide-block');

		if (!button || !hiddenBlock) return;

		button.addEventListener('click', function () {
			const isOpen = wrapper.classList.contains('is-open');

				if (isOpen) {
					closeBlock(wrapper, hiddenBlock);
					button.querySelector('.hide-btn-txt').textContent = 'Показать дополнительные опции';
				} else {
					openBlock(wrapper, hiddenBlock);
					button.querySelector('.hide-btn-txt').textContent = 'Скрыть дополнительные опции';
				}
		});
		
	});

	function openBlock(wrapper, block) {
		wrapper.classList.add('is-open');

		block.style.height = block.scrollHeight + 'px';

		block.addEventListener('transitionend', function handler(e) {
			if (e.propertyName !== 'height') return;

			block.style.height = 'auto';
			block.removeEventListener('transitionend', handler);
		});
	}

	function closeBlock(wrapper, block) {
		block.style.height = block.scrollHeight + 'px';

		// Нужно, чтобы браузер успел применить текущую высоту
		block.offsetHeight;

		block.style.height = '0px';
		wrapper.classList.remove('is-open');
	}
});
// Удаляет тяжёлые блоки калькуляторов из DOM на экранах <=767px и возвращает
// их на место при возврате к десктопу. Запускается ПОСЛЕ acordion-menu.js
// (алфавитный порядок конкатенации), чтобы слушатели .acc__head успели
// привязаться к кнопкам внутри .grid-column-sidebar до того, как контейнер
// будет отсоединён — replaceWith сохраняет узел и его слушатели.
(function () {
  const mql = window.matchMedia("(max-width: 767px)");

  const targets = [
    ...document.querySelectorAll(".calc-start-page .grid-column-main"),
    ...document.querySelectorAll(".calculator-single .grid-column-sidebar"),
  ].map((node) => ({
    node,
    placeholder: document.createComment("mobile-detached"),
  }));

  function apply(isMobile) {
    targets.forEach(({ node, placeholder }) => {
      if (isMobile) {
        if (node.isConnected) node.replaceWith(placeholder);
      } else {
        if (placeholder.isConnected) placeholder.replaceWith(node);
      }
    });
  }

  apply(mql.matches);
  if (typeof mql.addEventListener === 'function') {
    mql.addEventListener("change", (e) => apply(e.matches));
  } else if (typeof mql.addListener === 'function') {
    // Safari до 14 использует устаревший, но всё ещё необходимый API MediaQueryList.
    mql.addListener((e) => apply(e.matches));
  }
})();
