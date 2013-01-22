(function(a){function b(a,b){return typeof a=="function"?a.call(b):a}function d(b,d){this.$element=a(b),this.options=d,this.enabled=!0,this.fixTitle(),c(this)}var c=function(){function d(){for(var a=0;a<c.length;){var b=c[a];b.options.gcInterval===0||b.$element.closest("body").length===0?(b.hoverState="out",b.hide(),c.splice(a,1)):a++}}function e(){b=setTimeout(function(){d(),e()},a)}var a,b=null,c=[];return function(d){if(d.options.gcInterval===0)return;b&&d.options.gcInterval<a&&(clearTimeout(b),b=null,a=d.options.gcInterval),c.push(d),b||e()}}();d.prototype={show:function(){var c=this.getTitle();if(c&&this.enabled){var d=this.tip();d.find(".tipsy-inner")[this.options.html?"html":"text"](c),d[0].className="tipsy",d.remove().css({top:0,left:0,visibility:"hidden",display:"block"}).prependTo(document.body);var e=a.extend({},this.$element.offset(),{width:this.$element[0].offsetWidth||0,height:this.$element[0].offsetHeight||0});if(typeof this.$element[0].nearestViewportElement=="object"){var f=this.$element[0],g=f.getBoundingClientRect();e.width=g.width,e.height=g.height}var h=d[0].offsetWidth,i=d[0].offsetHeight,j=b(this.options.gravity,this.$element[0]),k;switch(j.charAt(0)){case"n":k={top:e.top+e.height+this.options.offset,left:e.left+e.width/2-h/2};break;case"s":k={top:e.top-i-this.options.offset,left:e.left+e.width/2-h/2};break;case"e":k={top:e.top+e.height/2-i/2,left:e.left-h-this.options.offset};break;case"w":k={top:e.top+e.height/2-i/2,left:e.left+e.width+this.options.offset}}j.length==2&&(j.charAt(1)=="w"?k.left=e.left+e.width/2-15:k.left=e.left+e.width/2-h+15),d.css(k).addClass("tipsy-"+j),d.find(".tipsy-arrow")[0].className="tipsy-arrow tipsy-arrow-"+j.charAt(0),this.options.className&&d.addClass(b(this.options.className,this.$element[0])),this.options.fade?d.stop().css({opacity:0,display:"block",visibility:"visible"}).animate({opacity:this.options.opacity}):d.css({visibility:"visible",opacity:this.options.opacity});var l=this,m=function(a){return function(){l.$tip.stop(),l.tipHovered=a,a||(l.options.delayOut===0&&l.options.trigger!="manual"?l.hide():setTimeout(function(){l.hoverState=="out"&&l.hide()},l.options.delayOut))}};d.hover(m(!0),m(!1))}},hide:function(){this.options.fade?this.tip().stop().fadeOut(function(){a(this).remove()}):this.tip().remove()},fixTitle:function(){var a=this.$element;(a.attr("title")||typeof a.attr("original-title")!="string")&&a.attr("original-title",a.attr("title")||"").removeAttr("title"),typeof a.context.nearestViewportElement=="object"&&a.children("title").length&&a.append("<original-title>"+(a.children("title").text()||"")+"</original-title>").children("title").remove()},getTitle:function(){var a,b=this.$element,c=this.options;this.fixTitle();if(typeof c.title=="string"){var d=c.title=="title"?"original-title":c.title;b.children(d).length?a=b.children(d).html():(a=b.attr(d),typeof a=="undefined"&&(a=""))}else typeof c.title=="function"&&(a=c.title.call(b[0]));return a=(""+a).replace(/(^\s*|\s*$)/,""),a||c.fallback},tip:function(){return this.$tip||(this.$tip=a('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>')),this.$tip},validate:function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled}},a.fn.tipsy=function(b){function c(c){var e=a.data(c,"tipsy");return e||(e=new d(c,a.fn.tipsy.elementOptions(c,b)),a.data(c,"tipsy",e)),e}function e(){var a=c(this);a.hoverState="in",b.delayIn===0?a.show():(a.fixTitle(),setTimeout(function(){a.hoverState=="in"&&a.show()},b.delayIn))}function f(){var a=c(this);a.hoverState="out";if(b.delayOut===0)a.hide();else{var d=function(){(!a.tipHovered||!b.hoverlock)&&a.hoverState=="out"&&a.hide()};setTimeout(d,b.delayOut)}}if(b===!0)return this.data("tipsy");if(typeof b=="string")return a(this).each(function(c,d){a(d).data("tipsy")&&(tipsy=a(d).data("tipsy"),tipsy[b]())}),this;b=a.extend({},a.fn.tipsy.defaults,b),b.hoverlock&&b.delayOut===0&&(b.delayOut=100),b.live||this.each(function(){c(this)});if(b.trigger!="manual"){var g=b.live?"live":"bind",h=b.trigger=="hover"?"mouseenter":"focus",i=b.trigger=="hover"?"mouseleave":"blur";this[g](h,e)[g](i,f)}return this},a.fn.tipsy.defaults={className:null,delayIn:0,delayOut:0,fade:!1,fallback:"",gcInterval:0,gravity:"n",html:!1,live:!1,offset:0,opacity:.8,title:"title",trigger:"hover",hoverlock:!1},a.fn.tipsy.elementOptions=function(b,c){return a.metadata?a.extend({},c,a(b).metadata()):c},a.fn.tipsy.autoNS=function(){return a(this).offset().top>a(document).scrollTop()+a(window).height()/2?"s":"n"},a.fn.tipsy.autoWE=function(){return a(this).offset().left>a(document).scrollLeft()+a(window).width()/2?"e":"w"},a.fn.tipsy.autoBounds=function(b,c){return function(){var d={ns:c[0],ew:c.length>1?c[1]:!1},e=a(document).scrollTop()+b,f=a(document).scrollLeft()+b,g=a(this);return g.offset().top<e&&(d.ns="n"),g.offset().left<f&&(d.ew="w"),a(window).width()+a(document).scrollLeft()-g.offset().left<b&&(d.ew="e"),a(window).height()+a(document).scrollTop()-g.offset().top<b&&(d.ns="s"),d.ns+(d.ew?d.ew:"")}}})(jQuery);var requirejs,require,define;(function(global){function isFunction(a){return ostring.call(a)==="[object Function]"}function isArray(a){return ostring.call(a)==="[object Array]"}function each(a,b){if(a){var c;for(c=0;c<a.length;c+=1)if(a[c]&&b(a[c],c,a))break}}function eachReverse(a,b){if(a){var c;for(c=a.length-1;c>-1;c-=1)if(a[c]&&b(a[c],c,a))break}}function hasProp(a,b){return hasOwn.call(a,b)}function eachProp(a,b){var c;for(c in a)if(a.hasOwnProperty(c)&&b(a[c],c))break}function mixin(a,b,c,d){return b&&eachProp(b,function(b,e){if(c||!hasProp(a,e))d&&typeof b!="string"?(a[e]||(a[e]={}),mixin(a[e],b,c,d)):a[e]=b}),a}function bind(a,b){return function(){return b.apply(a,arguments)}}function scripts(){return document.getElementsByTagName("script")}function getGlobal(a){if(!a)return a;var b=global;return each(a.split("."),function(a){b=b[a]}),b}function makeContextModuleFunc(a,b,c){return function(){var d=aps.call(arguments,0),e;return c&&isFunction(e=d[d.length-1])&&(e.__requireJsBuild=!0),d.push(b),a.apply(null,d)}}function addRequireMethods(a,b,c){each([["toUrl"],["undef"],["defined","requireDefined"],["specified","requireSpecified"]],function(d){var e=d[1]||d[0];a[d[0]]=b?makeContextModuleFunc(b[e],c):function(){var a=contexts[defContextName];return a[e].apply(a,arguments)}})}function makeError(a,b,c,d){var e=new Error(b+"\nhttp://requirejs.org/docs/errors.html#"+a);return e.requireType=a,e.requireModules=d,c&&(e.originalError=c),e}function newContext(a){function p(a){var b,c;for(b=0;a[b];b+=1){c=a[b];if(c===".")a.splice(b,1),b-=1;else if(c===".."){if(b===1&&(a[2]===".."||a[0]===".."))break;b>0&&(a.splice(b-1,2),b-=2)}}}function q(a,b,c){var d,e,f,h,i,j,k,l,m,n,o,q=b&&b.split("/"),r=q,s=g.map,t=s&&s["*"];a&&a.charAt(0)==="."&&(b?(g.pkgs[b]?r=q=[b]:r=q.slice(0,q.length-1),a=r.concat(a.split("/")),p(a),e=g.pkgs[d=a[0]],a=a.join("/"),e&&a===d+"/"+e.main&&(a=d)):a.indexOf("./")===0&&(a=a.substring(2)));if(c&&(q||t)&&s){h=a.split("/");for(i=h.length;i>0;i-=1){k=h.slice(0,i).join("/");if(q)for(j=q.length;j>0;j-=1){f=s[q.slice(0,j).join("/")];if(f){f=f[k];if(f){l=f,m=i;break}}}if(l)break;!n&&t&&t[k]&&(n=t[k],o=i)}!l&&n&&(l=n,m=o),l&&(h.splice(0,m,l),a=h.join("/"))}return a}function r(a){isBrowser&&each(scripts(),function(b){if(b.getAttribute("data-requiremodule")===a&&b.getAttribute("data-requirecontext")===d.contextName)return b.parentNode.removeChild(b),!0})}function s(a){var b=g.paths[a];if(b&&isArray(b)&&b.length>1)return r(a),b.shift(),d.undef(a),d.require([a]),!0}function t(a,b,c,e){var f,g,h,i=a?a.indexOf("!"):-1,j=null,l=b?b.name:null,o=a,p=!0,r="";return a||(p=!1,a="_@r"+(m+=1)),i!==-1&&(j=a.substring(0,i),a=a.substring(i+1,a.length)),j&&(j=q(j,l,e),g=k[j]),a&&(j?g&&g.normalize?r=g.normalize(a,function(a){return q(a,l,e)}):r=q(a,l,e):(r=q(a,l,e),f=d.nameToUrl(r))),h=j&&!g&&!c?"_unnormalized"+(n+=1):"",{prefix:j,name:r,parentMap:b,unnormalized:!!h,url:f,originalName:o,isDefine:p,id:(j?j+"!"+r:r)+h}}function u(a){var b=a.id,c=h[b];return c||(c=h[b]=new d.Module(a)),c}function v(a,b,c){var d=a.id,e=h[d];hasProp(k,d)&&(!e||e.defineEmitComplete)?b==="defined"&&c(k[d]):u(a).on(b,c)}function w(a,b){var c=a.requireModules,d=!1;b?b(a):(each(c,function(b){var c=h[b];c&&(c.error=a,c.events.error&&(d=!0,c.emit("error",a)))}),d||req.onError(a))}function x(){globalDefQueue.length&&(apsp.apply(j,[j.length-1,0].concat(globalDefQueue)),globalDefQueue=[])}function y(a,b,c){var e=a&&a.map,f=makeContextModuleFunc(c||d.require,e,b);return addRequireMethods(f,d,e),f.isBrowser=isBrowser,f}function z(a){delete h[a],each(o,function(b,c){if(b.map.id===a)return o.splice(c,1),b.defined||(d.waitCount-=1),!0})}function A(a,b){var c=a.map.id,d=a.depMaps,e;if(!a.inited)return;return b[c]?a:(b[c]=!0,each(d,function(a){var d=a.id,f=h[d];if(!f)return;return!f.inited||!f.enabled?(e=null,delete b[c],!0):e=A(f,mixin({},b))}),e)}function B(a,b,c){var d=a.map.id,f=a.depMaps;if(!a.inited||!a.map.isDefine)return;return b[d]?k[d]:(b[d]=a,each(f,function(f){var g=f.id,i=h[g],j;if(e[g])return;if(i){if(!i.inited||!i.enabled){c[d]=!0;return}j=B(i,b,c),c[g]||a.defineDepById(g,j)}}),a.check(!0),k[d])}function C(a){a.check()}function D(){var a,c,e,i,j=g.waitSeconds*1e3,k=j&&d.startTime+j<(new Date).getTime(),l=[],m=!1,n=!0;if(b)return;b=!0,eachProp(h,function(b){a=b.map,c=a.id;if(!b.enabled)return;if(!b.error)if(!b.inited&&k)s(c)?(i=!0,m=!0):(l.push(c),r(c));else if(!b.inited&&b.fetched&&a.isDefine){m=!0;if(!a.prefix)return n=!1}});if(k&&l.length)return e=makeError("timeout","Load timeout for modules: "+l,null,l),e.contextName=d.contextName,w(e);n&&(each(o,function(a){if(a.defined)return;var b=A(a,{}),c={};b&&(B(b,c,{}),eachProp(c,C))}),eachProp(h,C)),(!k||i)&&m&&(isBrowser||isWebWorker)&&!f&&(f=setTimeout(function(){f=0,D()},50)),b=!1}function E(a){u(t(a[0],null,!0)).init(a[1],a[2])}function F(a,b,c,d){a.detachEvent&&!isOpera?d&&a.detachEvent(d,b):a.removeEventListener(c,b,!1)}function G(a){var b=a.currentTarget||a.srcElement;return F(b,d.onScriptLoad,"load","onreadystatechange"),F(b,d.onScriptError,"error"),{node:b,id:b&&b.getAttribute("data-requiremodule")}}var b,c,d,e,f,g={waitSeconds:7,baseUrl:"./",paths:{},pkgs:{},shim:{}},h={},i={},j=[],k={},l={},m=1,n=1,o=[];return e={require:function(a){return y(a)},exports:function(a){a.usingExports=!0;if(a.map.isDefine)return a.exports=k[a.map.id]={}},module:function(a){return a.module={id:a.map.id,uri:a.map.url,config:function(){return g.config&&g.config[a.map.id]||{}},exports:k[a.map.id]}}},c=function(a){this.events=i[a.id]||{},this.map=a,this.shim=g.shim[a.id],this.depExports=[],this.depMaps=[],this.depMatched=[],this.pluginMaps={},this.depCount=0},c.prototype={init:function(a,b,c,d){d=d||{};if(this.inited)return;this.factory=b,c?this.on("error",c):this.events.error&&(c=bind(this,function(a){this.emit("error",a)})),this.depMaps=a&&a.slice(0),this.depMaps.rjsSkipMap=a.rjsSkipMap,this.errback=c,this.inited=!0,this.ignore=d.ignore,d.enabled||this.enabled?this.enable():this.check()},defineDepById:function(a,b){var c;return each(this.depMaps,function(b,d){if(b.id===a)return c=d,!0}),this.defineDep(c,b)},defineDep:function(a,b){this.depMatched[a]||(this.depMatched[a]=!0,this.depCount-=1,this.depExports[a]=b)},fetch:function(){if(this.fetched)return;this.fetched=!0,d.startTime=(new Date).getTime();var a=this.map;if(!this.shim)return a.prefix?this.callPlugin():this.load();y(this,!0)(this.shim.deps||[],bind(this,function(){return a.prefix?this.callPlugin():this.load()}))},load:function(){var a=this.map.url;l[a]||(l[a]=!0,d.load(this.map.id,a))},check:function(a){if(!this.enabled||this.enabling)return;var b,c,e=this.map.id,f=this.depExports,g=this.exports,i=this.factory;if(!this.inited)this.fetch();else if(this.error)this.emit("error",this.error);else if(!this.defining){this.defining=!0;if(this.depCount<1&&!this.defined){if(isFunction(i)){if(this.events.error)try{g=d.execCb(e,i,f,g)}catch(j){b=j}else g=d.execCb(e,i,f,g);this.map.isDefine&&(c=this.module,c&&c.exports!==undefined&&c.exports!==this.exports?g=c.exports:g===undefined&&this.usingExports&&(g=this.exports));if(b)return b.requireMap=this.map,b.requireModules=[this.map.id],b.requireType="define",w(this.error=b)}else g=i;this.exports=g,this.map.isDefine&&!this.ignore&&(k[e]=g,req.onResourceLoad&&req.onResourceLoad(d,this.map,this.depMaps)),delete h[e],this.defined=!0,d.waitCount-=1,d.waitCount===0&&(o=[])}this.defining=!1,a||this.defined&&!this.defineEmitted&&(this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=!0)}},callPlugin:function(){var a=this.map,b=a.id,c=t(a.prefix,null,!1,!0);v(c,"defined",bind(this,function(c){var e,f,i,j=this.map.name,k=this.map.parentMap?this.map.parentMap.name:null;if(this.map.unnormalized){c.normalize&&(j=c.normalize(j,function(a){return q(a,k,!0)})||""),f=t(a.prefix+"!"+j,this.map.parentMap,!1,!0),v(f,"defined",bind(this,function(a){this.init([],function(){return a},null,{enabled:!0,ignore:!0})})),i=h[f.id],i&&(this.events.error&&i.on("error",bind(this,function(a){this.emit("error",a)})),i.enable());return}e=bind(this,function(a){this.init([],function(){return a},null,{enabled:!0})}),e.error=bind(this,function(a){this.inited=!0,this.error=a,a.requireModules=[b],eachProp(h,function(a){a.map.id.indexOf(b+"_unnormalized")===0&&z(a.map.id)}),w(a)}),e.fromText=function(a,b){var c=useInteractive;c&&(useInteractive=!1),u(t(a)),req.exec(b),c&&(useInteractive=!0),d.completeLoad(a)},c.load(a.name,y(a.parentMap,!0,function(a,b,c){return a.rjsSkipMap=!0,d.require(a,b,c)}),e,g)})),d.enable(c,this),this.pluginMaps[c.id]=c},enable:function(){this.enabled=!0,this.waitPushed||(o.push(this),d.waitCount+=1,this.waitPushed=!0),this.enabling=!0,each(this.depMaps,bind(this,function(a,b){var c,f,g;if(typeof a=="string"){a=t(a,this.map.isDefine?this.map:this.map.parentMap,!1,!this.depMaps.rjsSkipMap),this.depMaps[b]=a,g=e[a.id];if(g){this.depExports[b]=g(this);return}this.depCount+=1,v(a,"defined",bind(this,function(a){this.defineDep(b,a),this.check()})),this.errback&&v(a,"error",this.errback)}c=a.id,f=h[c],!e[c]&&f&&!f.enabled&&d.enable(a,this)})),eachProp(this.pluginMaps,bind(this,function(a){var b=h[a.id];b&&!b.enabled&&d.enable(a,this)})),this.enabling=!1,this.check()},on:function(a,b){var c=this.events[a];c||(c=this.events[a]=[]),c.push(b)},emit:function(a,b){each(this.events[a],function(a){a(b)}),a==="error"&&delete this.events[a]}},d={config:g,contextName:a,registry:h,defined:k,urlFetched:l,waitCount:0,defQueue:j,Module:c,makeModuleMap:t,configure:function(a){a.baseUrl&&a.baseUrl.charAt(a.baseUrl.length-1)!=="/"&&(a.baseUrl+="/");var b=g.pkgs,c=g.shim,e=g.paths,f=g.map;mixin(g,a,!0),g.paths=mixin(e,a.paths,!0),a.map&&(g.map=mixin(f||{},a.map,!0,!0)),a.shim&&(eachProp(a.shim,function(a,b){isArray(a)&&(a={deps:a}),a.exports&&!a.exports.__buildReady&&(a.exports=d.makeShimExports(a.exports)),c[b]=a}),g.shim=c),a.packages&&(each(a.packages,function(a){var c;a=typeof a=="string"?{name:a}:a,c=a.location,b[a.name]={name:a.name,location:c||a.name,main:(a.main||"main").replace(currDirRegExp,"").replace(jsSuffixRegExp,"")}}),g.pkgs=b),eachProp(h,function(a,b){!a.inited&&!a.map.unnormalized&&(a.map=t(b))}),(a.deps||a.callback)&&d.require(a.deps||[],a.callback)},makeShimExports:function(a){var b;return typeof a=="string"?(b=function(){return getGlobal(a)},b.exports=a,b):function(){return a.apply(global,arguments)}},requireDefined:function(a,b){return hasProp(k,t(a,b,!1,!0).id)},requireSpecified:function(a,b){return a=t(a,b,!1,!0).id,hasProp(k,a)||hasProp(h,a)},require:function(b,c,e,f){var g,h,i,l,m;if(typeof b=="string")return isFunction(c)?w(makeError("requireargs","Invalid require call"),e):req.get?req.get(d,b,c):(g=b,f=c,i=t(g,f,!1,!0),h=i.id,hasProp(k,h)?k[h]:w(makeError("notloaded",'Module name "'+h+'" has not been loaded yet for context: '+a)));e&&!isFunction(e)&&(f=e,e=undefined),c&&!isFunction(c)&&(f=c,c=undefined),x();while(j.length){m=j.shift();if(m[0]===null)return w(makeError("mismatch","Mismatched anonymous define() module: "+m[m.length-1]));E(m)}return l=u(t(null,f)),l.init(b,c,e,{enabled:!0}),D(),d.require},undef:function(a){x();var b=t(a,null,!0),c=h[a];delete k[a],delete l[b.url],delete i[a],c&&(c.events.defined&&(i[a]=c.events),z(a))},enable:function(a,b){var c=h[a.id];c&&u(a).enable()},completeLoad:function(a){var b,c,d,e=g.shim[a]||{},f=e.exports&&e.exports.exports;x();while(j.length){c=j.shift();if(c[0]===null){c[0]=a;if(b)break;b=!0}else c[0]===a&&(b=!0);E(c)}d=h[a];if(!b&&!k[a]&&d&&!d.inited){if(g.enforceDefine&&(!f||!getGlobal(f))){if(s(a))return;return w(makeError("nodefine","No define call for "+a,null,[a]))}E([a,e.deps||[],e.exports])}D()},toUrl:function(a,b){var c=a.lastIndexOf("."),e=null;return c!==-1&&(e=a.substring(c,a.length),a=a.substring(0,c)),d.nameToUrl(q(a,b&&b.id,!0),e)},nameToUrl:function(a,b){var c,d,e,f,h,i,j,k,l;if(req.jsExtRegExp.test(a))k=a+(b||"");else{c=g.paths,d=g.pkgs,h=a.split("/");for(i=h.length;i>0;i-=1){j=h.slice(0,i).join("/"),e=d[j],l=c[j];if(l){isArray(l)&&(l=l[0]),h.splice(0,i,l);break}if(e){a===e.name?f=e.location+"/"+e.main:f=e.location,h.splice(0,i,f);break}}k=h.join("/"),k+=b||(/\?/.test(k)?"":".js"),k=(k.charAt(0)==="/"||k.match(/^[\w\+\.\-]+:/)?"":g.baseUrl)+k}return g.urlArgs?k+((k.indexOf("?")===-1?"?":"&")+g.urlArgs):k},load:function(a,b){req.load(d,a,b)},execCb:function(a,b,c,d){return b.apply(d,c)},onScriptLoad:function(a){if(a.type==="load"||readyRegExp.test((a.currentTarget||a.srcElement).readyState)){interactiveScript=null;var b=G(a);d.completeLoad(b.id)}},onScriptError:function(a){var b=G(a);if(!s(b.id))return w(makeError("scripterror","Script error",a,[b.id]))}}}function getInteractiveScript(){return interactiveScript&&interactiveScript.readyState==="interactive"?interactiveScript:(eachReverse(scripts(),function(a){if(a.readyState==="interactive")return interactiveScript=a}),interactiveScript)}var req,s,head,baseElement,dataMain,src,interactiveScript,currentlyAddingScript,mainScript,subPath,version="2.0.5",commentRegExp=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,cjsRequireRegExp=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,jsSuffixRegExp=/\.js$/,currDirRegExp=/^\.\//,op=Object.prototype,ostring=op.toString,hasOwn=op.hasOwnProperty,ap=Array.prototype,aps=ap.slice,apsp=ap.splice,isBrowser=typeof window!="undefined"&&!!navigator&&!!document,isWebWorker=!isBrowser&&typeof importScripts!="undefined",readyRegExp=isBrowser&&navigator.platform==="PLAYSTATION 3"?/^complete$/:/^(complete|loaded)$/,defContextName="_",isOpera=typeof opera!="undefined"&&opera.toString()==="[object Opera]",contexts={},cfg={},globalDefQueue=[],useInteractive=!1;if(typeof define!="undefined")return;if(typeof requirejs!="undefined"){if(isFunction(requirejs))return;cfg=requirejs,requirejs=undefined}typeof require!="undefined"&&!isFunction(require)&&(cfg=require,require=undefined),req=requirejs=function(a,b,c,d){var e,f,g=defContextName;return!isArray(a)&&typeof a!="string"&&(f=a,isArray(b)?(a=b,b=c,c=d):a=[]),f&&f.context&&(g=f.context),e=contexts[g],e||(e=contexts[g]=req.s.newContext(g)),f&&e.configure(f),e.require(a,b,c)},req.config=function(a){return req(a)},require||(require=req),req.version=version,req.jsExtRegExp=/^\/|:|\?|\.js$/,req.isBrowser=isBrowser,s=req.s={contexts:contexts,newContext:newContext},req({}),addRequireMethods(req),isBrowser&&(head=s.head=document.getElementsByTagName("head")[0],baseElement=document.getElementsByTagName("base")[0],baseElement&&(head=s.head=baseElement.parentNode)),req.onError=function(a){throw a},req.load=function(a,b,c){var d=a&&a.config||{},e;if(isBrowser)return e=d.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script"),e.type=d.scriptType||"text/javascript",e.charset="utf-8",e.async=!0,e.setAttribute("data-requirecontext",a.contextName),e.setAttribute("data-requiremodule",b),e.attachEvent&&!(e.attachEvent.toString&&e.attachEvent.toString().indexOf("[native code")<0)&&!isOpera?(useInteractive=!0,e.attachEvent("onreadystatechange",a.onScriptLoad)):(e.addEventListener("load",a.onScriptLoad,!1),e.addEventListener("error",a.onScriptError,!1)),e.src=c,currentlyAddingScript=e,baseElement?head.insertBefore(e,baseElement):head.appendChild(e),currentlyAddingScript=null,e;isWebWorker&&(importScripts(c),a.completeLoad(b))},isBrowser&&eachReverse(scripts(),function(a){head||(head=a.parentNode),dataMain=a.getAttribute("data-main");if(dataMain)return cfg.baseUrl||(src=dataMain.split("/"),mainScript=src.pop(),subPath=src.length?src.join("/")+"/":"./",cfg.baseUrl=subPath,dataMain=mainScript),dataMain=dataMain.replace(jsSuffixRegExp,""),cfg.deps=cfg.deps?cfg.deps.concat(dataMain):[dataMain],!0}),define=function(a,b,c){var d,e;typeof a!="string"&&(c=b,b=a,a=null),isArray(b)||(c=b,b=[]),!b.length&&isFunction(c)&&c.length&&(c.toString().replace(commentRegExp,"").replace(cjsRequireRegExp,function(a,c){b.push(c)}),b=(c.length===1?["require"]:["require","exports","module"]).concat(b)),useInteractive&&(d=currentlyAddingScript||getInteractiveScript(),d&&(a||(a=d.getAttribute("data-requiremodule")),e=contexts[d.getAttribute("data-requirecontext")])),(e?e.defQueue:globalDefQueue).push([a,b,c])},define.amd={jQuery:!0},req.exec=function(text){return eval(text)},req(cfg)})(this),function(){define("data",[],function(){function d(a){var b=NaN;if(a){var c=a.replace(/[^\d\.\-\ ]/g,"");b=parseFloat(c)}return b}function e(e,f){var g=[2007,2008,2009,2010],h=[],i=[],j={},k={},l={},m=0,n=[];for(var o=0;o<e.length;o++){var p=e[o],q=p.Year,r=p.Locale;if(r==="National")n.push(p);else{var s=_.find(f,function(a){return a.stateAbbr===r}),t=+s.code,u=s.name;for(var v in p)if(v!=="Year"&&v!=="Locale"){var w=d(p[v]);if(!_.contains(i,v)){var x={name:v,id:m,values:[{year:q,indicatorId:m,indicator:v,locales:[{id:t,name:u,value:w}]}]},y=h.push(x);j[v]=y-1,i.push(v),k[v]=[q],l[v]={},l[v][q]=0,a.push({id:m,name:v}),m++}else if(!_.contains(k[v],q)){var z=h[j[v]].values.push({year:q,indicatorId:_.find(a,function(a){return a.name===v}).id,indicator:v,locales:[{id:t,name:u,value:w}]});k[v].push(q),l[v][q]=z-1}else{var A=h[j[v]].values,B=A[l[v][q]];B.locales.push({id:t,name:u,value:w})}}}}_.each(n,function(c){for(var e in c){var f=c.Year,g=d(c[e]);if(e!=="Year"&&e!=="Locale"){var h=_.find(a,function(a){return a.name===e}).id;b[h]||(b[h]={}),b[h][f]=g}}});var C=d3.range(9).map(function(a){return"q"+a});return _.each(h,function(a){var d=a.id;_.each(a.values,function(a){var e=a.year,f=d3.min(a.locales,function(a){return a.value}),g=d3.max(a.locales,function(a){return a.value}),h=b[d][e],i=d3.scale.quantile().range(C).domain([f,h,g]);c[d]||(c[d]={}),c[d][e]=i})}),h}var a=[],b={},c={};return{buildNestedData:e,scales:c}}),define("app",["data"],function(a){function k(b,c,i,j){d=c;var k=a.buildNestedData(i,d);e=topojson.object(j,j.objects.states).geometries,f=topojson.mesh(j,j.objects.states,function(a,b){return a.id!==b.id});var m=d3.select("#previews").selectAll(".row").data(k).enter().append("div").attr("class","row");m.each(l),$(".rowLabel").tipsy({gravity:"s",fade:!0,delayIn:500}),$(".mapLocale").tipsy({gravity:$.fn.tipsy.autoNS,html:!0}),g.stop(),console.log("Total load time: "+(Date.now()-h)/1e3+" seconds.")}function l(a,d){var e=d3.select(this),f=a.name.length>90?a.name.substr(0,90)+" ...":a.name;e.append("div").attr("class","rowLabel").attr("title",a.name).html(f);var g=e.selectAll(".preview").data(a.values).enter().append("div").attr("class",function(a){return"indicator-"+ +a.id+" preview"}).style("width",b).style("height",c),h=g.append("svg").attr("width",b).attr("height",c),i=h.append("g");i.each(m)}function m(d,g){var h={};_.each(d.locales,function(a){h[+a.id]=+a.value});var i=d3.format(","),k=a.scales[d.indicatorId][d.year],l=d3.select(this);l.append("rect").attr("width",b).attr("height",c).attr("class","mapBg");var m=l.append("g");m.append("text").text(function(a){return d.year}).attr("class","mapTitle").attr("text-anchor","middle").attr("x",b/2).attr("dy","1.3em"),m.selectAll("path").data(e).enter().append("path").attr("d",j).attr("data-indicator",d.indicator).attr("data-indicator-id",d.indicatorId).attr("data-year",d.year).attr("class",function(a){var b=k(h[+a.id]);return"mapLocale indicator-"+d.indicatorId+"-locale-"+ +a.id+" "+(typeof b!==undefined?b:"")}).attr("title",function(a){var b=_.find(d.locales,function(b){return a.id===b.id}),c=k.domain();return"<big><strong>"+b.name+" &raquo; "+i(b.value)+"</strong></big><br />"+"min: "+c[0]+" / avg: "+c[1]+" / max: "+c[2]+"<br />"+"<small>"+d.indicator+"</small>"}).on("mouseover",function(a){var b=d3.select(this).attr("data-indicator-id");n("over",b,+a.id)}).on("mouseout",function(a){var b=d3.select(this).attr("data-indicator-id");n("out",b,+a.id)}),m.append("path").datum(f).attr("d",j).attr("class","mapLocaleBoundary")}function n(a,b,c){d3.selectAll(".indicator-"+b+"-locale-"+c).style("fill",a==="over"?"#b0d912":null)}var b=190,c=135,d,e,f,g=new Spinner({top:100,radius:15,length:16,width:6}),h=Date.now(),i=d3.geo.albersUsa().scale(b+20).translate([(b+20)/2,c/2+10]),j=d3.geo.path().projection(i);g.spin(document.getElementById("vis")),queue().defer(d3.json,"data/state-codes.json").defer(d3.csv,"data/states-2007-2010-trimmed.csv").defer(d3.json,"data/us-small.json").await(k)}),require.config({shim:{},paths:{hm:"vendor/hm",esprima:"vendor/esprima"}}),require(["app"],function(a){console.log(a)}),define("main",function(){})}();