import{c as E,s as V,n as z,d as K,e as Q,u as W,g as X,f as Y,h as Z}from"../chunks/scheduler.EpWGcs72.js";import{S as q,i as M,g as p,h as b,j as y,f as _,k as v,l as u,a as g,x,y as w,s as $,e as S,c as ee,d as m,t as h,b as j,r as te,u as ne,v as ae,w as se,z as ie,A as oe,B as le,p as D}from"../chunks/index.vVMILz9O.js";import{e as N}from"../chunks/each.IVg80KZZ.js";import{k as P}from"../chunks/singletons.jeDsdSwJ.js";import{u as re}from"../chunks/user_config.VJ0jylsq.js";const fe=({url:n})=>{const{pathname:e}=n;return{pathname:e}},Ie=Object.freeze(Object.defineProperty({__proto__:null,load:fe},Symbol.toStringTag,{value:"Module"}));function ue(n){return n*n*n}function R(n){const e=n-1;return e*e*e+1}function O(n,{delay:e=0,duration:a=400,easing:t=R,x:l=0,y:s=0,opacity:i=0}={}){const o=getComputedStyle(n),r=+o.opacity,f=o.transform==="none"?"":o.transform,d=r*(1-i),[c,T]=E(l),[G,H]=E(s);return{delay:e,duration:a,easing:t,css:(I,J)=>`
			transform: ${f} translate(${(1-I)*c}${T}, ${(1-I)*G}${H});
			opacity: ${r-d*J}`}}const ce=(n,e)=>{if(n[0]==="#"&&(n=n.slice(1)),n.length===3){let t="";n.split("").forEach(l=>{t+=l,t+=l}),n=t}return`rgba(${(n.match(/.{2}/g)||[]).map(t=>parseInt(t,16)).join(", ")}, ${e})`},L=(n,e=0)=>[...Array(n).keys()].map(a=>a+e);function A(n,e,a){const t=n.slice();return t[6]=e[a],t}function B(n){let e;return{c(){e=p("div"),this.h()},l(a){e=b(a,"DIV",{class:!0,style:!0}),y(e).forEach(_),this.h()},h(){v(e,"class","lines small-lines "+n[6]+" svelte-bnawe9"),u(e,"--color",n[0]),u(e,"--duration",n[2]),w(e,"pause-animation",n[4])},m(a,t){g(a,e,t)},p(a,t){t&1&&u(e,"--color",a[0]),t&4&&u(e,"--duration",a[2]),t&16&&w(e,"pause-animation",a[4])},d(a){a&&_(e)}}}function _e(n){let e,a=N(L(2,1)),t=[];for(let l=0;l<a.length;l+=1)t[l]=B(A(n,a,l));return{c(){e=p("div");for(let l=0;l<t.length;l+=1)t[l].c();this.h()},l(l){e=b(l,"DIV",{class:!0,style:!0});var s=y(e);for(let i=0;i<t.length;i+=1)t[i].l(s);s.forEach(_),this.h()},h(){v(e,"class","wrapper svelte-bnawe9"),u(e,"--size",n[3]+n[1]),u(e,"--rgba",n[5])},m(l,s){g(l,e,s);for(let i=0;i<t.length;i+=1)t[i]&&t[i].m(e,null)},p(l,[s]){if(s&21){a=N(L(2,1));let i;for(i=0;i<a.length;i+=1){const o=A(l,a,i);t[i]?t[i].p(o,s):(t[i]=B(o),t[i].c(),t[i].m(e,null))}for(;i<t.length;i+=1)t[i].d(1);t.length=a.length}s&10&&u(e,"--size",l[3]+l[1]),s&32&&u(e,"--rgba",l[5])},i:z,o:z,d(l){l&&_(e),x(t,l)}}}function me(n,e,a){let{color:t="#FF3E00"}=e,{unit:l="px"}=e,{duration:s="2.1s"}=e,{size:i="60"}=e,{pause:o=!1}=e,r;return n.$$set=f=>{"color"in f&&a(0,t=f.color),"unit"in f&&a(1,l=f.unit),"duration"in f&&a(2,s=f.duration),"size"in f&&a(3,i=f.size),"pause"in f&&a(4,o=f.pause)},n.$$.update=()=>{n.$$.dirty&1&&a(5,r=ce(t,.2))},[t,l,s,i,o,r]}class de extends q{constructor(e){super(),M(this,e,me,_e,V,{color:0,unit:1,duration:2,size:3,pause:4})}}const he=P("before_navigate"),ge=P("after_navigate");function C(n){let e,a;return e=new de({}),{c(){te(e.$$.fragment)},l(t){ne(e.$$.fragment,t)},m(t,l){ae(e,t,l),a=!0},i(t){a||(m(e.$$.fragment,t),a=!0)},o(t){h(e.$$.fragment,t),a=!1},d(t){se(e,t)}}}function F(n){let e,a,t,l,s;const i=n[6].default,o=Q(i,n,n[5],null);return{c(){e=p("div"),a=p("div"),o&&o.c(),this.h()},l(r){e=b(r,"DIV",{class:!0});var f=y(e);a=b(f,"DIV",{style:!0,class:!0});var d=y(a);o&&o.l(d),d.forEach(_),f.forEach(_),this.h()},h(){u(a,"font-family",n[2].font,1),u(a,"font-size",n[2].font_size+"px",1),v(a,"class","svelte-xgivsu"),v(e,"class","svelte-xgivsu")},m(r,f){g(r,e,f),ie(e,a),o&&o.m(a,null),s=!0},p(r,f){n=r,o&&o.p&&(!s||f&32)&&W(o,i,n,n[5],s?Y(i,n[5],f,null):X(n[5]),null),(!s||f&4)&&u(a,"font-family",n[2].font,1),(!s||f&4)&&u(a,"font-size",n[2].font_size+"px",1)},i(r){s||(m(o,r),Z(()=>{s&&(l&&l.end(1),t=oe(e,O,n[3]),t.start())}),s=!0)},o(r){h(o,r),t&&t.invalidate(),l=le(e,O,n[4]),s=!1},d(r){r&&_(e),o&&o.d(r),r&&l&&l.end()}}}function pe(n){let e,a=n[0].pathname,t,l,s=n[1]&&C(),i=F(n);return{c(){s&&s.c(),e=$(),i.c(),t=S()},l(o){s&&s.l(o),e=ee(o),i.l(o),t=S()},m(o,r){s&&s.m(o,r),g(o,e,r),i.m(o,r),g(o,t,r),l=!0},p(o,[r]){o[1]?s?r&2&&m(s,1):(s=C(),s.c(),m(s,1),s.m(e.parentNode,e)):s&&(D(),h(s,1,1,()=>{s=null}),j()),r&1&&V(a,a=o[0].pathname)?(D(),h(i,1,1,z),j(),i=F(o),i.c(),m(i,1),i.m(t.parentNode,t)):i.p(o,r)},i(o){l||(m(s),m(i),l=!0)},o(o){h(s),h(i),l=!1},d(o){o&&(_(e),_(t)),s&&s.d(o),i.d(o)}}}const k=300,U=10;function be(n,e,a){let t;K(n,re,c=>a(2,t=c));let{$$slots:l={},$$scope:s}=e,i=!1;he(({to:c})=>a(1,i=!!c?.route.id)),ge(()=>a(1,i=!1));let{data:o}=e;const r=k+100,f={easing:R,y:U,duration:k,delay:r},d={easing:ue,y:-U,duration:k};return n.$$set=c=>{"data"in c&&a(0,o=c.data),"$$scope"in c&&a(5,s=c.$$scope)},[o,i,t,f,d,s,l]}class Ee extends q{constructor(e){super(),M(this,e,be,pe,V,{data:0})}}export{Ee as component,Ie as universal};
