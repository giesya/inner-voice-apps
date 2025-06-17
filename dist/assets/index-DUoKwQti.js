(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();class G{constructor(e="https://story-api.dicoding.dev/v1"){this.apiBase=e}async getStories(){const e=localStorage.getItem("token");return e?await(await fetch(`${this.apiBase}/stories?page=1&size=20&location=1`,{headers:{Authorization:"Bearer "+e}})).json():{error:!0,message:"Silakan login terlebih dahulu untuk melihat cerita."}}}const J=(i,e)=>e.some(t=>i instanceof t);let P,O;function Y(){return P||(P=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Q(){return O||(O=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const H=new WeakMap,M=new WeakMap,N=new WeakMap,B=new WeakMap,A=new WeakMap;function X(i){const e=new Promise((t,a)=>{const n=()=>{i.removeEventListener("success",o),i.removeEventListener("error",r)},o=()=>{t(p(i.result)),n()},r=()=>{a(i.error),n()};i.addEventListener("success",o),i.addEventListener("error",r)});return e.then(t=>{t instanceof IDBCursor&&H.set(t,i)}).catch(()=>{}),A.set(e,i),e}function Z(i){if(M.has(i))return;const e=new Promise((t,a)=>{const n=()=>{i.removeEventListener("complete",o),i.removeEventListener("error",r),i.removeEventListener("abort",r)},o=()=>{t(),n()},r=()=>{a(i.error||new DOMException("AbortError","AbortError")),n()};i.addEventListener("complete",o),i.addEventListener("error",r),i.addEventListener("abort",r)});M.set(i,e)}let D={get(i,e,t){if(i instanceof IDBTransaction){if(e==="done")return M.get(i);if(e==="objectStoreNames")return i.objectStoreNames||N.get(i);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return p(i[e])},set(i,e,t){return i[e]=t,!0},has(i,e){return i instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in i}};function ee(i){D=i(D)}function te(i){return i===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const a=i.call(T(this),e,...t);return N.set(a,e.sort?e.sort():[e]),p(a)}:Q().includes(i)?function(...e){return i.apply(T(this),e),p(H.get(this))}:function(...e){return p(i.apply(T(this),e))}}function ie(i){return typeof i=="function"?te(i):(i instanceof IDBTransaction&&Z(i),J(i,Y())?new Proxy(i,D):i)}function p(i){if(i instanceof IDBRequest)return X(i);if(B.has(i))return B.get(i);const e=ie(i);return e!==i&&(B.set(i,e),A.set(e,i)),e}const T=i=>A.get(i);function ae(i,e,{blocked:t,upgrade:a,blocking:n,terminated:o}={}){const r=indexedDB.open(i,e),s=p(r);return a&&r.addEventListener("upgradeneeded",l=>{a(p(r.result),l.oldVersion,l.newVersion,p(r.transaction),l)}),t&&r.addEventListener("blocked",l=>t(l.oldVersion,l.newVersion,l)),s.then(l=>{o&&l.addEventListener("close",()=>o()),n&&l.addEventListener("versionchange",c=>n(c.oldVersion,c.newVersion,c))}).catch(()=>{}),s}const ne=["get","getKey","getAll","getAllKeys","count"],oe=["put","add","delete","clear"],I=new Map;function x(i,e){if(!(i instanceof IDBDatabase&&!(e in i)&&typeof e=="string"))return;if(I.get(e))return I.get(e);const t=e.replace(/FromIndex$/,""),a=e!==t,n=oe.includes(t);if(!(t in(a?IDBIndex:IDBObjectStore).prototype)||!(n||ne.includes(t)))return;const o=async function(r,...s){const l=this.transaction(r,n?"readwrite":"readonly");let c=l.store;return a&&(c=c.index(s.shift())),(await Promise.all([c[t](...s),n&&l.done]))[0]};return I.set(e,o),o}ee(i=>({...i,get:(e,t,a)=>x(e,t)||i.get(e,t,a),has:(e,t)=>!!x(e,t)||i.has(e,t)}));const re="innervoice-db",se=1,g="stories",S=ae(re,se,{upgrade(i){i.objectStoreNames.contains(g)||i.createObjectStore(g,{keyPath:"id"})}});async function j(i){if(!(i!=null&&i.id))throw new Error("`id` is required to save.");return(await S).put(g,i)}async function b(){return console.log("getAllStories dipanggil"),(await S).getAll(g)}async function V(i){return(await S).delete(g,i)}async function $(i){return!!await(await S).get(g,i)}class z{constructor(e,t){this.model=e,this.view=t,console.log("HomePresenter diinisialisasi dengan view:",t)}async loadStories(){try{this.view.showLoading();const e=localStorage.getItem("token");console.log("Mengambil cerita dengan token:",e);const t=await this.model.getStories(e);if(console.log("API response:",t),!t.error&&t.listStory)t.listStory.length===0?this.view.showError("Belum ada cerita yang ditambahkan."):this.view.renderStories(t.listStory);else{const a=await b();a.length===0?this.view.showError("Gagal memuat cerita: "+(t.message||"Unknown error")):this.view.renderStories(a)}}catch(e){console.error("Error saat memuat cerita:",e);const t=await b();t.length===0?this.view.showError("Terjadi kesalahan saat memuat cerita: "+e.message):this.view.renderStories(t)}}logout(){try{localStorage.removeItem("token"),this.view&&typeof this.view.showSuccess=="function"?(this.view.showSuccess("Logout berhasil!"),location.hash="#/login"):(console.error("View atau showSuccess method tidak tersedia"),alert("Logout berhasil!"),location.hash="#/login")}catch(e){console.error("Error saat logout:",e),this.view&&typeof this.view.showError=="function"?this.view.showError("Terjadi kesalahan saat logout. Silakan coba lagi."):(console.error("View atau showError method tidak tersedia"),alert("Terjadi kesalahan saat logout. Silakan coba lagi."))}}}function le(i,e){const t=L.map(i).setView([-6.2088,106.8456],13),a={Default:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}),Satellite:L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:'&copy; <a href="https://www.esri.com/">Esri</a>'}),Terrain:L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'})};return a.Default.addTo(t),L.control.layers(a).addTo(t),e.forEach(n=>{n.lat&&n.lon&&L.marker([n.lat,n.lon]).addTo(t).bindPopup(`
        <div class="popup-content">
          <img src="${n.photoUrl}" alt="Foto cerita ${n.name}" style="width: 100%; max-height: 150px; object-fit: cover; margin-bottom: 10px;">
          <h3>${n.name}</h3>
          <p>${n.description.substring(0,100)}${n.description.length>100?"...":""}</p>
          <a href="#/story/${n.id}" class="btn-detail">Lihat Detail</a>
        </div>
      `)}),t}function ce(i,e){const t=L.map(i).setView([e.lat,e.lon],13),a={Default:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}),Satellite:L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:'&copy; <a href="https://www.esri.com/">Esri</a>'}),Terrain:L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'})};return a.Default.addTo(t),L.control.layers(a).addTo(t),L.marker([e.lat,e.lon]).addTo(t).bindPopup(`
    <div class="popup-content">
      <img src="${e.photoUrl}" alt="Foto cerita ${e.name}" style="width: 100%; max-height: 150px; object-fit: cover; margin-bottom: 10px;">
      <h3>${e.name}</h3>
      <p>${e.description}</p>
    </div>
  `),t}function de(i,e){const t=L.map(i).setView([-6.2088,106.8456],13),a={Default:L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}),Satellite:L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:'&copy; <a href="https://www.esri.com/">Esri</a>'}),Terrain:L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'}),Dark:L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'})};a.Default.addTo(t),L.control.layers(a,null,{position:"topright",collapsed:!1}).addTo(t);const n=document.querySelector(".leaflet-control-layers");n&&(n.style.padding="10px",n.style.background="white",n.style.borderRadius="8px",n.style.boxShadow="0 2px 8px rgba(0,0,0,0.1)");let o=null;const r=document.getElementById(e);return t.on("click",s=>{const{lat:l,lng:c}=s.latlng;o&&t.removeLayer(o),o=L.marker([l,c]).addTo(t),o.bindPopup("Lokasi cerita Anda").openPopup(),r&&(r.textContent=`${l.toFixed(6)}, ${c.toFixed(6)}`)}),t.getSelectedLocation=()=>{if(o){const s=o.getLatLng();return{lat:s.lat,lon:s.lng}}return null},t}let f=!1;function ue(i,e){const t=document.getElementById(i),a=document.getElementById(e);if(!t||!a){console.error("Image preview elements not found:",i,e);return}console.log("Setting up image preview for:",i),t.addEventListener("change",()=>{const n=t.files[0];if(n&&n.size<=1024*1024){const o=new FileReader;o.onload=()=>{a.style.opacity="0",a.src=o.result,a.style.display="block",a.onload=()=>{a.animate([{opacity:0},{opacity:1}],{duration:300,easing:"ease-out",fill:"forwards"})}},o.readAsDataURL(n)}else n&&(alert("File harus kurang dari 1MB"),t.value="",a.style.display="none")})}function y(i){return new Date(i).toLocaleString("id-ID",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}function F(i="maincontent"){if(f)return console.log("Transition already in progress, skipping"),Promise.resolve();console.log("Applying page transition effect"),f=!0;const e=document.getElementById(i);if(!e)return console.error(`Container with ID ${i} not found`),f=!1,Promise.resolve();if(document.startViewTransition)return new Promise(t=>{document.startViewTransition(()=>(e.style.viewTransitionName="page",new Promise(a=>{requestAnimationFrame(()=>{a(),t()})}))).finished.then(()=>{e.style.viewTransitionName="",f=!1})});{document.documentElement.style.willChange="transform",e.style.willChange="transform";const t=e.animate([{opacity:.95,transform:"translateY(20px)"},{opacity:1,transform:"translateY(0)"}],{duration:300,easing:"cubic-bezier(0.215, 0.61, 0.355, 1)",fill:"forwards"});return new Promise(a=>{t.onfinish=()=>{document.documentElement.style.willChange="auto",e.style.willChange="auto",f=!1,a()},t.oncancel=()=>{document.documentElement.style.willChange="auto",e.style.willChange="auto",f=!1,a()}})}}class me{constructor(){this.model=new G,this.presenter=new z(this.model,this)}showLoading(){const e=document.getElementById("maincontent");e&&(e.innerHTML=`
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Memuat cerita...</p>
        </div>
      `)}showError(e){alert(e)}showSuccess(e){alert(e)}redirectToHome(){location.hash="#/"}async renderStories(e){const t=document.getElementById("maincontent");if(!t)return;t.innerHTML=`
      <div class="stories-container home-content">
        <div class="stories-header">
          <h2>Daftar Cerita</h2>
          <div class="user-actions">
            ${localStorage.getItem("token")?`<button id="addBtn" class="btn-primary">
                  <i class="fas fa-plus"></i> Tambah Cerita
                </button>
                <button id="logoutBtn" class="btn-secondary">
                  <i class="fas fa-sign-out-alt"></i> Logout
                </button>`:`<button onclick="location.hash='#/login'" class="btn-primary">
                  <i class="fas fa-sign-in-alt"></i> Login
                </button>`}
            <button id="showOfflineBtn" class="btn-secondary">
              <i class="fas fa-database"></i> Cerita Offline
            </button>
          </div>
        </div>
        <div class="story-list">
          ${e.length===0?'<p class="no-stories">Belum ada cerita yang ditambahkan.</p>':e.map(s=>`
                <div class="story-card" data-id="${s.id}">
                  <div class="story-image" onclick="location.hash='#/story/${s.id}'">
                    <img src="${s.photoUrl}" alt="${s.name}" loading="lazy">
                  </div>
                  <div class="story-content">
                    <h3>${s.name}</h3>
                    <p>${s.description}</p>
                    <div class="story-meta">
                      <span><i class="fas fa-calendar"></i> ${y(s.createdAt)}</span>
                    </div>
                    <button class="offline-toggle-btn btn-secondary" data-id="${s.id}">
                      <i class="fas fa-download"></i> Simpan Offline
                    </button>
                  </div>
                </div>
              `).join("")}
        </div>
        <div id="storyMap" class="story-map"></div>
        <div id="offlineStoriesSection" style="margin-top:2rem;"></div>
      </div>
    `,e.length>0&&le("storyMap",e);const a=document.getElementById("addBtn");a&&a.addEventListener("click",()=>{location.hash="#/add"});const n=document.getElementById("logoutBtn");n&&n.addEventListener("click",()=>{this.presenter&&typeof this.presenter.logout=="function"&&this.presenter.logout()});const o=document.getElementById("showOfflineBtn");o&&o.addEventListener("click",()=>{location.hash="#/offline"});const r=t.querySelectorAll(".story-card");for(const s of r){const l=s.getAttribute("data-id"),c=s.querySelector(".offline-toggle-btn");c&&($(l).then(u=>{u?(c.innerHTML='<i class="fas fa-trash"></i> Hapus dari Offline',c.classList.add("saved")):(c.innerHTML='<i class="fas fa-download"></i> Simpan Offline',c.classList.remove("saved"))}),c.addEventListener("click",async u=>{if(u.stopPropagation(),await $(l))await V(l),c.innerHTML='<i class="fas fa-download"></i> Simpan Offline',c.classList.remove("saved");else{const h=e.find(W=>W.id==l);await j(h),c.innerHTML='<i class="fas fa-trash"></i> Hapus dari Offline',c.classList.add("saved")}}))}}showHomeView(){this.showLoading(),this.presenter.loadStories()}showOfflineStoryDetail(e){console.log("showOfflineStoryDetail dipanggil untuk:",e);let t=document.getElementById("offlineDetailModal");t||(t=document.createElement("div"),t.id="offlineDetailModal",t.style.position="fixed",t.style.top="0",t.style.left="0",t.style.width="100vw",t.style.height="100vh",t.style.background="rgba(0,0,0,0.5)",t.style.display="flex",t.style.alignItems="center",t.style.justifyContent="center",t.style.zIndex="9999",document.body.appendChild(t)),t.innerHTML=`
      <div style="background:#fff;max-width:400px;width:90vw;padding:2rem;border-radius:12px;position:relative;box-shadow:0 4px 24px rgba(0,0,0,0.2);">
        <button id="closeOfflineDetailModal" style="position:absolute;top:1rem;right:1rem;font-size:1.2rem;background:none;border:none;cursor:pointer;">&times;</button>
        <h2>${e.name}</h2>
        <img src="${e.photoUrl}" alt="${e.name}" style="width:100%;border-radius:8px;margin-bottom:1rem;"/>
        <p>${e.description}</p>
        <div style="color:#888;font-size:0.95rem;margin-top:1rem;">
          <i class="fas fa-calendar"></i> ${e.createdAt?y(e.createdAt):""}
        </div>
      </div>
    `,t.style.display="flex",document.getElementById("closeOfflineDetailModal").onclick=()=>{t.style.display="none"},t.onclick=a=>{a.target===t&&(t.style.display="none")}}}class pe{constructor(e="https://story-api.dicoding.dev/v1"){this.apiBase=e}async addStory(e,t){try{return await(await fetch(`${this.apiBase}/stories`,{method:"POST",headers:{Authorization:`Bearer ${t}`},body:e})).json()}catch(a){return console.error("Error menambahkan cerita:",a),{error:!0,message:a.message}}}}class q{constructor(e,t){this.model=e,this.view=t}async handleFormSubmit(e){try{const t=localStorage.getItem("token");if(!t){this.view.showError("Anda harus login untuk menambah cerita"),this.view.redirectToLogin();return}this.view.showLoading();const a=await this.model.addStory(e,t);console.log("API addStory response:",a),a.error?this.view.showError("Gagal mengirim cerita: "+(a.message||JSON.stringify(a))):(this.view.showSuccess("Cerita berhasil dikirim"),this.view.redirectToHome())}catch(t){console.error("Error submitting story:",t),this.view.showError("Terjadi kesalahan saat mengirim cerita: "+t.message)}finally{this.view.hideLoading()}}}class he{constructor(){this.model=new pe,this.presenter=new q(this.model,this),this.mapInstance=null,this.cameraStream=null}showLoading(){const e=document.querySelector('button[type="submit"]');e&&(e.disabled=!0,e.innerHTML='<i class="fas fa-spinner fa-spin"></i> Mengirim...')}hideLoading(){const e=document.querySelector('button[type="submit"]');e&&(e.disabled=!1,e.innerHTML='<i class="fas fa-paper-plane"></i> Kirim')}showError(e){alert(e)}showSuccess(e){alert(e)}redirectToLogin(){location.hash="#/login"}redirectToHome(){location.hash="#/"}async setupCamera(e){const t=document.getElementById("camera"),a=document.getElementById("capture"),n=document.getElementById(e);if(!t||!a||!n)return;t.style.display="block",a.style.display="inline-block",n.style.display="none";try{this.cameraStream=await navigator.mediaDevices.getUserMedia({video:!0}),t.srcObject=this.cameraStream,t.play()}catch(r){alert("Tidak dapat mengakses kamera: "+r.message),t.style.display="none",a.style.display="none";return}function o(r,s){const l=r.split(","),c=l[0].match(/:(.*?);/)[1],u=atob(l[1]);let m=u.length;const h=new Uint8Array(m);for(;m--;)h[m]=u.charCodeAt(m);return new File([h],s,{type:c})}return a.onclick=()=>{const r=document.createElement("canvas");r.width=t.videoWidth,r.height=t.videoHeight,r.getContext("2d").drawImage(t,0,0,r.width,r.height);const l=r.toDataURL("image/png");n.src=l,n.style.display="block",t.style.display="none",a.style.display="none",this.cameraStream&&this.cameraStream.getTracks().forEach(u=>u.stop());const c=document.getElementById("photo");if(c){const u=o(l,"camera-capture.png"),m=new DataTransfer;m.items.add(u),c.files=m.files}},()=>{this.cameraStream&&this.cameraStream.getTracks().forEach(r=>r.stop()),t.style.display="none",a.style.display="none"}}render(){console.log("Rendering add story view");const e=document.getElementById("maincontent");if(!e){console.error("Main content element not found");return}e.innerHTML="",F();const t=document.createElement("div");t.className="form-container",t.innerHTML=`
      <h2 id="add-story-title">Tambah Cerita Baru</h2>
      <form id="formAdd" novalidate aria-labelledby="add-story-title" role="form">
        <div class="form-group">
          <label for="desc">Deskripsi Cerita</label>
          <textarea id="desc" required placeholder="Ceritakan pengalamanmu..." aria-required="true" aria-label="Deskripsi Cerita"></textarea>
        </div>

        <div class="form-group">
          <label for="photo">Foto Cerita (maks 1MB)</label>
          <div class="photo-input-container">
            <input type="file" id="photo" accept="image/*" required aria-required="true" aria-label="Foto Cerita" />
            <button type="button" id="toggleCamera" aria-pressed="false" aria-label="Gunakan Kamera">Gunakan Kamera</button>
          </div>
          <div class="camera-container">
            <video id="camera" style="display: none;" width="320" height="240" aria-label="Pratinjau Kamera" tabindex="0"></video>
            <button type="button" id="capture" style="display: none;" aria-label="Ambil Foto">Ambil Foto</button>
          </div>
          <img id="preview" alt="Preview foto cerita" style="display: none; max-width: 100%; margin-top: 1rem; border-radius: 8px;" />
        </div>

        <div class="form-group">
          <label>Pilih Lokasi (opsional)</label>
          <p class="hint">Klik pada peta untuk menandai lokasi cerita</p>
          <div id="map" tabindex="0" aria-label="Peta Pilih Lokasi"></div>
          <p>Lokasi terpilih: <span id="locDisplay">Tidak ada</span></p>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" aria-label="Kirim Cerita">
            <i class="fas fa-paper-plane"></i> Kirim
          </button>
          <button type="button" class="btn-secondary" onclick="location.hash='#/'" aria-label="Batal Tambah Cerita">
            <i class="fas fa-times"></i> Batal
          </button>
        </div>
      </form>
    `,e.appendChild(t),ue("photo","preview"),setTimeout(()=>{this.mapInstance&&this.mapInstance.remove&&this.mapInstance.remove(),this.mapInstance=de("map","locDisplay")},100);let a=null;const n=document.getElementById("toggleCamera");n&&n.addEventListener("click",()=>{const r=document.querySelector(".camera-container");r&&(r.style.display!=="block"?(r.style.display="block",a=this.setupCamera("preview")):(r.style.display="none",a&&a()))});const o=document.getElementById("formAdd");o&&o.addEventListener("submit",async r=>{r.preventDefault(),await this.handleFormSubmit()})}async handleFormSubmit(){console.log("Handling form submission");const e=document.getElementById("desc"),t=document.getElementById("photo");if(!e||!t){console.error("Form elements not found");return}const a=e.value.trim(),n=t.files[0];if(!a){this.showError("Deskripsi cerita harus diisi"),e.focus();return}if(!n){this.showError("Foto cerita harus dipilih");return}if(n.size>1024*1024){this.showError("Ukuran foto maksimal 1MB");return}const o=new FormData;if(o.append("description",a),o.append("photo",n),this.mapInstance&&typeof this.mapInstance.getSelectedLocation=="function"){const r=this.mapInstance.getSelectedLocation();r&&r.lat!==void 0&&r.lon!==void 0&&(o.append("lat",r.lat),o.append("lon",r.lon))}await this.presenter.handleFormSubmit(o)}destroy(){this.cameraStream&&(this.cameraStream.getTracks().forEach(e=>e.stop()),this.cameraStream=null),this.mapInstance&&(this.mapInstance.remove(),this.mapInstance=null)}}class fe{constructor(e="https://story-api.dicoding.dev/v1"){this.apiBase=e}async getStoryDetail(e,t){return await(await fetch(`${this.apiBase}/stories/${e}`,{headers:t?{Authorization:"Bearer "+t}:{}})).json()}}class ge{constructor(){this.model=new fe,this.presenter=null}showLoading(){const e=document.getElementById("maincontent");e&&(e.innerHTML=`
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Memuat detail cerita...</p>
        </div>
      `)}showError(e){alert(e)}async renderStoryDetail(e){const t=document.getElementById("maincontent");if(!t)return;const n=(await b()).some(r=>r.id===e.id);t.innerHTML=`
      <div class="story-detail-container">
        <button class="back-button" onclick="location.hash='#/'">
          <i class="fas fa-arrow-left"></i> Kembali
        </button>

        <div class="story-detail-content">
          <div class="story-detail-header">
            <h2>${e.name}</h2>
            <div class="story-meta">
              <span><i class="fas fa-user"></i> ${e.name}</span>
              <span><i class="fas fa-calendar-alt"></i> ${y(e.createdAt)}</span>
            </div>
          </div>

          <div class="story-detail-body">
            <div class="story-image-container">
              <img src="${e.photoUrl}" alt="Foto cerita ${e.name}" class="detail-image" loading="lazy">
            </div>
            
            <div class="story-description">
              <p>${e.description}</p>
            </div>
          </div>

          <button id="saveOfflineBtn" class="btn-primary" style="margin-bottom:1rem;" ${n?"disabled":""}>
            <i class="fas ${n?"fa-check":"fa-download"}"></i> ${n?"Tersimpan Offline":"Simpan ke Offline"}
          </button>

          <div class="story-location-section">
            <h3><i class="fas fa-map-marker-alt"></i> Lokasi Cerita</h3>
            <div id="map" class="story-map"></div>
          </div>
        </div>
      </div>
    `,e.lat&&e.lon&&ce("map",e);const o=document.getElementById("saveOfflineBtn");o&&!n&&o.addEventListener("click",async()=>{await j(e),o.innerHTML='<i class="fas fa-check"></i> Tersimpan Offline',o.disabled=!0})}showDetailView(e){this.showLoading(),this.presenter.loadStoryDetail(e)}}class ye{constructor(e,t){if(!t)throw new Error("View diperlukan untuk DetailPresenter");this.model=e,this.view=t,console.log("DetailPresenter diinisialisasi dengan view:",t)}async loadStoryDetail(e){try{console.log("Memuat detail cerita untuk ID:",e);const t=localStorage.getItem("token"),a=await this.model.getStoryDetail(e,t);a.error?this.view&&typeof this.view.showError=="function"?this.view.showError("Gagal memuat detail cerita: "+a.message):(console.error("View atau metode showError tidak tersedia"),alert("Gagal memuat detail cerita: "+a.message)):this.view&&typeof this.view.renderStoryDetail=="function"?this.view.renderStoryDetail(a.story):(console.error("View atau metode renderStoryDetail tidak tersedia"),alert("Gagal menampilkan detail cerita"))}catch(t){console.error("Error dalam loadStoryDetail:",t),this.view&&typeof this.view.showError=="function"?this.view.showError("Terjadi kesalahan saat memuat detail cerita"):(console.error("View atau metode showError tidak tersedia"),alert("Terjadi kesalahan saat memuat detail cerita"))}}}class be{constructor(e="https://story-api.dicoding.dev/v1"){this.apiBase=e}async login(e,t){return await(await fetch(`${this.apiBase}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})})).json()}async register(e,t,a){return await(await fetch(`${this.apiBase}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:t,password:a})})).json()}}class we{constructor(){this.model=new be,this.presenter=null}showError(e){alert(e)}showSuccess(e){alert(e)}redirectToHome(){location.hash="#/"}switchToLoginTab(e){const t=document.getElementById("tab-login"),a=document.getElementById("login-email");t&&a&&(t.click(),a.value=e)}render(){console.log("Rendering login view");const e=document.getElementById("maincontent");if(!e){console.error("Main content element not found");return}e.innerHTML="",F();const t=document.createElement("div");t.className="auth-container";const a=document.createElement("div");a.className="auth-tabs",a.innerHTML=`
      <button id="tab-login" class="auth-tab active">Login</button>
      <button id="tab-register" class="auth-tab">Daftar</button>
    `,t.appendChild(a);const n=document.createElement("form");n.id="formLogin",n.className="auth-form active",n.innerHTML=`
      <h2>Login</h2>
      
      <div class="form-group">
        <label for="login-email">Email</label>
        <input type="email" id="login-email" required placeholder="email@example.com" />
      </div>
      
      <div class="form-group">
        <label for="login-pass">Password</label>
        <input type="password" id="login-pass" required placeholder="Masukkan password" />
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn-primary">
          <i class="fas fa-sign-in-alt"></i> Login
        </button>
        <button type="button" class="btn-secondary" onclick="location.hash='#/'">
          <i class="fas fa-times"></i> Batal
        </button>
      </div>
    `,t.appendChild(n);const o=document.createElement("form");o.id="formRegister",o.className="auth-form",o.style.display="none",o.innerHTML=`
      <h2>Daftar Akun Baru</h2>
      
      <div class="form-group">
        <label for="register-name">Nama</label>
        <input type="text" id="register-name" required placeholder="Nama lengkap" />
      </div>
      
      <div class="form-group">
        <label for="register-email">Email</label>
        <input type="email" id="register-email" required placeholder="email@example.com" />
      </div>
      
      <div class="form-group">
        <label for="register-pass">Password</label>
        <input type="password" id="register-pass" required placeholder="Minimal 8 karakter" minlength="8" />
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn-primary">
          <i class="fas fa-user-plus"></i> Daftar
        </button>
        <button type="button" class="btn-secondary" onclick="location.hash='#/'">
          <i class="fas fa-times"></i> Batal
        </button>
      </div>
    `,t.appendChild(o),e.appendChild(t);const r=this;document.getElementById("tab-login").addEventListener("click",()=>{document.getElementById("tab-login").classList.add("active"),document.getElementById("tab-register").classList.remove("active"),document.getElementById("formLogin").style.display="block",document.getElementById("formRegister").style.display="none"}),document.getElementById("tab-register").addEventListener("click",()=>{document.getElementById("tab-login").classList.remove("active"),document.getElementById("tab-register").classList.add("active"),document.getElementById("formLogin").style.display="none",document.getElementById("formRegister").style.display="block"}),document.getElementById("formLogin").addEventListener("submit",async s=>{s.preventDefault();const l=document.getElementById("login-email").value.trim(),c=document.getElementById("login-pass").value.trim();if(!l||!c){r.showError("Email dan password harus diisi");return}const u=s.target.querySelector('button[type="submit"]');u.disabled=!0,u.innerHTML='<i class="fas fa-spinner fa-spin"></i> Memproses...';try{await r.presenter.handleLogin(l,c)}catch(m){console.error("Error during login:",m),r.showError("Terjadi kesalahan saat login")}finally{u.disabled=!1,u.innerHTML='<i class="fas fa-sign-in-alt"></i> Login'}}),document.getElementById("formRegister").addEventListener("submit",async s=>{s.preventDefault();const l=document.getElementById("register-name").value.trim(),c=document.getElementById("register-email").value.trim(),u=document.getElementById("register-pass").value.trim();if(!l||!c||!u){r.showError("Semua field harus diisi");return}if(u.length<8){r.showError("Password minimal 8 karakter");return}const m=s.target.querySelector('button[type="submit"]');m.disabled=!0,m.innerHTML='<i class="fas fa-spinner fa-spin"></i> Memproses...';try{await r.presenter.handleRegister(l,c,u)}catch(h){console.error("Error during registration:",h),r.showError("Terjadi kesalahan saat registrasi")}finally{m.disabled=!1,m.innerHTML='<i class="fas fa-user-plus"></i> Daftar'}})}showLoginView(){this.render()}}class ve{constructor(e,t){if(!t)throw new Error("View is required for LoginPresenter");this.model=e,this.view=t,console.log("LoginPresenter initialized with view:",t)}async handleLogin(e,t){try{const a=await this.model.login(e,t);a.error?this.view.showError("Login gagal: "+a.message):(localStorage.setItem("token",a.loginResult.token),this.view.showSuccess("Login berhasil!"),this.view.redirectToHome())}catch(a){console.error("Error in handleLogin:",a),this.view.showError("Terjadi kesalahan saat login")}}async handleRegister(e,t,a){try{const n=await this.model.register(e,t,a);n.error?this.view.showError("Registrasi gagal: "+n.message):(this.view.showSuccess("Registrasi berhasil! Silakan login."),this.view.switchToLoginTab(t))}catch(n){console.error("Error in handleRegister:",n),this.view.showError("Terjadi kesalahan saat registrasi")}}}class ke{constructor(){this.presenter=null}async render(){const e=document.getElementById("maincontent");if(!e)return;e.innerHTML='<div class="loading">Memuat cerita offline...</div>';const t=await b();if(t.length===0){e.innerHTML='<p class="no-stories">Tidak ada cerita offline.</p>';return}e.innerHTML=`
      <div class="stories-container home-content">
        <div class="stories-header">
          <h2><i class="fas fa-database"></i> Cerita Offline</h2>
        </div>
        <div class="story-list">
          ${t.map(a=>`
            <div class="story-card">
              <button class="deleteOfflineBtn icon-btn" data-id="${a.id}" title="Hapus" aria-label="Hapus cerita" tabindex="0">
                <i class="fas fa-trash"></i>
              </button>
              <div class="story-image">
                <img src="${a.photoUrl}" alt="${a.name}" loading="lazy">
              </div>
              <div class="story-content">
                <h3>${a.name}</h3>
                <p>${a.description}</p>
                <div class="story-meta">
                  <span><i class="fas fa-calendar"></i> ${a.createdAt?y(a.createdAt):""}</span>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `,e.querySelectorAll(".deleteOfflineBtn").forEach(a=>{a.addEventListener("click",async n=>{n.stopPropagation();const o=a.getAttribute("data-id");await V(o),a.closest(".story-card").remove()})}),e.querySelectorAll(".story-card").forEach((a,n)=>{a.addEventListener("click",o=>{if(o.target.closest(".deleteOfflineBtn"))return;const r=t[n];this.showOfflineStoryDetail(r)})})}showOfflineStoryDetail(e){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`
      <div class="modal-container">
        <button class="modal-close" aria-label="Tutup">&times;</button>
        <div class="modal-header">
          <h2>${e.name}</h2>
        </div>
        <div class="modal-body">
          <img src="${e.photoUrl}" alt="${e.name}">
          <p>${e.description}</p>
          <div class="story-meta">
            <span><i class="fas fa-calendar"></i> ${e.createdAt?y(e.createdAt):""}</span>
          </div>
        </div>
      </div>
    `,document.body.appendChild(t),requestAnimationFrame(()=>{t.classList.add("active")}),t.querySelector(".modal-close").addEventListener("click",()=>{t.classList.remove("active"),setTimeout(()=>{document.body.removeChild(t)},300)}),t.addEventListener("click",a=>{a.target===t&&(t.classList.remove("active"),setTimeout(()=>{document.body.removeChild(t)},300))})}}function R(){return"Notification"in window}function Le(){return Notification.permission==="granted"}async function U(){if(!R())return console.error("Notification API unsupported."),!1;if(Le())return!0;const i=await Notification.requestPermission();return i==="denied"?(alert("Izin notifikasi ditolak."),!1):i==="default"?(alert("Izin notifikasi ditutup atau diabaikan."),!1):!0}async function _(){try{await navigator.serviceWorker.ready;const i=await navigator.serviceWorker.getRegistration();return i?await i.pushManager.getSubscription():(console.error("No service worker registration found"),null)}catch(i){return console.error("Error getting push subscription:",i),null}}async function C(){try{return!!await _()}catch(i){return console.error("Error checking subscription status:",i),!1}}function Ee(){return{userVisibleOnly:!0,applicationServerKey:Te("BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk")}}async function Se(){try{if(!await U())return;if(await C()){alert("Sudah berlangganan push notification.");return}console.log("Mulai berlangganan push notification..."),await navigator.serviceWorker.ready;const i=await navigator.serviceWorker.getRegistration();if(!i){alert("Service worker tidak tersedia.");return}const e=await i.pushManager.subscribe(Ee()),t=e.endpoint,a=btoa(String.fromCharCode.apply(null,new Uint8Array(e.getKey("p256dh")))),n=btoa(String.fromCharCode.apply(null,new Uint8Array(e.getKey("auth")))),o=localStorage.getItem("token");if(!o){alert("Anda harus login untuk berlangganan notifikasi."),await e.unsubscribe();return}const s=await(await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify({endpoint:t,keys:{p256dh:a,auth:n}})})).json();s.error?(console.error("subscribe: response:",s),alert("Langganan push notification gagal diaktifkan."),await e.unsubscribe()):alert("Langganan push notification berhasil diaktifkan.")}catch(i){console.error("subscribe: error:",i),alert("Langganan push notification gagal diaktifkan. Error: "+i.message)}}async function Be(){try{const i=await _();if(!i){alert("Tidak bisa memutus langganan push notification karena belum berlangganan sebelumnya.");return}const{endpoint:e}=i.toJSON(),t=localStorage.getItem("token");if(!t){alert("Anda harus login untuk berhenti berlangganan notifikasi.");return}if((await(await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe",{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({endpoint:e})})).json()).error)alert("Langganan push notification gagal dinonaktifkan.");else{const o=await i.unsubscribe();alert(o?"Langganan push notification berhasil dinonaktifkan.":"Langganan push notification gagal dinonaktifkan.")}}catch(i){console.error("unsubscribe: error:",i),alert("Langganan push notification gagal dinonaktifkan. Error: "+i.message)}}function Te(i){const e="=".repeat((4-i.length%4)%4),t=(i+e).replace(/\-/g,"+").replace(/_/g,"/"),a=window.atob(t),n=new Uint8Array(a.length);for(let o=0;o<a.length;++o)n[o]=a.charCodeAt(o);return n}class Ie extends HTMLElement{constructor(){super(),console.log("PushNotificationButton constructor dipanggil"),this._isSubscribed=!1}async connectedCallback(){if(console.log("PushNotificationButton connectedCallback dipanggil"),!R()){console.log("Notification API not available"),this.innerHTML="";return}try{this._isSubscribed=await C(),console.log("Current subscription status:",this._isSubscribed),this.render()}catch(e){console.error("Error checking subscription status:",e),this.innerHTML=""}}render(){console.log("Rendering push notification button"),this.innerHTML=`
      <button class="push-notification-button" aria-label="${this._isSubscribed?"Unsubscribe":"Subscribe"} Push Notification">
        <i class="fas fa-bell"></i> ${this._isSubscribed?"Unsubscribe":"Subscribe"} Push Notification
      </button>
    `;const e=this.querySelector("button");e&&e.addEventListener("click",async()=>{Notification.permission!=="granted"&&!await U()||(console.log("Button clicked, current status:",this._isSubscribed),this._isSubscribed?await Be():await Se(),this._isSubscribed=await C(),this.render())})}}customElements.define("push-notification-button",Ie);const w=new me,v=new he,k=new ge,E=new we,Me=new ke,De=new z(w.model,w),Ce=new q(v.model,v),Ae=new ye(k.model,k),Pe=new ve(E.model,E);w.presenter=De;v.presenter=Ce;k.presenter=Ae;E.presenter=Pe;let d=null;function Oe(){document.querySelectorAll("video").forEach(e=>{e.srcObject&&(e.srcObject.getTracks().forEach(t=>t.stop()),e.srcObject=null)})}window.Camera={stopAllStreams:Oe};window.addEventListener("hashchange",async()=>{window.Camera.stopAllStreams(),K()});function K(){const e=(window.location.hash||"#/").slice(1);d&&typeof d.destroy=="function"&&(console.log("Cleaning up current view:",d.constructor.name),d.destroy());const t=document.getElementById("maincontent");if(t&&(t.innerHTML=`
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Memuat halaman...</p>
      </div>
    `),e==="/")d=w,d.showHomeView();else if(e==="/add")d=v,d.render();else if(e==="/login")d=E,typeof d.showLoginView=="function"?d.showLoginView():d.render();else if(e==="/offline")d=Me,d.render();else if(e.startsWith("/story/")){const a=e.split("/")[2];d=k,typeof d.showDetailView=="function"?d.showDetailView(a):d.render(a)}else t.innerHTML=`
      <div class="error-container">
        <h2>404 - Halaman Tidak Ditemukan</h2>
        <p>Halaman yang Anda cari tidak ditemukan.</p>
        <button onclick="location.hash='#/'">Kembali ke Beranda</button>
      </div>
    `}function xe(){console.log("Initializing app...");const i=document.createElement("style");i.textContent=`
    .page-transition {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }
    .page-transition.active {
      opacity: 1;
    }
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 200px;
    }
    .loading-spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,document.head.appendChild(i);const e=document.querySelector("main");e&&(e.classList.add("page-transition"),e.offsetHeight,e.classList.add("active")),document.addEventListener("visibilitychange",()=>{document.hidden&&d&&typeof d.destroy=="function"&&(console.log("Page hidden, cleaning up current view:",d.constructor.name),d.destroy())}),console.log("Running initial route..."),K(),document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("push-notification-tools");if(t){console.log("Menambahkan push-notification-button ke navbar");const a=document.createElement("push-notification-button");t.appendChild(a)}else console.error("push-notification-tools element tidak ditemukan di DOM")})}document.addEventListener("DOMContentLoaded",xe);
