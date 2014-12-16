function render(
    s, t,
    color_1 = c(0.875, 0.0, 0.514, 1.0),
    color_2 = c(1.0, 0.765, 0.0, 1.0)
)
{
    return mix(color_1, color_2, s);
}
