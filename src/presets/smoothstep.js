function render(s, t, top=c(0.2, 0.2, 0.2, 1.0), bot=c(0.6, 1.0, 0.2, 1.0), gutter=f(0.02, 0.0, 0.4)) {
    var x = smoothstep(0.0, 1.0, s);

    if (t > (x + gutter / 2)) {
        return bot;
    } else if(t < (x - gutter / 2)) {
        return top;
    } else {
        // Gutter
        return mix(top, bot, smoothstep(0.0, 1.0, (t - x + (gutter / 2)) / gutter));
    }
}
