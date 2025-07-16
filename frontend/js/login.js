const token = localStorage.getItem('token');
if (!token) {
    document.getElementById('loginform').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('inputemail').value;
        const password = document.getElementById('inputpassword').value

        const res = await fetch('https://crewtor-backend.onrender.com/api/auth/login', {
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

            } else if (decoded.role === 'admin') {
                window.location.href = 'adminDash.html'
            }
        } else {
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





} else {
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
    } else if (decoded.role === 'user') {
        Swal.fire({
            icon: 'success',
            title: 'login successfull',
            text: 'welcome back  Redirecting to Dashboard.....'
        });
        setTimeout(() => {
            window.location.href = 'crewdash.html'
        }, 2 * 1000)

    } else if (decoded.role === 'admin') {
        window.location.href = 'adminDash.html'
    }
}

 function showPassword() {
    const btn= document.getElementById('inputpassword')
    const eye= document.getElementById('eye')
    if (btn.type === 'password'){
        btn.type = 'text'
        eye.classList.add('fa-eye-slash')
        eye.classList.remove('fa-eye')
    }else{
        btn.type = 'password'
        eye.classList.remove('fa-eye-slash')
        eye.classList.add('fa-eye')
    }
}