import{s as $,n as y,d as S}from"./scheduler.EpWGcs72.js";import{S as q,i as C,e as g,a as N,f as d,g as u,m as k,s as D,h as _,j as b,n as w,c as H,k as j,z as c,o as x}from"./index.vVMILz9O.js";import{w as I}from"./index.QmuqCeFS.js";const z=I(null);function E(s){let a,e,t=s[0].title+"",i,r,n,f=s[0].message+"",m,p;return{c(){a=u("div"),e=u("h3"),i=k(t),r=D(),n=u("p"),m=k(f),this.h()},l(l){a=_(l,"DIV",{class:!0});var o=b(a);e=_(o,"H3",{});var h=b(e);i=w(h,t),h.forEach(d),r=H(o),n=_(o,"P",{});var v=b(n);m=w(v,f),v.forEach(d),o.forEach(d),this.h()},h(){j(a,"class",p="w-10/12 relative top-0 left-0 flex flex-col justify-center items-center p-2 m-4 rounded-lg z-50 mx-auto "+s[1][s[0].type])},m(l,o){N(l,a,o),c(a,e),c(e,i),c(a,r),c(a,n),c(n,m)},p(l,o){o&1&&t!==(t=l[0].title+"")&&x(i,t),o&1&&f!==(f=l[0].message+"")&&x(m,f),o&1&&p!==(p="w-10/12 relative top-0 left-0 flex flex-col justify-center items-center p-2 m-4 rounded-lg z-50 mx-auto "+l[1][l[0].type])&&j(a,"class",p)},d(l){l&&d(a)}}}function P(s){let a,e=s[0]&&E(s);return{c(){e&&e.c(),a=g()},l(t){e&&e.l(t),a=g()},m(t,i){e&&e.m(t,i),N(t,a,i)},p(t,[i]){t[0]?e?e.p(t,i):(e=E(t),e.c(),e.m(a.parentNode,a)):e&&(e.d(1),e=null)},i:y,o:y,d(t){t&&d(a),e&&e.d(t)}}}function T(s,a,e){let t;S(s,z,r=>e(0,t=r));let i={error:"bg-black border border-red-400 text-red-700",info:"bg-black border border-blue-400 text-blue-700"};return s.$$.update=()=>{s.$$.dirty&1&&t?.duration&&setTimeout(()=>{z.set(null)},t.duration)},[t,i]}class F extends q{constructor(a){super(),C(this,a,T,P,$,{})}}export{F as N,z as n};