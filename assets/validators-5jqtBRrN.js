import{j as r,p as i,q as d,r as l,A as c,R as m}from"./index-6cAbl0Yg.js";function x(){return r.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-6 h-6",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 4.5v15m7.5-7.5h-15"})})}var p=i();const a=d(p),g=({children:t,onClose:e,width:s,disableOverlayOnClose:o=!1})=>{const{darkMode:n}=l.useContext(c);return m.createPortal(r.jsxs(r.Fragment,{children:[r.jsx("div",{className:"overlay",onClick:()=>!o&&e()}),r.jsx("div",{className:`modal ${n?"dark":"light"}`,style:{maxWidth:s?`${s}px`:"auto"},children:t})]}),document.getElementById("portal"))},j=t=>!!t.match(/^\+[1-9]\d{10,14}$/),y=t=>typeof t=="string"&&t.trim().length>0,h=t=>typeof t=="string",f=t=>typeof t=="number",M=t=>typeof t=="string"&&a(t,"YYYY-MM-DD",!0).isValid(),V=t=>typeof t=="string"&&a(t,"YYYY-MM-DD HH:mm",!0).isValid(),D=t=>!!/^\d+$/.test(t);export{x as A,g as M,M as a,V as b,h as c,a as d,f as n,D as o,j as p,y as s};
