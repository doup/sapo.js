$(function () {
    // ----
    // INIT
    // ----
    // Vars
    var shader;

    // Editor
    var editor = ace.edit('editor');

    editor.setTheme('ace/theme/solarized_light');
    editor.getSession().setMode('ace/mode/javascript');
    editor.setFontSize(14);
    editor.setShowPrintMargin(false);
    editor.setShowFoldWidgets(false);
    editor.setOption("showLineNumbers", false)

    // Hashtag
    if (location.hash) {
        loadPreset(location.hash.replace('#', ''));
    }

    // Canvas
    var canvas = new SapoRenderer(document.getElementById('canvas'));

    // Controls
    var gui = new dat.GUI({ autoPlace: false, width: 300, scrollable: true });
    var customContainer = document.getElementById('controls');

    customContainer.appendChild(gui.domElement);

    // ---------
    // FUNCTIONS
    // ---------
    var refreshCtrl = _.debounce(function (v) {
        canvas.render(shader);
    }, 200);

    function bindToGUI(shader) {
        var controls = [];

        // Create new GUI container
        gui = new dat.GUI({ autoPlace: false, width: 300, scrollable: true });
        $(customContainer).empty();
        customContainer.appendChild(gui.domElement);

        // Bind new controls
        shader.params.forEach(function (param) {
            switch (param.type) {
                case 'bool':
                    controls.push(gui.add(shader.values, param.key));
                    break;

                case 'color':
                    controls.push(gui.addColor(shader.values, param.key));
                    break;

                case 'float':
                    controls.push(gui.add(shader.values, param.key, param.min, param.max));
                    break;

                case 'int':
                    controls.push(gui.add(shader.values, param.key, param.min, param.max).step(1));
                    break;

                case 'point':
                    var folder = gui.addFolder(param.key);

                    controls.push(folder.add(shader.values[param.key], 's', -1.0, 2.0));
                    controls.push(folder.add(shader.values[param.key], 't', -1.0, 2.0));

                    folder.open();

                    break;
            }
        });

        // Events
        controls.forEach(function (control) {
            control.onChange(refreshCtrl);
        });
    }

    function compile() {
        // If there are Errors/Warnings abort compilation
        if (!!editor.getSession().getAnnotations().length) {
            return;
        }

        shader = new SapoShader(editor.getValue());

        bindToGUI(shader);
        canvas.render(shader);
    }

    function loadPreset(key) {
        editor.setValue($('[data-preset-id="'+ key +'"]').html());
        editor.clearSelection();
        editor.moveCursorTo(0, 0);
    }

    // ------
    // EVENTS
    // ------
    $('#presets').change(function (e) {
        if (confirm('Loading the preset will erase your current session. Continue?')) {
            loadPreset(this.value);
        }

        if (this.value !== '') {
            this.value = '';
        }
    });

    editor.getSession().on('changeAnnotation', _.debounce(compile, 250));
});
