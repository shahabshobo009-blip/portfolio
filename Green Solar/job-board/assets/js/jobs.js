// Job board JS - uses localStorage
(function(){
  // helper
  function $(s){return document.querySelector(s)}
  function $a(s){return document.querySelectorAll(s)}

  // initialize sample jobs if none
  function seedJobs(){
    let jobs = JSON.parse(localStorage.getItem('jobs')||'[]');
    if(jobs.length === 0){
      jobs = [
        {id: 'j1', company:'Acme Corp', title:'Frontend Developer', location:'Remote', type:'Full-time', salary:'$60k-$80k', description:'React developer with 2+ years experience', created:Date.now()},
        {id: 'j2', company:'GreenEnergy', title:'Solar Project Manager', location:'Austin, TX', type:'Full-time', salary:'$70k-$95k', description:'Manage solar installations', created:Date.now()},
        {id: 'j3', company:'MarketLeap', title:'Marketing Intern', location:'Remote', type:'Internship', salary:'Stipend', description:'Assist marketing team', created:Date.now()},
      ];
      localStorage.setItem('jobs', JSON.stringify(jobs));
    }
  }

  function uid(prefix='id'){return prefix + Math.random().toString(36).slice(2,9)}

  // render jobs list
  function renderJobs(filter){
    const container = $('#jobsList');
    if(!container) return;
    const jobs = JSON.parse(localStorage.getItem('jobs')||'[]');
    const filtered = jobs.filter(j=>{
      if(!filter) return true;
      if(filter.q){
        const q = filter.q.toLowerCase();
        if(!(j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.description.toLowerCase().includes(q))) return false;
      }
      if(filter.type && filter.type !== '') {
        if(j.type !== filter.type) return false;
      }
      return true;
    });
    container.innerHTML = '';
    if(filtered.length === 0){
      container.innerHTML = '<p class="muted">No jobs found. Try posting one!</p>';
      return;
    }
    const template = $('#job-card');
    filtered.forEach(j=>{
      const node = template.content.cloneNode(true);
      node.querySelector('.title').textContent = j.title;
      node.querySelector('.meta').textContent = `${j.company} — ${j.location} • ${j.type} • ${j.salary||''}`;
      node.querySelector('.desc').textContent = (j.description.length>140)? j.description.slice(0,140)+'...' : j.description;
      const viewLink = node.querySelector('.view-link');
      viewLink.href = `job-details.html?id=${j.id}`;
      const applyBtn = node.querySelector('.applyBtn');
      applyBtn.addEventListener('click', ()=> openApply(j.id));
      container.appendChild(node);
    });
  }

  // open apply modal
  function openApply(jobId){
    const modal = $('#applyModal');
    modal.style.display = 'flex';
    modal.dataset.jobId = jobId;
  }
  function closeApply(){
    const modal = $('#applyModal');
    modal.style.display = 'none';
    modal.dataset.jobId = '';
    $('#applyForm').reset();
    $('#applyMsg').textContent = '';
  }

  // handle apply submit
  function handleApply(e){
    e.preventDefault();
    const jobId = document.getElementById('applyModal').dataset.jobId;
    const name = $('#app_name').value.trim();
    const email = $('#app_email').value.trim();
    const msg = $('#app_msg').value.trim();
    if(!name || !email) return alert('Please fill name and email');
    const apps = JSON.parse(localStorage.getItem('applications')||'[]');
    apps.push({id: uid('app'), jobId, name, email, msg, created: Date.now()});
    localStorage.setItem('applications', JSON.stringify(apps));
    $('#applyMsg').textContent = 'Application submitted. The company will contact you. (Demo)';
    setTimeout(closeApply, 1200);
  }

  // post job form
  function handlePost(e){
    e.preventDefault();
    const data = {
      id: uid('j'),
      company: $('#company').value.trim(),
      title: $('#title').value.trim(),
      location: $('#location').value.trim(),
      type: $('#jobType').value,
      salary: $('#salary').value.trim(),
      description: $('#description').value.trim(),
      created: Date.now()
    };
    const jobs = JSON.parse(localStorage.getItem('jobs')||'[]');
    jobs.unshift(data);
    localStorage.setItem('jobs', JSON.stringify(jobs));
    $('#postMsg').textContent = 'Job posted! It will appear on the jobs list.';
    setTimeout(()=>location.href='index.html',800);
  }

  // job details page
  function renderJobDetails(){
    const c = $('#jobDetailsContainer');
    if(!c) return;
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const jobs = JSON.parse(localStorage.getItem('jobs')||'[]');
    const job = jobs.find(j=>j.id===id);
    if(!job){
      c.innerHTML = '<p class="muted">Job not found.</p><p><a href="index.html" class="btn">Back to jobs</a></p>';
      return;
    }
    c.innerHTML = `
      <article class="job-card">
        <h2>${job.title}</h2>
        <div class="meta">${job.company} — ${job.location} • ${job.type} • ${job.salary || ''}</div>
        <p>${job.description.replace(/\n/g,'<br>')}</p>
        <div class="job-actions">
          <button class="btn" id="applyHere">Apply</button>
          <a class="btn ghost" href="index.html">Back</a>
        </div>
      </article>
    `;
    $('#applyHere').addEventListener('click', ()=> openApply(job.id));
  }

  // wire events when on pages
  document.addEventListener('DOMContentLoaded', function(){
    seedJobs();

    // index events
    if($('#jobsList')){
      document.getElementById('searchBtn').addEventListener('click', ()=>{
        const q = $('#q').value.trim();
        const type = $('#type').value;
        renderJobs({q,type});
      });
      document.getElementById('clearBtn').addEventListener('click', ()=>{
        $('#q').value='';$('#type').value='';
        renderJobs();
      });
      // apply modal events
      $('#closeApply').addEventListener('click', closeApply);
      $('#applyForm').addEventListener('submit', handleApply);

      renderJobs();
    }

    // post job page
    if($('#postForm')){
      $('#postForm').addEventListener('submit', handlePost);
    }

    // job details
    renderJobDetails();
  });
})();
