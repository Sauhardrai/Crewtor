const token = localStorage.getItem('token');

async function fetchDash() {
    let crewHtml =``;
    let captainhtml=``;
    const res = await fetch('https://crewtor-backend.onrender.com/api/admin/dashboard', {
    method: "GET",
    headers: { 'Content-Type': 'application/json' },
  });

  const {userCount , captainCount, captain , user} = await res.json();
  console.log(captain)
  console.log(user)
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