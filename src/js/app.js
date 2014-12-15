$(function () {
    // ----
    // INIT
    // ----
    // Editor
    var editor = ace.edit('editor');

    editor.setTheme('ace/theme/solarized_light');
    editor.getSession().setMode('ace/mode/javascript');
    editor.setFontSize(14);
    editor.setShowPrintMargin(false);
    editor.setShowFoldWidgets(false);

    // Canvas
    var canvas = new SapoRenderer(document.getElementById('canvas'));
/*
    canvas.render(function (s, t) {
        return [Math.random(), Math.random(), Math.random(), 1.0];
        return [s, t, 1.0, 1.0];

        if (s < 0.5) {
            return [s, t, 1.0, 1.0];
        } else {
            return [t, s, 1.0, 1.0];
        }
    });
*/

    // Controls
    params = {
        color: [1.0, 1.0, 1.0, 1.0],
        point: [0.5, 0.5],
        float: 0.3,
        int: 10,
        bool: true
    }
/*
    var gui = new dat.GUI({ autoPlace: false, width: 300, scrollable: true });

    var customContainer = document.getElementById('controls');
    customContainer.appendChild(gui.domElement);

    gui.addColor(params, 'color');
    //gui.add(params, 'point');
    gui.add(params, 'float', 0, 1);
    gui.add(params, 'int', 0, 10);
    gui.add(params, 'bool');
*/
    // ---------
    // FUNCTIONS
    // ---------
    function refresh() {
        var code = editor.getValue();
        var params = /render\(([^)]+)\)/.exec(code)[1];
        console.log(params)
        console.log(code.replace('function render', 'return function render'));

        canvas.render(Function(code.replace('function render', 'return function'))());
        //console.log(esprima.parse(editor.getValue(), { tolerant: true }));
        //console.log();
        //var syntax = esprima.parse();
        //console.log(JSON.stringify(syntax, null, 4));
    }
    // ------
    // EVENTS
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

    editor.on('change', _.debounce(refresh, 250));

    // -----
    // START
    // -----
    refresh();
});
