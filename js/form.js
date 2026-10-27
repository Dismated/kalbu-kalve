(function () {
    'use strict';

    var form = document.getElementById('reg-form');
    if (!form) return;

    var now = new Date();
    var submitted = false;

    var $ = function (sel, root) {
        return (root || document).querySelector(sel);
    };
    var $$ = function (sel, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(sel));
    };
    var esc = function (s) {
        return String(s).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    };

    /* ================= Kindergarten combobox ================= */
    var kgInput = $('#darzelis');
    var kgList = $('#darzelis-list');
    var kgId = $('#darzelis-id');
    var kitaField = $('#kita-field');
    var kitaInput = $('#darzelis-kita');
    var activeIndex = -1;
    var options = [];

    var setOther = function (on) {
        kitaField.hidden = !on;
        if (on) {
            kgId.value = 'kita';
            kgInput.value = 'Mano darželio sąraše nėra';
        }
    };

    var selectKg = function (k) {
        if (k === 'kita') {
            setOther(true);
            kitaInput.focus();
        } else {
            setOther(false);
            kgId.value = k.id;
            kgInput.value = k.pavadinimas;
        }
        closeList();
        if (submitted) validate();
    };

    var renderList = function () {
        var q = kkFold(kgInput.value.trim());
        var items = KK_DARZELIAI.filter(function (k) {
            return !q || kkFold(k.pavadinimas + ' ' + k.rajonas + ' ' + KK_MIESTAI[k.miestas]).indexOf(q) !== -1;
        });
        options = items.concat(['kita']);
        activeIndex = -1;
        kgList.innerHTML = options
            .map(function (k, i) {
                if (k === 'kita') {
                    return '<li class="combo__option combo__option--other" role="option" id="kg-opt-' + i + '" data-i="' + i + '">+ Mano darželio sąraše nėra</li>';
                }
                var st = KK_STATUS[k.statusas];
                return (
                    '<li class="combo__option" role="option" id="kg-opt-' + i + '" data-i="' + i + '">' +
                    '<span>' + k.pavadinimas + '<small>' + KK_MIESTAI[k.miestas] + ', ' + k.rajonas + '</small></span>' +
                    '<span class="status status--' + k.statusas + '">' + st.label + '</span></li>'
                );
            })
            .join('');
    };

    var openList = function () {
        renderList();
        kgList.hidden = false;
        kgInput.setAttribute('aria-expanded', 'true');
    };

    var closeList = function () {
        kgList.hidden = true;
        kgInput.setAttribute('aria-expanded', 'false');
        kgInput.removeAttribute('aria-activedescendant');
    };

    var highlight = function (i) {
        $$('.combo__option', kgList).forEach(function (el) {
            el.setAttribute('aria-selected', 'false');
        });
        activeIndex = i;
        var el = $('#kg-opt-' + i);
        if (el) {
            el.setAttribute('aria-selected', 'true');
            el.scrollIntoView({ block: 'nearest' });
            kgInput.setAttribute('aria-activedescendant', el.id);
        }
    };

    kgInput.addEventListener('focus', openList);
    kgInput.addEventListener('input', function () {
        kgId.value = '';
        kitaField.hidden = true;
        openList();
    });
    kgInput.addEventListener('blur', function () {
        setTimeout(closeList, 120);
    });
    kgInput.addEventListener('keydown', function (e) {
        if (kgList.hidden && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) openList();
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            highlight(Math.min(activeIndex + 1, options.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            highlight(Math.max(activeIndex - 1, 0));
        } else if (e.key === 'Enter' && !kgList.hidden && activeIndex >= 0) {
            e.preventDefault();
            selectKg(options[activeIndex]);
        } else if (e.key === 'Escape') {
            closeList();
        }
    });
    kgList.addEventListener('mousedown', function (e) {
        var li = e.target.closest('.combo__option');
        if (!li) return;
        e.preventDefault();
        selectKg(options[Number(li.getAttribute('data-i'))]);
    });


    /* ================= Children ================= */
    var childrenEl = $('#children');
    var tpl = $('#child-template');
    var childCount = 0;

    /* Only speaks up when the child seems outside the 3–7 range */
    var ageHint = function (child) {
        var y = Number($('[data-name="metai"]', child).value);
        var hint = $('.child__age', child);
        var age = now.getFullYear() - y;
        if (!y || (age >= 3 && age <= 7)) {
            hint.hidden = true;
            return;
        }
        hint.hidden = false;
        hint.innerHTML =
            '<svg class="icon" aria-hidden="true"><use href="#i-info"/></svg><span>Pamokėlės skirtos 3–7 m. vaikams – susisieksime ir aptarsime galimybes.</span>';
    };

    var renumber = function () {
        var kids = $$('.child', childrenEl);
        kids.forEach(function (c, i) {
            $('.child__title', c).textContent = kids.length > 1 ? i + 1 + ' vaikas' : 'Vaikas';
            $('.child__remove', c).hidden = kids.length === 1;
        });
    };

    var addChild = function () {
        childCount++;
        var node = tpl.content.firstElementChild.cloneNode(true);
        $$('[data-name]', node).forEach(function (el) {
            var id = el.getAttribute('data-name') + '-' + childCount;
            el.id = id;
            el.name = el.getAttribute('data-name') + '[]';
            var label = el.closest('.field').querySelector('label');
            if (label) label.setAttribute('for', id);
        });
        var yearSel = $('[data-name="metai"]', node);
        for (var y = now.getFullYear() - 2; y >= now.getFullYear() - 8; y--) {
            yearSel.insertAdjacentHTML('beforeend', '<option value="' + y + '">' + y + '</option>');
        }
        yearSel.addEventListener('change', function () {
            ageHint(node);
        });
        $('.child__remove', node).addEventListener('click', function () {
            node.remove();
            renumber();
        });
        childrenEl.appendChild(node);
        renumber();
        return node;
    };

    addChild();
    $('#add-child').addEventListener('click', function () {
        var node = addChild();
        $('[data-name="vaikas"]', node).focus();
    });

    /* ================= Validation ================= */
    var setError = function (field, bad) {
        field.classList.toggle('has-error', bad);
        $$('input, select, textarea', field).forEach(function (el) {
            if (el.type !== 'radio') el.setAttribute('aria-invalid', String(bad));
        });
        return bad;
    };

    var phoneDigits = function () {
        var v = $('#telefonas').value.replace(/[\s()-]/g, '');
        v = v.replace(/^\+?370/, '').replace(/^8(?=\d{8}$)/, '');
        return v;
    };

    var validate = function () {
        var errors = [];
        var check = function (field, bad) {
            if (setError(field, bad)) errors.push(field);
        };

        check($('[data-field="darzelis"]', form), !kgId.value);
        if (kgId.value === 'kita') {
            check(kitaField, kitaInput.value.trim().length < 3);
        } else {
            setError(kitaField, false);
        }

        $$('.child', childrenEl).forEach(function (c) {
            check($('[data-field="vaikas"]', c), $('[data-name="vaikas"]', c).value.trim().length < 2);
            check($('[data-field="metai"]', c), !$('[data-name="metai"]', c).value);
        });

        check($('[data-field="tevai"]', form), $('#tevai').value.trim().length < 2);
        check($('[data-field="telefonas"]', form), !/^\d{8}$/.test(phoneDigits()));
        check($('[data-field="elpastas"]', form), !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#elpastas').value.trim()));

        var consent = $('[data-field="sutikimas"]', form);
        consent.classList.toggle('has-error', !$('#sutikimas').checked);
        if (!$('#sutikimas').checked) errors.push(consent);

        $('#form-alert').classList.toggle('is-visible', errors.length > 0);
        return errors;
    };

    form.addEventListener('input', function () {
        if (submitted) validate();
    });
    form.addEventListener('change', function () {
        if (submitted) validate();
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        submitted = true;
        var errors = validate();
        if (errors.length) {
            $('#form-alert').scrollIntoView({ behavior: 'smooth', block: 'center' });
            var first = $('input:not([type="hidden"]), select, textarea', errors[0]);
            if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 350);
            return;
        }
        if (form.svetaine.value) return; // honeypot

        showSuccess();
    });

    /* ================= Success ================= */
    var showSuccess = function () {
        var parentFirst = $('#tevai').value.trim().split(/\s+/)[0];
        var kids = $$('.child', childrenEl).map(function (c) {
            return esc($('[data-name="vaikas"]', c).value.trim()) + ' <span class="muted">(' + $('[data-name="metai"]', c).value + ' m.)</span>';
        });
        var kgName = kgId.value === 'kita' ? kitaInput.value.trim() : kgInput.value;
        var digits = phoneDigits();

        $('#success-title').textContent = 'Ačiū, ' + parentFirst + '! Registraciją gavome.';
        $('#success-summary').innerHTML =
            '<dt>Darželis</dt><dd>' + esc(kgName) + (form.grupe.value.trim() ? ', gr. ' + esc(form.grupe.value.trim()) : '') + '</dd>' +
            '<dt>' + (kids.length > 1 ? 'Vaikai' : 'Vaikas') + '</dt><dd>' + kids.join('<br />') + '</dd>' +
            '<dt>Telefonas</dt><dd>+370 ' + digits.slice(0, 3) + ' ' + digits.slice(3) + '</dd>' +
            '<dt>El. paštas</dt><dd>' + esc($('#elpastas').value.trim()) + '</dd>';

        form.hidden = true;
        $$('.reg-simple > .h1, .reg-simple > .lead').forEach(function (el) {
            el.hidden = true;
        });
        var success = $('#success');
        success.hidden = false;
        $('#form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
        success.focus({ preventScroll: true });
    };

    /* ================= Prefill from link / QR code ================= */
    var params = new URLSearchParams(location.search);
    var pre = params.get('darzelis');
    if (pre === 'kita') {
        setOther(true);
    } else if (pre) {
        var k = KK_DARZELIAI.filter(function (x) {
            return x.id === pre;
        })[0];
        if (k) {
            kgId.value = k.id;
            kgInput.value = k.pavadinimas;
        }
    }
})();
