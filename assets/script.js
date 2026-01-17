// inisialisasi per section
document.querySelectorAll('.card[data-partial]').forEach(card => {
    const file = card.dataset.partial;

    fetch(`./sections/${file}`)
        .then(res => res.text())
        .then(html => {
            card.innerHTML = html;

            if (file === 'intern.html') {
                requestAnimationFrame(() => {
                    intern_js();
                });
            }
        })
        .catch(err => {
            card.innerHTML = '<p>failed to load...</p>';
            console.error(err);
        });
});

// paper stack js
const app = document.getElementById('app');
const cards = [...document.querySelectorAll('.card')];
let anim = false;

cards.forEach((c, i) => c.dataset.pos = i);

function enter_explore() {
    app.classList.add('explore');
}

function next_card() {
    if (anim) return;
    anim = true;

    const active = cards.find(c => c.dataset.pos == 0);
    active.classList.add('exit');

    setTimeout(() => {
        cards.forEach(card => {
            let p = parseInt(card.dataset.pos);
            card.dataset.pos = (p - 1 + cards.length) % cards.length;
            card.classList.remove('exit');
        });
        anim = false;
    }, 180);
}

//internship section js
function intern_js() {
    const me = document.querySelector('.me');
    if (!me) return;

    const pins = document.querySelectorAll('.pin');
    if (!pins.length) return;

    let walking = false;
    let pin_aktif = null;
    let popover_aktif = null;

    let posisi_x = me.offsetLeft;
    let posisi_y = me.offsetTop;
    const stop_semarang = 20;

    pins.forEach(pin => {
        const popover = new bootstrap.Popover(pin, {
            trigger: 'manual',
            placement: pin.dataset.placement || 'top',
            title: pin.dataset.title,
            content: pin.dataset.content,
            html: true,
            container: 'body',
            customClass: 'intern-popover'
        });

        pin.addEventListener('click', (e) => {
            e.stopPropagation();
            if (walking) return;

            const targetX = pin.offsetLeft + 15;
            const targetY = pin.offsetTop - 10;

            const dx = Math.abs(targetX - posisi_x);
            const dy = Math.abs(targetY - posisi_y);
            if (dx < stop_semarang && dy < stop_semarang) {
                console.log('posisi awal semarang');
                if (popover_aktif && pin_aktif !== pin) {
                    popover_aktif.hide();
                }
                popover.show();
                pin_aktif = pin;
                popover_aktif = popover;
                return;
            }
            walking = true;
            if (popover_aktif) {
                popover_aktif.hide();
                popover_aktif = null;
            }
            pin_aktif = pin;
            console.log(pin);

            //flip sesuai arah
            if (targetX > posisi_x) {
                me.classList.add('flip');
                console.log('flip kiri jalan');
            } else {
                me.classList.remove('flip');
                console.log('flp kanan jalan');
            }

            me.classList.add('walk');
            me.style.transition = 'left 3.5s linear, top 2s linear';
            me.style.left = targetX + 'px';
            me.style.top = targetY + 'px';

            setTimeout(() => {
                me.classList.remove('walk');
                posisi_x = targetX;
                posisi_y = targetY;
                popover.show();
                popover_aktif = popover;

                walking = false;
            }, 3500);
        });
    });

    //popover hilang kalau klik selain pin
    document.addEventListener('click', (e) => {
        const isPin = e.target.closest('.pin');
        const isPopover = e.target.closest('.popover');

        if (!isPin && !isPopover && popover_aktif) {
            popover_aktif.hide();
            popover_aktif = null;
            pin_aktif = null;
        }
    });
}
