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