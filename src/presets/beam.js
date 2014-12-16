function render(s, t, color=c(1.0, 1.0, 0.5, 1.0), freq=i(40, 0, 80), amp=f(0.05), beam=f(1.2, 1.0, 2.0)) {
    // Simetry
    s = s * 2;
    s = s > 1 ? 2 - s : s;
    s = s - (amp / 2);

    // Distort
    s = s + Math.sin(t * (Math.PI * 2) * freq) * (amp / 2);

    return [color[0] * s * beam, color[1], color[2], color[3] * s * beam];
}
