var e=Object.defineProperty,n=Object.prototype.hasOwnProperty,l=Object.getOwnPropertySymbols,o=Object.prototype.propertyIsEnumerable,a=(n,l,o)=>l in n?e(n,l,{enumerable:!0,configurable:!0,writable:!0,value:o}):n[l]=o,i=(e,i)=>{for(var s in i||(i={}))n.call(i,s)&&a(e,s,i[s]);if(l)for(var s of l(i))o.call(i,s)&&a(e,s,i[s]);return e};import{d as s,r as t,a as r,c,w as u,b as d,o as m,e as v,n as g,f as w,g as p,h as _,T as f,i as h,v as b,j as k,k as y,F as I,l as x,m as C,p as O,q as A,s as z,t as M,u as S,x as L}from"./vendor.643a0951.js";!function(e=".",n="__import__"){try{self[n]=new Function("u","return import(u)")}catch(l){const o=new URL(e,location),a=e=>{URL.revokeObjectURL(e.src),e.remove()};self[n]=e=>new Promise(((l,i)=>{const s=new URL(e,o);if(self[n].moduleMap[s])return l(self[n].moduleMap[s]);const t=new Blob([`import * as m from '${s}';`,`${n}.moduleMap['${s}']=m;`],{type:"text/javascript"}),r=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(t),onerror(){i(new Error(`Failed to import: ${e}`)),a(r)},onload(){l(self[n].moduleMap[s]),a(r)}});document.head.appendChild(r)})),self[n].moduleMap={}}}("/assets/");const j="undefined"==typeof window,E=(e,n,l,o=!1)=>{!j&&e&&n&&l&&e.addEventListener(n,l,o)},$=(e,n,l,o=!1)=>{!j&&e&&n&&l&&e.removeEventListener(n,l,o)};function N(e){let n=!1;return function(...l){n||(n=!0,window.requestAnimationFrame((()=>{e.apply(this,l),n=!1})))}}const R={CONTAIN:{name:"contain",icon:"img-viewr__icon icon__full-screen"},ORIGINAL:{name:"original",icon:"img-viewr__icon icon__scale-to-original"}},D=!j&&window.navigator.userAgent.match(/firefox/i)?"DOMMouseScroll":"mousewheel",T="Escape",F="ArrowLeft",H="ArrowUp",B="ArrowRight",U="ArrowDown",X="Space";var Y=s({props:{visible:{type:Boolean,default:!1},urls:{type:Array,default:()=>[]},zIndex:{type:Number,default:3e3},initialIndex:{type:Number,default:0},lockScroll:{type:Boolean,default:!0},closeOnClickMask:{type:Boolean,default:!0}},emits:["close","switch"],setup(e,{emit:n}){const l=t(0),o=t(3e3),a=t(!0),s=t(!0),w=t(!1),p=t([]),_=t(null),f=t(null),h=t(0),b=t(!0),k=t(!1),y=r(i({},R.CONTAIN)),I=r({scale:1,deg:0,offsetX:0,offsetY:0,enableTransition:!1}),x=t(null),C=t(null),O=c((()=>p.value.length<=1)),A=c((()=>0===h.value)),z=c((()=>h.value===p.value.length-1)),M=c((()=>p.value[h.value]||p.value[0])),S=c((()=>{const{scale:e,deg:n,offsetX:l,offsetY:o,enableTransition:a}=I,i={transform:`scale(${e}) rotate(${n}deg)`,transition:a?"transform .3s":"","margin-left":`${l}px`,"margin-top":`${o}px`};return y.name===R.CONTAIN.name&&(i.maxWidth=i.maxHeight="100%"),i}));u((()=>{e.urls.length&&(p.value=e.urls,l.value=e.initialIndex,o.value=e.zIndex,a.value=e.lockScroll,s.value=e.closeOnClickMask)})),d((()=>e.visible),(e=>{w.value=e})),d(l,(e=>{e!==h.value&&(h.value=e)})),d(w,(e=>{if(!a.value)return;let n=document.body.className;e?n.includes("img-viewr__body-lock")||(n+=" img-viewr__body-lock"):n=n.replace("img-viewr__body-lock",""),document.body.className=n.trim()})),d(h,(e=>{var l;V(),null==(l=f.value)||l.call(f,e),n("switch",e)})),d(M,(()=>{g((()=>{const e=C.value;e&&e.complete||(k.value=!0)}))}));const L=()=>{var e;null==(e=_.value)||e.call(_),n("close")};let j,Y,P;const V=()=>{I.scale=1,I.deg=0,I.offsetX=0,I.offsetY=0,I.enableTransition=!1},W=()=>{if(k.value)return;const e=Object.keys(R),n=(Object.values(R).findIndex((({name:e})=>e===y.name))+1)%e.length,{name:l,icon:o}=R[e[n]];y.name=l,y.icon=o,V()},q=()=>{if(A.value&&!b.value)return;const e=p.value.length;h.value=(h.value-1+e)%e},J=()=>{if(z.value&&!b.value)return;const e=p.value.length;h.value=(h.value+1)%e},G=(e,n={})=>{if(k.value)return;const{zoomRate:l,rotateDeg:o,enableTransition:a}=i({zoomRate:.2,rotateDeg:90,enableTransition:!0},n);switch(e){case"zoomOut":I.scale>.2&&(I.scale=parseFloat((I.scale-l).toFixed(3)));break;case"zoomIn":I.scale=parseFloat((I.scale+l).toFixed(3));break;case"clocelise":I.deg+=o;break;case"anticlocelise":I.deg-=o;break;case"download":((e,n,l)=>{const o=new Image,a=document.createElement("canvas"),i=a.getContext("2d"),s=document.createElement("a");o.setAttribute("crossOrigin","anonymous"),o.src=e,o.onerror=()=>{window.open(e)},o.onload=()=>{a.width=o.width,a.height=o.height,null==i||i.drawImage(o,0,0,o.width,o.height),s.setAttribute("href",a.toDataURL(`image/${l}`)),s.setAttribute("target","_blank"),s.setAttribute("download",`${n}.${l}`),s.click()}})(M.value,Date.now().toString(),"png")}I.enableTransition=a};return m((()=>{var e,n;j=N((e=>{switch(e.code){case T:L();break;case X:W();break;case F:q();break;case H:G("zoomIn");break;case B:J();break;case U:G("zoomOut")}})),Y=N((e=>{const n=e.wheelDelta?e.wheelDelta:-e.detail;G(n>0?"zoomIn":"zoomOut",{zoomRate:.05,enableTransition:!1})})),E(document,"keydown",j),E(document,D,Y),null==(n=null==(e=null==x?void 0:x.value)?void 0:e.focus)||n.call(e)})),v((()=>{j&&$(document,"keydown",j),Y&&$(document,D,Y),j=null,Y=null})),{images:p,isShow:w,initIndex:l,zIndexNum:o,isLockScroll:a,isCloseOnClickMask:s,imgViewrWrapper:x,imageRef:C,index:h,isSingle:O,infinite:b,isFirst:A,isLast:z,mode:y,currentImg:M,imgStyle:S,closeHandle:_,switchHandle:f,hide:L,prev:q,next:J,toggleMode:W,handleActions:G,handleMaskClick:()=>{s.value&&L()},handleImgLoad:()=>{k.value=!1},handleImgError:()=>{k.value=!1;const e=C.value;e&&(e.alt="加载失败")},handleMouseDown:e=>{if(k.value||0!==e.button)return;const{offsetX:n,offsetY:l}=I,o=e.pageX,a=e.pageY;P=N((e=>{I.offsetX=n+e.pageX-o,I.offsetY=l+e.pageY-a})),E(document,"mousemove",P),E(document,"mouseup",(()=>{P&&$(document,"mousemove",P)})),e.preventDefault()}}}});const P=k("i",{class:"img-viewr__icon icon__circle-close"},null,-1),V=k("i",{class:"img-viewr__icon icon__arrow-left"},null,-1),W=k("i",{class:"img-viewr__icon icon__arrow-right"},null,-1),q={class:"img-viewr__btn img-viewr__actions"},J={class:"img-viewr__actions__inner"},G=k("i",{class:"img-viewr__actions__divider"},null,-1),K=k("i",{class:"img-viewr__actions__divider"},null,-1),Q=k("i",{class:"img-viewr__actions__divider"},null,-1),Z={class:"img-viewr__canvas"};Y.render=function(e,n,l,o,a,i){return p(),w(f,{name:"img-viewr-fade"},{default:_((()=>[h(k("div",{tabindex:"-1",ref:"imgViewrWrapper",class:"img-viewr__wrapper",style:`z-index: ${e.zIndexNum}`},[k("div",{class:"img-viewr__mask",onClick:n[1]||(n[1]=y(((...n)=>e.handleMaskClick&&e.handleMaskClick(...n)),["self"]))}),k("span",{class:"img-viewr__btn img-viewr__close",onClick:n[2]||(n[2]=(...n)=>e.hide&&e.hide(...n))},[P]),e.isSingle?x("",!0):(p(),w(I,{key:0},[k("span",{class:["img-viewr__btn img-viewr__prev",{"is-disabled":!e.infinite&&e.isFirst}],onClick:n[3]||(n[3]=(...n)=>e.prev&&e.prev(...n))},[V],2),k("span",{class:["img-viewr__btn img-viewr__next",{"is-disabled":!e.infinite&&e.isLast}],onClick:n[4]||(n[4]=(...n)=>e.next&&e.next(...n))},[W],2)],64)),k("div",q,[k("div",J,[k("i",{class:"img-viewr__icon icon__zoom-out",onClick:n[5]||(n[5]=n=>e.handleActions("zoomOut"))}),k("i",{class:"img-viewr__icon icon__zoom-in",onClick:n[6]||(n[6]=n=>e.handleActions("zoomIn"))}),G,k("i",{class:e.mode.icon,onClick:n[7]||(n[7]=(...n)=>e.toggleMode&&e.toggleMode(...n))},null,2),K,k("i",{class:"img-viewr__icon icon__download-image",onClick:n[8]||(n[8]=n=>e.handleActions("download"))}),Q,k("i",{class:"img-viewr__icon icon__refresh-left",onClick:n[9]||(n[9]=n=>e.handleActions("anticlocelise"))}),k("i",{class:"img-viewr__icon icon__refresh-right",onClick:n[10]||(n[10]=n=>e.handleActions("clocelise"))})])]),k("div",Z,[(p(!0),w(I,null,C(e.images,((l,o)=>(p(),w(I,null,[o===e.index?(p(),w("img",{class:"img-viewr__img",ref:"imageRef",key:l,src:e.currentImg,style:e.imgStyle,onLoad:n[11]||(n[11]=(...n)=>e.handleImgLoad&&e.handleImgLoad(...n)),onError:n[12]||(n[12]=(...n)=>e.handleImgError&&e.handleImgError(...n)),onMousedown:n[13]||(n[13]=(...n)=>e.handleMouseDown&&e.handleMouseDown(...n))},null,44,["src"])):x("",!0)],64)))),256))])],4),[[b,e.isShow]])])),_:1})};const ee="undefined"==typeof window;let ne;const le=e=>{var n,l,o,a,i;if(ee)return;if(!(e.urls&&e.urls.length>0))throw new Error("At least one picture in urls array!");ne||(()=>{const e=document.createElement("div"),n=k(Y,{});n&&n.props&&(n.props.onDestroy=()=>{O(null,e)}),O(n,e),ne=n,e.firstElementChild&&document.body.appendChild(e.firstElementChild)})();const s=null==(n=null==ne?void 0:ne.component)?void 0:n.proxy;s.images=e.urls,s.initIndex=null!=(l=e.index)?l:0,s.zIndexNum=null!=(o=e.zIndex)?o:3e3,s.isLockScroll=null==(a=e.lockScroll)||a,s.isCloseOnClickMask=null==(i=e.closeOnClickMask)||i,s.closeHandle=()=>{var n;s.isShow=!1,null==(n=e.onClose)||n.call(e)},s.switchHandle=n=>{var l;null==(l=e.onSwitch)||l.call(e,n)},setTimeout((()=>{s.isShow=!0}),0)};const oe=["https://s.gravatar.com/avatar/221f86a573320174bad7a62886a6d4b4?size=100&default=retro","https://s.gravatar.com/avatar/221f86a573320174bad7a62886a6d4b4","https://static.npmjs.com/attachments/ck3uwf5d872zb8874c3ayi1pj-icon-pro-wombat-3x.png"];var ae={name:"App",setup(){const e=t(oe),n=t(0),l=t(!1),o=e=>{console.log(`current image index: ${e}`)};return{urls:e,index:n,visible:l,showImagesByComponent:e=>{l.value=!0,n.value=e},showImagesByJs:e=>{le({urls:oe,index:e,onSwitch:o,onClose:()=>{console.log("close with js")}})},closeHandle:()=>{console.log("close component"),l.value=!1},changeHandle:o}}};const ie=S();A("data-v-34c17cde");const se=k("h3",null,"通过组件方式",-1),te={class:"imgs"},re=k("h3",null,"通过js方法调用",-1),ce={class:"imgs"};z();const ue=ie(((e,n,l,o,a,i)=>{const s=M("ImgViewr");return p(),w("div",null,[se,k("div",te,[(p(!0),w(I,null,C(o.urls,((e,n)=>(p(),w("div",{class:"img",key:`c_${n}`,onClick:()=>o.showImagesByComponent(n)},[k("img",{src:e},null,8,["src"])],8,["onClick"])))),128))]),k(s,{visible:o.visible,urls:o.urls,"initial-index":o.index,onClose:o.closeHandle,onSwitch:o.changeHandle},null,8,["visible","urls","initial-index","onClose","onSwitch"]),re,k("div",ce,[(p(!0),w(I,null,C(o.urls,((e,n)=>(p(),w("div",{class:"img",key:n,onClick:()=>o.showImagesByJs(n)},[k("img",{src:e},null,8,["src"])],8,["onClick"])))),128))])])}));ae.render=ue,ae.__scopeId="data-v-34c17cde";const de=L(ae);de.config.globalProperties.$showImages=le,de.component("ImgViewr",Y),de.mount("#app");
