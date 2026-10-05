let activities = JSON.parse(localStorage.getItem('farmingActivities') || '[]');
let active = 'All';

function filterCat(c) {
  active = c;
  render();
  location.hash = 'activities';
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[m]));
}

function render() {
  let q = (document.getElementById('search')?.value || '').toLowerCase();

  let a = activities.filter(x =>
    (active === 'All' || x.category === active) &&
    (x.title + x.desc + x.category).toLowerCase().includes(q)
  );

  document.getElementById('list').innerHTML = a.length
    ? a.slice().reverse().map(x => `
      <article class="item">
        ${x.photo ? `<img src="${x.photo}">` : ''}
        <b>${esc(x.category)}</b>
        <h3>${esc(x.title)}</h3>
        <small>${x.date}</small>
        <p>${esc(x.desc)}</p>
      </article>
    `).join('')
    : `<div class="item">
        <h3>No activities yet</h3>
        <p>Add your first farming activity below.</p>
      </div>`;
}

document.getElementById('form').onsubmit = e => {
  e.preventDefault();

  let f = document.getElementById('photo').files[0];

  let save = p => {
    activities.push({
      title: document.getElementById('title').value,
      category: document.getElementById('category').value,
      date: document.getElementById('date').value,
      desc: document.getElementById('desc').value,
      photo: p
    });

    localStorage.setItem('farmingActivities', JSON.stringify(activities));
    e.target.reset();
    render();
    location.hash = 'activities';
  };

  if (f) {
    let r = new FileReader();
    r.onload = () => save(r.result);
    r.readAsDataURL(f);
  } else {
    save('');
  }
};

render();
