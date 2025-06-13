const token = localStorage.getItem('token');

async function fetchDash() {
    let crewHtml =``;
    let captainhtml=``;
    const res = await fetch('https://crewtor-backend.onrender.com/api/admin/dashboard', {
    method: "GET",
    headers: { 'Content-Type': 'application/json' },
  });

  const {userCount , captainCount, captain , user} = await res.json();
  if (res.ok) {
        document.getElementById('total_user').innerText = userCount
        document.getElementById('total_captain').innerText = captainCount
        captain.forEach(ele => {
           captainhtml += `
            <tr>
            <td>${ele.name}</td>
            <td>${ele.email}</td>
            <td>${ele.crewmate.length}</td>
            </tr>`
        });
        user.forEach(ele => {
            const formattedDate = new Date(ele.joinAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                });
           crewHtml += `
            <tr>
            <td>${ele.name}</td>
            <td>${ele.email}</td>
            <td>${formattedDate}</td>
            <td>${ele.captain.name}</td>
            </tr>`
        });
        document.getElementById('captaintable').innerHTML = captainhtml
        document.getElementById('usertable').innerHTML = crewHtml
  }
};
fetchDash();


function logout() {
    localStorage.removeItem("token");
    window.location.href = "../index.html";
}



function toActive(secName, id, id2 = none) {
    let menu = document.querySelectorAll(`.${secName}`);
    menu.forEach(element => {
        if (element.classList.contains('menu-active')) {
            element.classList.remove('menu-active');
        }
    });
    document.querySelector(`#${id}`).classList.add('menu-active');
    toActiveSec('sections', id2)

}


function toActiveSec(section, id) {
    let sectons = document.querySelectorAll(`.${section}`);
    sectons.forEach(ele => {
        if (ele.classList.contains('active')) {
            ele.classList.remove('active');
        }
    });
    document.querySelector(`#${id}`).classList.add('active');
}


async function searchUser() {
    const email = document.getElementById('useremail').value;
    const res = await fetch('http://localhost:8080/api/admin/search', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email})
  });

  const data = await res.json();
  const resultDiv = document.getElementById('user_details');
      resultDiv.innerHTML = ''; // clear previous

      if (!data || data.error) {
        resultDiv.innerHTML = `<p style="color:red;">User not found</p>`;
        return;
      }

      const user = data;

      resultDiv.innerHTML = `
        <div class="user-card">
          <p><span class="label">Name:</span> ${user.name}</p>
          <p><span class="label">Email:</span> ${user.email}</p>
          <p><span class="label">Phone:</span> ${user.phone || 'N/A'}</p>
          <p><span class="label">Crew:</span> ${user.crew?.name || 'Not assigned'}</p>
          <p><span class="label">Captain:</span> ${user.captain?.name || 'Not assigned'}</p>
          <p><span class="label">Registered At:</span> ${new Date(user.createdAt).toLocaleString()}</p>
          <p><span class="label">Subscription:</span> ${user.isPaid ? '✅ Active' : '❌ Free User'}</p>
          <p><span class="label">Status:</span> ${user.statusMessage || '—'}</p>
        </div>
      `;

}