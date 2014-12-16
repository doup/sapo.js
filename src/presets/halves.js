function render(
    s, t,
    c1 = c(0.875, 0.0, 0.514, 1.0),
    c2 = c(1.0, 0.765, 0.0, 1.0)
)
{
    if (s > 0.5) {
        return c1;
    } else {
        return c2;
    }
}
