(function () {
    'use strict';

    /* ---------- Mobile menu ---------- */
    var toggle = document.querySelector('.nav-toggle');
    if (toggle) {
        toggle.addEventListener('click', function () {
            var open = document.body.classList.toggle('nav-open');
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Uždaryti meniu' : 'Atidaryti meniu');
        });
        document.querySelectorAll('.mobile-menu a').forEach(function (a) {
            a.addEventListener('click', function () {
                document.body.classList.remove('nav-open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---------- Reveal on scroll ---------- */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        io.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '0px 0px -8% 0px' }
        );
        reveals.forEach(function (el) {
            io.observe(el);
        });
    } else {
        reveals.forEach(function (el) {
            el.classList.add('is-visible');
        });
    }

    /* ---------- Kindergarten finder ---------- */
    var finder = document.getElementById('finder');
    if (finder && window.KK_DARZELIAI) {
        var list = finder.querySelector('.kg-list');
        var search = finder.querySelector('#kg-search');
        var count = finder.querySelector('#kg-count');
        var cityInputs = finder.querySelectorAll('input[name="kg-city"]');

        var icon = function (id, cls) {
            return '<svg class="icon ' + (cls || '') + '" aria-hidden="true"><use href="#i-' + id + '"/></svg>';
        };

        var render = function () {
            var city = finder.querySelector('input[name="kg-city"]:checked').value;
            var q = kkFold(search.value.trim());
            var items = KK_DARZELIAI.filter(function (k) {
                return k.miestas === city && (!q || kkFold(k.pavadinimas + ' ' + k.rajonas).indexOf(q) !== -1);
            });

            count.textContent =
                items.length === 0
                    ? 'Darželių nerasta'
                    : 'Rodoma: ' + items.length + ' ' + (items.length === 1 ? 'darželis' : items.length < 10 ? 'darželiai' : 'darželių');

            if (items.length === 0) {
                list.innerHTML =
                    '<div class="kg-empty"><strong>Pagal „' +
                    search.value.replace(/[<>&"]/g, '') +
                    '“ darželio neradome.</strong><br />Užregistruokite vaiką ir nurodykite savo darželį – susisieksime su juo patys.</div>';
                return;
            }

            list.innerHTML = items
                .map(function (k) {
                    var st = KK_STATUS[k.statusas];
                    var label = st.label + (k.truksta ? ' · trūksta ' + k.truksta : '');
                    return (
                        '<div class="kg">' +
                        '<div><div class="kg__name">' + k.pavadinimas + '</div>' +
                        '<div class="kg__area">' + icon('map-pin') + KK_MIESTAI[k.miestas] + ', ' + k.rajonas + '</div></div>' +
                        '<div class="kg__side"><span class="status status--' + k.statusas + '">' + label + '</span>' +
                        '<a class="text-link" href="registracija.html?darzelis=' + k.id + '">' + st.action + icon('arrow-right') + '</a></div>' +
                        '</div>'
                    );
                })
                .join('');
        };

        search.addEventListener('input', render);
        cityInputs.forEach(function (i) {
            i.addEventListener('change', render);
        });
        render();
    }

    /* ---------- Footer year ---------- */
    document.querySelectorAll('[data-year]').forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });
})();
