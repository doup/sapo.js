function render(
    s, t,
    color_1=c(1.0, 1.0, 1.0, 1.0),
    color_2=c(0.1, 0.1, 0.1, 1.0),
    x_repeat=i(4, 2, 20),
    y_repeat=i(4, 2, 20),
    fuzz=f(0.01, 0.01, 0.4)
) {
    var column, row, ss, tt, tmp;
    var isInverted = false;

    // Let's calculate in wich column and row we are.
    column = parseInt(s * x_repeat);
    row    = parseInt(t * y_repeat);

    // Scale the fuzz using the smallest repeat, and
    // set it to the half, as we share the fuzz between
    // two tiles.
    fuzz = (fuzz / (1 / (x_repeat > y_repeat ? y_repeat : x_repeat))) / 2.0;

    // When the column and row are not even, or are not odd,
    // we invert the colors. So, color_1 = color_2 and
    // color_2 = color_1
    if ((!(even(column) && even(row))) && (!(odd(column) && odd(row)))) {
        isInverted = true;
    }

    // Tile the coordinates so that we have ss and tt,
    // which range between 0 and 1.0.
    ss = wrap(s * x_repeat);
    tt = wrap(t * y_repeat);

    //  ____          __
    // |\  /|        |\ |
    // | \/ |        | \|         __
    // | /\ |   =>   | /|   =>   | /|
    // |/__\|        |/_|        |/_|
    //
    // We "fold" the coordinates to simplify the edge
    // detection. ss and tt would range in [ 0, 0.5 )
    //
    ss = ss < 0.5 ? ss : 0.5 - (ss - 0.5);
    tt = tt < 0.5 ? tt : 0.5 - (tt - 0.5);

    // If we are in the upper triangle we do a simetry.
    // So that we even simplify more the operation.
    if (tt > ss) {
        tmp = ss;
        ss  = tt;
        tt  = tmp;
    }

    // If we are in the fuzz range we do a gradient between
    // the two colors. Otherwise we just return a plain color.
    //
    // ^tt   /|
    // |    / |
    // |   /__| <- Fuzz range
    // |  /___|
    // |--------->ss
    // 0,0
    //
    if (tt < fuzz) {
        if (isInverted) {
            tmp     = color_1;
            color_1 = color_2;
            color_2 = tmp;
        }

        fuzz = ((tt / fuzz) / 2.0) + 0.5;
        fuzz = smoothstep(0.0, 1.0, fuzz);

        return mix(color_1, color_2, 1.0 - fuzz);
    } else {
        if (isInverted) {
            return color_2;
        } else {
            return color_1;
        }
    }
}
