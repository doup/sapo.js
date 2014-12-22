function render(
    s, t,
    bg           = c(0.541, 0.0, 0.443, 1.0),
    fg           = c(1.0, 0.765, 0.0, 1.0),
    freq         = i(60, 1, 80),
    width        = f(0.95, 0, 1.0),
    inner_radius = f(0.2, 0, 0.4),
    fuzz         = f(0.1, 0, 0.5)
)
{
    var p   = polar(s, t);
    var mid = width / 2;

    if (mid - fuzz < inner_radius) {
        inner_radius = mid - fuzz;
    }

    var cut = (((Math.sin(p[1] * freq) + 1.0) / 2.0) * (mid - inner_radius - fuzz)) + inner_radius;

    return mix(fg, bg, smoothstep(cut, cut + fuzz, p[0]));
}
