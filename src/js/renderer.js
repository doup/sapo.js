function SapoRenderer(canvas) {
    this.ctx    = canvas.getContext('2d');
    this.width  = canvas.width;
    this.height = canvas.width;
}

SapoRenderer.prototype._getWorker = function (shader) {
    var fn = [
        'var x, y, s, t, color, pos;',
        'var tile = arguments[0];',

        'importScripts("helpers.js");',

        'var fragment = '+ shader.code.toString() + ';',

        'for (x = 0; x < tile.tileW; x++) {',
        '    for (y = 0; y < tile.tileH; y++) {',
        '        s = ((tile.tileW * tile.x) + x) / tile.width;',
        '        t = ((tile.tileH * tile.y) + y) / tile.height;',

        '        color = fragment.apply(null, '+ shader.getArgsStr() +');',

        '        pos = ((y * tile.tileW) + x) * 4;',

        '        tile.imgData.data[pos]     = color[0] * 255; // R',
        '        tile.imgData.data[pos + 1] = color[1] * 255; // G',
        '        tile.imgData.data[pos + 2] = color[2] * 255; // B',
        '        tile.imgData.data[pos + 3] = color[3] * 255; // A',
        '    }',
        '}',

        'return tile;',
    ];

    return cw({
        render: Function(fn.join('\n'))
    }, 4);
};

SapoRenderer.prototype.render = function (shader) {
    var self   = this;
    var tiles  = [];
    var tileX  = 4;
    var tileY  = 4;
    var tileW  = self.width / tileX;
    var tileH  = self.height / tileY;
    var worker = this._getWorker(shader);
    var x, y;

    for (x = 0; x < tileX; x++) {
        for (y = 0; y < tileY; y++) {
            tiles.push({
                x:       x,
                y:       y,
                imgData: self.ctx.getImageData(x * tileW, y * tileH, tileW, tileH),
                tileW:   tileW,
                tileH:   tileH,
                width:   self.width,
                height:  self.height
            });
        }
    }

    worker.batch(function (tile) {
        self.ctx.putImageData(tile.imgData, tile.x * tile.tileW, tile.y * tile.tileH);
    }).render(tiles);
};
