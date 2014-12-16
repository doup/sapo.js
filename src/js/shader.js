function SapoShader(code) {
    var signature = [];
    var values    = {};
    var params, tmp;

    // ------
    // PARAMS
    // ------
    // Remove new-lines
    params = code.replace(/(?:\r\n|\r|\n)/g, ' ');

    // Extract parameters
    params = /render\((.*?)\) {/.exec(params)[1].replace(/\s/g, '');

    // Extract type definition groups
    groups = params.match(/\((.*?)\)/g);

    // Replace group commas with pipes
    if (groups !== null) {
        groups.forEach(function (group) {
            params = params.replace(group, group.replace(/\,/g, '|'));
        });
    }

    // Split all parameters
    params = params.split(',');

    // ----------------
    // MASSAGE FRAGMENT
    // ----------------
    // Remove function name
    code = code.replace('function render', 'return function');

    // Remove default value and type hints from function parameters
    params.forEach(function (param) {
        var key;

        if (param.search('=') !== -1) {
            var regex = param.replace(/\./g, '\\.')
                             .replace(/\|/g, '\\s*,\\s*')
                             .replace('=', '\\s*=\\s*')
                             .replace('(', '\\(\\s*')
                             .replace(')', '\\s*\\)\\s*')

            key  = param.split('=')[0];
            code = code.replace(new RegExp(regex), key);
        } else {
            key = param;
        }

        signature.push(key);
    });

    // Remove s/t params
    params = params.filter(function (param) {
        return param !== 's' && param !== 't';
    });

    // Create params definition object
    params = params.map(function (param) {
        var def = {};
        var value;

        param = param.split('=');
        value = /\((.*?)\)/.exec(param[1])[1].split('|');

        def.key = param[0];

        switch (param[1][0]) {
            case 'b':
                def.type = 'bool';

                if (value[0].toLowerCase() == 'true' || value[0] == '1') {
                    def.default = true;
                } else {
                    def.default = false;
                }

                break;

            case 'c':
                def.type    = 'color';
                def.default = [
                    parseInt(value[0] * 255),
                    parseInt(value[1] * 255),
                    parseInt(value[2] * 255),
                    parseInt(value[3] * 255)
                ];

                break;

            case 'f':
                def.type    = 'float';
                def.default = parseFloat(value[0]);
                def.min     = 0.0;
                def.max     = 1.0;

                if (value[1]) { def.min = parseFloat(value[1]); }
                if (value[2]) { def.max = parseFloat(value[2]); }

                if (def.max < def.min) {
                    tmp     = def.max;
                    def.max = def.min;
                    def.min = tmp;
                }

                break;

            case 'i':
                def.type    = 'int';
                def.default = parseInt(value[0]);
                def.min     = 0;
                def.max     = 10;

                if (value[1]) { def.min = parseInt(value[1]); }
                if (value[2]) { def.max = parseInt(value[2]); }

                if (def.max < def.min) {
                    tmp     = def.max;
                    def.max = def.min;
                    def.min = tmp;
                }

                break;

            case 'p':
                def.type    = 'point';
                def.default = {
                    s: parseFloat(value[0]),
                    t: parseFloat(value[1])
                };

                break;

            default:
                def.type = 'unknown';
                break;
        }


        values[def.key] = def.default;

        return def;
    });

    this.values    = values;
    this.params    = params;
    this.signature = signature;
    this.code      = Function(code)();
}

/**
 * Orders arguments based on shader signature and creates a string
 * which can be used with fn.apply()
 *
 * @return {string} Arguments string with values
 */
SapoShader.prototype.getArgsStr = function () {
    var self = this;
    var args = [];

    this.signature.forEach(function (key) {
        if (key == 's' || key == 't') {
            args.push(key);
        } else {
            var type = self.params.filter(function (o) { return o.key == key; })[0].type;

            if (type === 'color') {
                args.push(JSON.stringify(self.values[key].map(function (v) { return v / 255; })));
            } else if (type === 'point') {
                args.push(JSON.stringify([self.values[key].s, self.values[key].t]));
            } else {
                args.push(JSON.stringify(self.values[key]));
            }
        }
    });

    return '['+ args.join(', ') +']';
};
