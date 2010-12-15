/*!
 * @author doup - asier@illarra.com
 */ 
var SAPO = {
/*
  register: function (node_proto) {
    SAPO.node[node_proto.getType()] = function (ops) {
      var instance = Object.create(node_proto);
      instance._init(ops);
      return instance;
    }
  }*/
  register: function (def) {
    var proto;

    SAPO.node[def.name + 'Proto'] = Object.create(SAPO.node.Proto);
    proto = SAPO.node[def.name + 'Proto'];
    
    proto._name = def.name;    
    proto._type = def.type;
    
    SAPO.node[def.name] = function (name) {
      return function (ops) {
        var instance = Object.create(SAPO.node[name + 'Proto']);
        instance._init(ops);
        return instance;
      }
    }(def.name);
  }
};

/**
 *
 */
 
SAPO.node = SAPO.node || {};

SAPO.node.Proto = {
  _definition: function () {},
  _init: function (ops) {
    this._definition();
  },
  _setType: function (type) {
    this._type = type;
  },
  getType: function () {
    return this._type;
  },  
};

/**
 * Flat Color
 */
 /*
SAPO.node.FlatProto = Object.create(SAPO.node.Proto);

SAPO.node.FlatProto._definition = function () {
  this._setType("Flat");
}

SAPO.node.FlatProto._define({
});*/
SAPO.register({
  name: 'Flat',
  type: 'Color',
  ports: [
    {name:'color', type:'Color', value:{r:1, g:1, b:1, a:1}}
  ],
  compute: function (s, t) {
    return this.getPort('color').getValue(s, t); 
  }
});

/*
SAPO.node.Flat = function (options) {
  var instance = Object.create(SAPO.node.FlatProto);
  instance._init(options);
  return instance;
}*/

//SAPO.register(SAPO.node.FlatProto);
//SAPO.node.Flat = SAPO.instanciator(SAPO.node.FlatProto
