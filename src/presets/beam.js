function render(s, t) {
    var freq = 15;
    var amp  = 0.05;
    var beam = 1.2;

    // Simetry
    s = s * 2;
    s = s > 1 ? 2 - s : s;
    s = s - (amp / 2);

    // Distort
    s = s + Math.sin(t * Math.PI * freq * 2) * (amp / 2);

    return [s * beam, 1.0, 0.5, s * beam];
}
