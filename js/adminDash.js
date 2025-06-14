const token = localStorage.getItem('token');

async function fetchDash() {
    let crewHtml = ``;
    let captainhtml = ``;
    const res = await fetch('https://crewtor-backend.onrender.com/api/admin/dashboard', {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    });

    const { userCount, captainCount, captain, user } = await res.json();
    window.captainsArr= captain;
    window.Users= user;
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
            <td>${ele.captain?.name || 'Not assigned'}</td>
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
    const resultDiv = document.getElementById('user_details');
    resultDiv.innerHTML = ''; // clear previous
    
   try{ Users.forEach((u)=>{
        if (u.email == email){
            user= u;
            return;
        }

    })
    
    if (!user) {
        resultDiv.innerHTML = `<p style="color:red;">User not found</p>`;
        return;
    }

    
    
   resultDiv.innerHTML = `
  <table class="user-table" border="1" cellpadding="8" cellspacing="0">
    <tr><td><strong>Name</strong></td><td>${user.name}</td></tr>
    <tr><td><strong>Email</strong></td><td>${user.email}</td></tr>
    <tr><td><strong>Phone</strong></td><td>${user.phone || 'N/A'}</td></tr>
    
    <tr><td><strong>Captain</strong></td><td>${user.captain?.name || 'Not assigned'}</td></tr>
    <tr><td><strong>Registered At</strong></td><td>${new Date(user.joinAt).toLocaleString()}</td></tr>
    <tr><td><strong>Subscription</strong></td><td>${user.isPaid ? '✅ Active' : '❌ Free User'}</td></tr>
    <tr><td><strong>Status</strong></td><td>${user.statusMessage || '—'}</td></tr>
  </table>
  <div><button class="btn mt-3" type="button" onClick='deleteUser()' >Delete User</button>
  <button class="btn mt-3" type="button" onClick="openForm()">Change Captain</button></div>

`;}catch(err){
    console.log(err)
    resultDiv.innerHTML = `<p style="color:red;">User not found</p>`;
        return;
}
}


async function openForm() {

  document.getElementById('updateModal').style.display = 'flex';
  const captainSelect = document.getElementById('edit_captain');
  captainSelect.innerHTML = captainsArr.map(c =>
    `<option value="${c._id}" ${user.captain?._id === c._id ? 'selected' : ''}>${c.name}</option>`
  ).join('');


  document.getElementById('updateModal').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const captain_id = captainSelect.value;
    const user_email = user.email;
   
    const res = await fetch('https://crewtor-backend.onrender.com/api/admin/userUpdate', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({captain_id , user_email})
    });

    const data = await res.json();
    if (res.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Captain  updated ',
            })
            setTimeout(() => {
                window.location.reload()
            }, 1 * 1000)
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Captain Is not Updated',
                text: data.message
            })
        }
  })
};

function closeForm() {
  document.getElementById('updateModal').style.display = 'none';
}
async function deleteUser() {
    const email = document.getElementById('useremail').value;
    const res = await fetch('https://crewtor-backend.onrender.com/api/admin/delete', {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email})
    });

    const data = await res.json();
    if (res.ok) {
            Swal.fire({
                icon: 'success',
                title: 'User Deleted ',
            })
            setTimeout(() => {
                window.location.reload()
            }, 1 * 1000)
        } else {
            Swal.fire({
                icon: 'error',
                title: 'User Is not deleted',
                text: data.message
            })
        }
}
