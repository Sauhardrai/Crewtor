const token = localStorage.getItem('token')
if (token) {
  window.decoded = jwt_decode(token);
  const expiry = decoded.exp * 1000; // because `exp` is in seconds, JS time is in ms
  const now = Date.now();

  if (now >= expiry) {
    alert("Session expired");
    localStorage.removeItem("token");
    // Redirect or show login popup
    window.location.href = "/login";
  }
}else{
    alert('You need to loging again');
    window.location.href = "/login";
}

if (decoded.role === 'captain') {
    const fetchDashboard = async () => {
        let crewHtml = ``
        const token = localStorage.getItem('token');

        const res = await fetch('https://crewtor-backend.onrender.com/api/dash/cap', {
            headers: { Authorization: `Bearer ${token}` },
        });

        const { data } = await res.json();
        if (res.ok) {
            document.getElementById('captainName').innerText = data.name;
            const form = document.getElementById('profileForm')
            form.elements['name'].value = data.name
            form.elements['email'].value = data.email

            const crew = data.crewmate;
            let oneHtml =``
            crew.forEach((crewmate) => {
                const formattedDate = new Date(crewmate.joinAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                });
                crewHtml += `
                <tr>
                <td>${crewmate.name}</td>
                <td>${formattedDate}</td>
                </tr>`
                if(crewmate.oneOne){
                    oneHtml += `
                <tr>
                <td>${crewmate.name}</td>
                <td>${crewmate.oneOne.date}</td>
                <td>${crewmate.oneOne.time}</td>
                <td><a class="btn" href=${crewmate.oneOne.link} target="_blank">join</a></td>
                </tr>`
                }
            });
            document.getElementById('crewtable').innerHTML = crewHtml;
            document.getElementById('onoST').innerHTML= oneHtml;

            const session = data.session;
            if (session) {
                const editForm = document.getElementById('editForm');

                editForm.elements['title'].value = session.title
                editForm.elements['date'].value = session.date
                editForm.elements['time'].value = session.time
                editForm.elements['zoom'].value = session.link

                document.getElementById('sessionTable').innerHTML = `
                    <tr>
                    <td>${session.title}</td>
                    <td>${session.date}</td>
                    <td>${session.time}</td>
                    <td><a class="btn" onclick="openEditForm()">Edit</a></td>
                    </tr>`

            } else {
                document.getElementById('sessionTable').innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; color: gray;">You don’t have any session</td>
                </tr>`;
            }

        

        } else {
            alert('Please login again.');
            window.location.href = 'login.html';
        }
    };
    fetchDashboard();

    document.getElementById('sessionForm').addEventListener('submit', async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target);
        const data = {};
        formData.forEach((v, k) => data[k] = v);

        const res = await fetch('https://crewtor-backend.onrender.com/api/dash/cap/session', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ data }),
        });
        const data_ = await res.json()

        if (res.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Session Created',
            })
            setTimeout(() => {
                toActive('menu-item', 'dashboard', 'dashboardsec')
            }, 2 * 1000);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Session is not Created',
                text: data_.message
            })
        }
    });

    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target);
        const data = {}
        formData.forEach((v, k) => data[k] = v);
        const res = await fetch('https://crewtor-backend.onrender.com/api/dash/cap/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ data }),
        });
        const data_ = await res.json()

        if (res.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Profile updated ',
            })
            setTimeout(() => {
                window.location.reload()
            }, 1 * 1000)
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Profile Is not Updated',
                text: data_.message
            })
        }



    })

    document.getElementById('OForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {}
        formData.forEach((v, k) => data[k] = v);
        const res = await fetch('https://crewtor-backend.onrender.com/api/dash/cap/session/One', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ data }),
        });
        const data_ = await res.json()

        if (res.ok) {
            Swal.fire({
                icon: 'success',
                title: 'One One Session Created',
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'One One Session is not Created',
                text: data_.message
            })
        }
    });





} else if (decoded.role === 'user') {

    const fetchDashboard = async () => {
        const token = localStorage.getItem('token');

        const res = await fetch('https://crewtor-backend.onrender.com/api/dash/crew', {
            headers: { Authorization: `Bearer ${token}` },
        });

        const { data } = await res.json();

        if (!data.isplan || new Date(data.planexp) < new Date()) {
            Swal.fire({
                icon: 'info',
                title: 'Registration Successful!',
                html: `
                🎉 All free slots are now full.<br>
                Your plan has expired or not purchased. Please buy a plan then we will assign you a Captain.
            `,
            })
        }
        if (res.ok) {

            function fordate(dt) {
                const formattedDate = new Date(dt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                });
                return formattedDate;
            }


            document.getElementById('name').innerText = data.name;
            const form = document.getElementById('profileForm')
            form.elements['name'].value = data.name
            form.elements['email'].value = data.email
            document.getElementById('userName').innerText = data.name;
            document.getElementById('userEmail').innerText = data.email;
            document.getElementById('userJoin').innerText = data.isplan ? fordate(data.planstart) : 'NaN';
            document.getElementById('userPlan').innerText = data.isplan ? data.plan : 'Free User';
            document.getElementById('userExp').innerText = data.isplan ? fordate(data.planexp) : 'NaN';

            const OneS = data.oneOne;

            if (OneS) {
                document.getElementById('OnOT').innerHTML = `
                <tr>
                <td>One-One Session with Captain</td>
                <td>${OneS.date}</td>
                <td>${OneS.time}</td>
                <td><a class="btn" href=${OneS.link} target="_blank">join</a></td>
                </tr>`
            }
            if (data.isCaptain){
                fetchCaptain(data.captain)
            }

        } 
    };
    fetchDashboard();
    

    const fetchCaptain = async (captain) => {
        const res = await fetch(`https://crewtor-backend.onrender.com/api/dash/crew/captain/${captain}`, {
    method: "GET",
        headers: { 'Content-Type': 'application/json' },
    // body: JSON.stringify({captain})
});

const { data } = await res.json();
if (res.ok) {
    document.getElementById('userCap').innerText = data.name;
    document.getElementById('crewlink').href = data.telegram;
    let crewHtml = ``
    document.getElementById('capName').innerText = data.name;
    const crew = data.crewmate
    const session = data.session

    if (session) {
        document.getElementById('sessionTable').innerHTML = `
            <tr>
            <td>${session.title}</td>
            <td>${session.date}</td>
            <td>${session.time}</td>
            <td><a class="btn" href=${session.link} target="_blank">join</a></td>
            </tr>`

    } else {
        document.getElementById('sessionTable').innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; color: gray;">Sessions Start After 30 June</td>
                </tr>`
    };


    crew.forEach((crewmate) => {
        const formattedDate = new Date(crewmate.joinAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        crewHtml += `
                <tr>
                <td>${crewmate.name}</td>
                <td>${formattedDate}</td>
                </tr>`
    });
    document.getElementById('crewtable').innerHTML = crewHtml;

}

    }

document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target);
    const data = {}
    formData.forEach((v, k) => data[k] = v);
    const res = await fetch('https://crewtor-backend.onrender.com/api/dash/crew/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ data }),
    });
    const data_ = await res.json()

    if (res.ok) {
        Swal.fire({
            icon: 'success',
            title: 'Profile updated ',
        })
        setTimeout(() => {
            window.location.reload()
        }, 1 * 1000)
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Profile Is not Updated',
            text: data_.message
        })
    }
});

document.getElementById('review_form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    const data = {};
    data['Email'] = decoded.email;
    formData.forEach((v, k) => data[k] = v);


    await fetch('https://sheetdb.io/api/v1/sr7cz6s27wc0y?sheet=sheet2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
    });

    Swal.fire({
        icon: 'success',
        title: 'Form Submited!',

    });
    e.target.reset();
})
}






function toActive(secName, id, id2 = none) {
    if ((id === 'profile') || checkPlanBeforeAccess()) {
        let menu = document.querySelectorAll(`.${secName}`);
        menu.forEach(element => {
            if (element.classList.contains('menu-active')) {
                element.classList.remove('menu-active');
            }
        });
        document.querySelector(`#${id}`).classList.add('menu-active');
        toActiveSec('sections', id2)

    }
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


function logout() {
    localStorage.removeItem("token");
    window.location.href = "../index.html";
}



function openEditForm() {
    document.getElementById("editFormPopup").style.display = "block";

}

function closeEditForm() {
    document.getElementById("editFormPopup").style.display = "none";
}

async function deletesession() {
    const res = await fetch('https://crewtor-backend.onrender.com/api/dash/cap/session/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },

    });

    const data = await res.json();

    if (res.ok) {
        Swal.fire({
            icon: 'success',
            title: 'Session Deleted ',
        })
        setTimeout(() => {
            window.location.reload()
        }, 1 * 1000)
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Session Is not deleted',
            text: data.message
        })
    }
}

document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();


    const formData = new FormData(e.target);
    const editdata = {}
    formData.forEach((v, k) => editdata[k] = v);

    const res = await fetch('https://crewtor-backend.onrender.com/api/dash/cap/session/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ editdata }),
    });

    const data = await res.json();

    if (res.ok) {
        Swal.fire({
            icon: 'success',
            title: 'Session updated ',
        })
        setTimeout(() => {
            window.location.reload()
        }, 1 * 1000)
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Session Is not Updated',
            text: data.message
        })
    }
})

async function checkPlanBeforeAccess() {
    if (decoded.role === 'captain'){
        return true
    }else{
    const res = await fetch("https://crewtor-backend.onrender.com/api/dash/crew", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const { data } = await res.json();
    if (!data.isplan || new Date(data.planexp) < new Date()) {
        Swal.fire({
            icon: 'warning',
            title: 'Please Buy a Plan to Access Features',
            showConfirmButton: true,
            confirmButtonText: 'View Plans'
        }).then(() => {
            window.location.href = '../html/plans.html';
        });
    }
    return true;

}};
