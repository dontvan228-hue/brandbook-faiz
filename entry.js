/* Entrance: old links to the vape brandbook used index.html#section — send them to vape.html#section. */
(function(){
  var h=location.hash.slice(1);if(!h)return;
  var VAPE=['hero','welcome','about','quick','logo','identity','carriers','templates','store','story','pal','tp','hs','howto','tour'];
  if(VAPE.indexOf(h)>-1||/^(logo|identity|carriers|templates)-\d+$/.test(h))location.replace('vape.html#'+h);
})();
