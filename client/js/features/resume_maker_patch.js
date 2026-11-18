/* ============================================================
   resume_maker.js — PATCH
   Add this ONE LINE inside the existing downloadPDF() function,
   right after  showToast('Opening print dialog…');

   FIND this in resume_maker.js:
   ─────────────────────────────────────────────────────────
   function downloadPDF(){
     const w=document.getElementById('resumeWrapper');
     const prev=w?w.style.transform:'';
     if(w)w.style.transform='scale(1)';
     showToast('Opening print dialog…');          ← ADD AFTER THIS LINE:
     setTimeout(()=>{ ... }, 350);
   }
   ─────────────────────────────────────────────────────────

   ADD this single line after the showToast call:
   ─────────────────────────────────────────────────────────
   try{var c=parseInt(localStorage.getItem('readycv_resume_count')||'0',10);localStorage.setItem('readycv_resume_count',c+1);}catch(e){}
   ─────────────────────────────────────────────────────────

   Full patched downloadPDF for copy-paste:
*/

function downloadPDF(){
  const w=document.getElementById('resumeWrapper');
  const prev=w?w.style.transform:'';
  if(w)w.style.transform='scale(1)';
  showToast('Opening print dialog…');
  // ── INCREMENT RESUME COUNT ──────────────────────────────
  try{
    var c = parseInt(localStorage.getItem('readycv_resume_count')||'0', 10);
    localStorage.setItem('readycv_resume_count', c + 1);
  } catch(e){}
  // ───────────────────────────────────────────────────────
  setTimeout(()=>{
    window.print();
    if(w)w.style.transform=prev;
  },350);
}
