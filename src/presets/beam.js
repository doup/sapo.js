function render(s, t) {
    var freq  = 40;
    var amp   = 0.05;
    var beam  = 1.2;
    var color = [1.0, 1.0, 0.5, 1.0];

    // Simetry
    s = s * 2;
    s = s > 1 ? 2 - s : s;
    s = s - (amp / 2);

    // Distort
    s = s + Math.sin(t * Math.PI * freq * 2) * (amp / 2);

    return [color[0] * s * beam, color[1], color[2], color[3] * s * beam];
}
