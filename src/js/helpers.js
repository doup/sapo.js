function blend(cbot, ctop) {
    return [lerp(cbot[0], ctop[0], ctop[3]),
            lerp(cbot[1], ctop[1], ctop[3]),
            lerp(cbot[2], ctop[2], ctop[3]),
            lerp(cbot[3], ctop[3], ctop[3])];
}

function clamp(x, min, max) {
    min = min || 0.0;
    max = max || 1.0;

    if (x < min) {
        return min;
    } else if (x > max) {
        return max;
    }

    return x;
}

function even(x) {
    return x.toFixed() % 2 == 0;
}

function lerp(a, b, x) {
    return (a * (1 - x)) + (b * x);
}

function mix(ca, cb, x) {
    return [lerp(ca[0], cb[0], x),
            lerp(ca[1], cb[1], x),
            lerp(ca[2], cb[2], x),
            lerp(ca[3], cb[3], x)];
}

function odd(x) {
    return !even(x);
}

function smoothstep(a, b, x) {
    x = clamp((x - a) / (b - a));

    return x * x * (3 - 2 * x);
}

function wrap(x, min, max) {
    min = min || 0.0;
    max = max || 1.0;

    x = x - ((x - min) / (max - min)).toFixed() * (max - min);

    if (x < 0) {
        x = x + max - min;
    }

    return x;
}
