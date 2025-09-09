// Basic interactivity for nav, forms, and year
document.addEventListener('DOMContentLoaded', function(){
  // year
  for(let i=1;i<=10;i++){
    const el = document.getElementById('year'+(i===1? ''+''+'' : i));
  }
  const years = document.querySelectorAll('[id^=year]');
  years.forEach(y => y.textContent = new Date().getFullYear());

  // nav toggle
  const navToggles = document.querySelectorAll('.nav-toggle');
  navToggles.forEach(btn=>{
    btn.addEventListener('click', ()=> {
      const nav = document.querySelector('.main-nav');
      if(nav.style.display === 'flex') nav.style.display = '';
      else nav.style.display = 'flex';
    });
  });

  // contact form demo submit
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      alert('Thank you! Your message has been received. (Demo)');
      contactForm.reset();
    });
  }

  // consultation form -> store to localStorage to simulate submit
  const consultForm = document.getElementById('consultForm');
  if(consultForm){
    consultForm.addEventListener('submit', function(e){
      e.preventDefault();
      const data = {
        name: document.getElementById('c_name').value,
        email: document.getElementById('c_email').value,
        phone: document.getElementById('c_phone').value,
        address: document.getElementById('c_address').value,
        notes: document.getElementById('c_notes').value,
        created: new Date().toISOString()
      };
      let arr = JSON.parse(localStorage.getItem('consultRequests')||'[]');
      arr.push(data);
      localStorage.setItem('consultRequests', JSON.stringify(arr));
      document.getElementById('consultMsg').textContent = 'Thanks! We received your consultation request.';
      consultForm.reset();
    });
  }
});
