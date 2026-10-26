/* Example data for the design showcase. Replace with the real kindergarten list. */
window.KK_DARZELIAI = [
    // Vilnius
    { id: 'ziogelis', miestas: 'vilnius', pavadinimas: 'Lopšelis-darželis „Žiogelis“', rajonas: 'Žirmūnai', statusas: 'running' },
    { id: 'peledziukas', miestas: 'vilnius', pavadinimas: 'Lopšelis-darželis „Pelėdžiukas“', rajonas: 'Antakalnis', statusas: 'running' },
    { id: 'gintarelis', miestas: 'vilnius', pavadinimas: 'Darželis „Gintarėlis“', rajonas: 'Pašilaičiai', statusas: 'forming', truksta: 3 },
    { id: 'vyturelis', miestas: 'vilnius', pavadinimas: 'Lopšelis-darželis „Vyturėlis“', rajonas: 'Baltupiai', statusas: 'forming', truksta: 2 },
    { id: 'saulegraza', miestas: 'vilnius', pavadinimas: 'Darželis „Saulėgrąža“', rajonas: 'Fabijoniškės', statusas: 'running' },
    { id: 'debeselis', miestas: 'vilnius', pavadinimas: 'Lopšelis-darželis „Debesėlis“', rajonas: 'Naujamiestis', statusas: 'planned' },
    // Klaipėda
    { id: 'obelele', miestas: 'klaipeda', pavadinimas: 'Lopšelis-darželis „Obelėlė“', rajonas: 'Centras', statusas: 'running' },
    { id: 'svyturelis', miestas: 'klaipeda', pavadinimas: 'Lopšelis-darželis „Švyturėlis“', rajonas: 'Melnragė', statusas: 'running' },
    { id: 'inkarelis', miestas: 'klaipeda', pavadinimas: 'Darželis „Inkarėlis“', rajonas: 'Smiltelė', statusas: 'forming', truksta: 4 },
    { id: 'pusaite', miestas: 'klaipeda', pavadinimas: 'Lopšelis-darželis „Pušaitė“', rajonas: 'Giruliai', statusas: 'planned' },
    { id: 'bangele', miestas: 'klaipeda', pavadinimas: 'Darželis „Bangelė“', rajonas: 'Debreceno', statusas: 'forming', truksta: 1 },
];

window.KK_STATUS = {
    running: { label: 'Grupė vyksta', action: 'Registruotis' },
    forming: { label: 'Renkama grupė', action: 'Registruotis' },
    planned: { label: 'Dar nevyksta', action: 'Išreikšti norą' },
};

window.KK_MIESTAI = { vilnius: 'Vilnius', klaipeda: 'Klaipėda' };

/* Lithuanian-insensitive search: "zio" finds „Žiogelis“ */
window.kkFold = function (s) {
    return s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[„“"]/g, '');
};
