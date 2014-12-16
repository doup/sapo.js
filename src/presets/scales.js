function render(
    s, t,
    x_repeat  = i(4, 1, 8),
    y_repeat  = i(6, 1, 14),
    shadow    = c(0.318, 0.267, 0.157, 1.0),
    color     = c(0.902, 0.882, 0.816, 1.0),
    highlight = c(0.984, 0.984, 0.992, 1.0),
    type      = i(0, 0, 1)
)
{
    var cut, column, row, ss, tt, border, mid;
    var border_start, border_mid, border_end;
    var origin, dist, hl_width, hl_start, hl_end, pos;

    // Let's calculate in wich column and row we are.
    column = parseInt(s * x_repeat);
    row    = parseInt(t * y_repeat);

    // New coordinates
    ss = wrap(s * x_repeat);
    tt = wrap(t * y_repeat);

    if (odd(row)) {
        ss = wrap(ss + 0.5);
    }

    // Fold coordinates
    //  ____        __
    // |\  /|      |\ |
    // |_\/_|  =>  |_\|
    //
    ss = (ss < 0.5) ? ss : 0.5 - (ss - 0.5);

    // Calculate cut height for the given ss
    // Separates the top and bot region of the scale
    //        ss
    //       __|_
    //      |\   |  TOP TRIANGLE
    //      | \. |_ cut
    // BOT  |  \ |
    // TRI. |___\|
    if (type === 0) {
        cut = Math.sin(ss * Math.PI);
    } else if (type == 1) {
        cut = clamp(ss * 3.0);
    } else {
        cut = ss * 2.0;
    }

    // DRAWING
    // Width of the scale border
    border = 0.08;
    border = border + (border * (1 - cut)) * 0.5;  // modulate width

    // Mid position (%) when border color is darkest
    // ROTATED visualization:
    //
    //          mid
    //           .
    //        .   .
    //     .       .
    //     ######### <- border
    //     ^       ^
    //     Start   End
    //  ----------------> tt
    mid = 0.6;

    // Border position
    border_start = cut - border;
    border_mid   = border_start + (mid * border);
    border_end   = cut;

    // Change origin based on triangle (top/bot)
    if (tt < border_mid) {
        origin = [0.5, -1.0];
    } else {
        origin = [0.0, 0.0];
    }

    // Calculate distance to scale origin
    // Multiply horizontal (x2.5) axis to exagerate roundness
    dist = Math.sqrt(Math.pow((ss - origin[0]) * 2.5, 2) + Math.pow(tt - origin[1], 2));

    // Calculate color
    color = mix(highlight, color, smoothstep(0.0, 1.0, (dist * 1.25) - 0.75));  // Highlight
    color = mix(shadow, color, smoothstep(0.0, 1.0, (tt - origin[1]) * 2.7));   // Origin shadow

    // Scale shadow
    cut   = (Math.sin((ss + origin[0]) * Math.PI) * 1.2) - 0.85;
    color = mix(shadow, color, smoothstep(0.0, 1.0, tt - origin[1] - cut));

    // Border Highlight
    hl_width = 0.15;
    hl_start = border_start - hl_width;
    hl_end   = hl_start + hl_width;

    if (tt > hl_start && tt <= hl_end) {
        pos = (tt - hl_start) / hl_width;
        color = mix(color, highlight, (
            smoothstep(0.0, 1.0, ss * 2) *       // Horizontal control
            smoothstep(0.0, 1.0, pos * 2) *      // Start slope _/'
            smoothstep(0.0, 1.0, 2 - pos * 2) *  // End slope '\_
            0.3                                  // Reduce intensity
        ));
    }

    // Draw border
    if (tt > border_start && tt <= border_end) {
        // Map from border_start = 0.0 to border_end = 1.0
        //    |
        //    |  border_start -------
        // tt |
        //    |  border_end   -------
        //    v
        pos = (tt - border_start) / border;

        return mix(color, shadow, (
            smoothstep(0.0, 1.0, clamp(pos / mid)) *
            smoothstep(1.0, 0.0, clamp((pos - mid) / (1 - mid))) *
            0.5
        ));
    } else {
        return color;
    }
}
