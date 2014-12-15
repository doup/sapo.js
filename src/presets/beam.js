function render(s, t) {
    if (s < 0.5) {
        return [s * 2, 1.0, 0.5, 1.0];
    } else {
        return [2 - (s * 2), 1.0, 0.5, 1.0];
    }
}
