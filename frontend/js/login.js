const token = localStorage.getItem('token');
if (!token) {
    document.getElementById('loginform').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('inputemail').value;
        const password = document.getElementById('inputpassword').value

        const res = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            const decoded = jwt_decode(data.token);
            if (decoded.role === 'captain') {
                Swal.fire({
                    icon: 'success',
                    title: 'login successfull',
                    text: `${data.message} Redirecting to Dashboard.....`
                });
                setTimeout(() => {
                    window.location.href = 'capdash.html'
                }, 2 * 1000)
            } else if (decoded.role === 'user') {
                Swal.fire({
                    icon: 'success',
                    title: 'login successfull',
                    text: `${data.message} Redirecting to Dashboard.....`
                });
                setTimeout(() => {
                    window.location.href = 'crewdash.html'
                }, 2 * 1000)

            }
        }else {
            console.error("Login failed:", data.message);
            Swal.fire({
                icon: 'error',
                title: 'login failed',
                text: data.message
            })
            setTimeout(() => {
                    window.location.href = 'login.html'
                }, 3 * 1000)
        } 

    });
    




}else {
    const decoded = jwt_decode(token);
    if (decoded.role === 'captain') {
        Swal.fire({
            icon: 'success',
            title: 'login successfull',
            text: `welcome back Captain Redirecting to Dashboard.....`
        });
        setTimeout(() => {
            window.location.href = 'capdash.html'
        }, 2 * 1000)
    }else if (decoded.role === 'user') {
                Swal.fire({
                    icon: 'success',
                    title: 'login successfull',
                    text: 'welcome back  Redirecting to Dashboard.....'
                });
                setTimeout(() => {
                    window.location.href = 'crewdash.html'
                }, 2 * 1000)

            }
}