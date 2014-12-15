$(function () {
    // ----
    // Init
    // ----
    // Editor
    var editor = ace.edit('editor');

    editor.setTheme('ace/theme/solarized_light');
    editor.getSession().setMode('ace/mode/javascript');
    editor.setFontSize(14);
    editor.setShowPrintMargin(false);
    editor.setShowFoldWidgets(false);

    // Canvas
    var canvas  = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    context.fillRect(0, 0, 256, 256);

    // Controls
    params = {
        color: [1.0, 1.0, 1.0, 1.0],
        point: [0.5, 0.5],
        float: 0.3,
        int: 10,
        bool: true
    }

    var gui = new dat.GUI({ autoPlace: false, width: 256, scrollable: true });

    var customContainer = document.getElementById('controls');
    customContainer.appendChild(gui.domElement);

    gui.addColor(params, 'color');
    //gui.add(params, 'point');
    gui.add(params, 'float', 0, 1);
    gui.add(params, 'int', 0, 10);
    gui.add(params, 'bool');

    // ---------
    // Functions
    // ---------
    function render(context, shader) {
        var x, y, u, v, s, t;
/*
        var bufferId   = context.getImageData(0, 0, 300, 300);
        var bufferData = bufferId.data;

        function updateCanvas(out) {
            pos = ((out.data.y * 300) + out.data.x) * 4;

            bufferData[pos]     = out.color[0] * 255; // R
            bufferData[pos + 1] = out.color[1] * 255; // G
            bufferData[pos + 2] = out.color[2] * 255; // B
            bufferData[pos + 3] = 255;                // A

            
        }

        for (x = 0; x < 300; x++) {
            for (y = 0; y < 300; y++) {
                s = x / 300;
                t = y / 300;

                shader.render({ x: x, y: y, s: s, t: t }).then(updateCanvas);
            }
        }*/

        for (x = 0; x < 4; x++) {
            for (y = 0; y < 4; y++) {
                var data = [];

                for (u = 0; u < 64; u++) {
                    for (v = 0; v < 64; v++) {
                        data.push({ x: x, y: y, u: u, v: v, s: (x * 64 + u) / 256, t: (y * 64 + v) / 256 });
                    }
                }

                shader.batch.render(data).then(function (data) {
                    var imgData = context.createImageData(64, 64);
                    var buffer  = imgData.data;
                    var x       = data[0].data.x;
                    var y       = data[0].data.y;
                    var pos;

                    data.forEach(function (res) {
                        pos = ((res.data.u * 64) + res.data.v) * 4;

                        buffer[pos]     = res.color[0] * 255; // R
                        buffer[pos + 1] = res.color[1] * 255; // G
                        buffer[pos + 2] = res.color[2] * 255; // B
                        buffer[pos + 3] = 255;                // A
                    });

                    context.putImageData(imgData, x * 64, y * 64);
                });
            }
        }
    }

    var shader = cw({
        render: function (data) {
            return { data: data, color: [Math.random(), Math.random(), Math.random(), 1.0] };
        }
    }, 4);

    render(context, shader);

    // ------
    // Events
    // ------
    $('#presets').change(function (e) {
        if (confirm('Loading the preset will erase your current session. Continue?')) {
            editor.setValue($('[data-preset-id="'+ this.value +'"]').html());
            editor.clearSelection();
        }

        if (this.value !== '') {
            this.value = '';
        }
    });

    editor.on('change', _.debounce(function () {
        var params = /render\(([^)]+)\)/.exec(editor.getValue())[1];
        console.log(params)

        //console.log(esprima.parse(editor.getValue(), { tolerant: true }));
        //console.log();
        //var syntax = esprima.parse();
        //console.log(JSON.stringify(syntax, null, 4));
    }, 250));
});
