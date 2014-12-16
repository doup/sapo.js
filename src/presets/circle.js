function render(
    s, t,
    bg     = c(0.447, 0.816, 0.973, 1.0),
    color  = c(0.89, 0.0, 0.263, 1.0),
    radius = f(0.2),
    pos    = p(0.5, 0.5),
    fuzz   = f(0.01, 0.0, 0.1)
)
{
    var dist = distance([s, t], pos);

    if (dist < radius) {
        return color;
    } else if (dist >= radius && dist < radius + fuzz) {
        return mix(color, bg, smoothstep(0.0, 1.0, (dist - radius) / fuzz));
    } else {
        return bg;
    }
}
