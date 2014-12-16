function render(s, t) {
    s = s * 2;
    s = s > 1 ? 2 - s : s;

    return [s * 1.1, 1.0, 0.5, s * 1.1];
}
