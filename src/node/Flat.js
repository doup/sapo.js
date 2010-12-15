/**
 * Flat Color
 */
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