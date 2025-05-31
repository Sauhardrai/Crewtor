
let otpSent = false;
async function sendOtp() {
  const email = document.getElementById('inputemail').value;
  const otp = document.getElementById('inputotp').value;
  const btn = document.getElementById('otpbtn')

  if (!otpSent) {
    // console.log(email)
    const res = await fetch('http://localhost:8080/api/auth/sendotp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      otpSent = true;
      btn.textContent = 'Verify OTP';
      document.getElementById('inputotp').focus();
    } else {
      Swal.fire({
        icon: 'error',
        title: `${data.message}`
      });
    }

  } else {
    // console.log(otpSent)
    const res = await fetch('http://localhost:8080/api/auth/verifyotp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (res.ok) {
      btn.disabled = true;
      btn.textContent = 'Verified ✔';
      document.getElementById('Crbtn').focus();
    } else {
      Swal.fire({
        icon: 'error',
        title: `${data.message}`
      });
    }
  }
};



function checkForOtp() {
   const btn = document.getElementById('otpbtn');
  if (!btn.disabled) {
    alert('verify otp frist')
    return;
  } else {
    document.getElementById('otp_form').classList.add('hidden');
    document.getElementById('main_form').classList.remove('hidden');
  }
}


document.getElementById('signup_form').addEventListener('submit', async (e) => {
  e.preventDefault()

  const formData = new FormData(e.target);
  const data = {};
  formData.forEach((v, k) => data[k] = v);
  
  const res = await fetch('http://localhost:8080/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });

  const resdata = await res.json();
  if (res.ok){
    localStorage.setItem('token', resdata.token);
    Swal.fire({
        icon: 'success',
        title: `Sigup Success full`,
        text: 'Redirecting towards Dashboard'
      });
      setTimeout(()=>{
        window.location.href= 'crewdash.html'
      },2*1000);
  }else{
    Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: `${resdata.message}`
      });
    setTimeout(()=>{
        window.location.href= 'signup.html'
      },2*1000);
  }


});
