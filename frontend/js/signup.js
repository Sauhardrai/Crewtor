let otpSent = false;
let otpsd = 1234
document.getElementById('otpform').onsubmit = async (e) => {
  e.preventDefault();
  console.log('JS loaded'); 
  const form = e.target;
  const email = form.email.value;
  const otp = form.otp.value;
  const btn = document.getElementById('otpbtn');

  if (!otpSent) {
    // Send OTP
  

    if (otpsd) {
      otpSent = true;
      btn.textContent = 'Verify OTP';
    }
  } else {
    // Verify OTP
    if (otp == otpsd) {
      btn.disabled = true;
      btn.textContent = 'Verified ✔';
      
    }
  }
};










function sendform() {
  let main_div = document.querySelector('.singup-div');
  main_div.innerHTML = '';
  new_html = `<div class="mt-4 baner-div ">
                <a href="#"><img src="../assets/logo2.png " alt="" height="60px" class="logo-img"></a>
                <div class="form_div">
                <form class="row g-3 needs-validation" >
                    <div class="col-md-6 col-sm-6">
                        <label for="inputfirstname" class="form-label">First Name</label>
                        <input type="text" name="userfirstname" class="form-control" id="inputfirstname" required>
                    </div>
                    <div class="col-md-6 col-sm-6 ">
                        <label for="inputlastname" class="form-label">Last Name</label>
                        <input type="text" class="form-control" name="userlastname" id="inputlastname" required>
                    </div>
                    <div class="col-12">
                        <label for="inputPassword4" class="form-label">Password</label>
                        <input type="password" class="form-control" name="Password" id="inputPassword4" required>
                    </div>
                    <div class="col-12">
                        <label for="inputphone" class="form-label">Phone Number</label>
                        <input type="number" class="form-control" name="phonenumber" id="inputphone" required>
                    </div>
                    <div class="col-12">
                        <label for="inputAddress" class="form-label">Address</label>
                        <input type="text" class="form-control" id="inputAddress" name="address" placeholder="Full address" required>
                    </div>
                    
                        <button type="submit" class="btn sgbtn mt-3" >Creat an Account</button>
                    
                </form>
            </div>
                </div>`
  main_div.innerHTML = '' + new_html;
};



function checkForOtp() {
  const btn = document.getElementById('otpbtn');
  if (!btn.disabled){
    alert('verify otp frist')
    return;
  }else{
    sendform()
  }
}


