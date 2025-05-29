
  function goToStep(stepNumber) {
    const totalSteps = 3;

    // Validate current form step before going to next
    const currentStepElement = document.querySelector('.form-step.active');
    if (currentStepElement) {
      const inputs = currentStepElement.querySelectorAll('input, select');
      for (let input of inputs) {
        if (input.hasAttribute('required') && !input.value.trim()) {
          Swal.fire({
            icon: 'warning',
            title: 'Incomplete!',
            text: 'Please fill all required fields before continuing.'
          });
        //   input.focus();
          return;
        }
      }
    }

    // Proceed to selected step
    for (let i = 1; i <= totalSteps; i++) {
      document.getElementById('form-step-' + i).classList.remove('active');
      document.getElementById('step-' + i).classList.remove('active', 'completed');

      if (i < stepNumber) {
        document.getElementById('step-' + i).classList.add('completed');
      } else if (i === stepNumber) {
        document.getElementById('step-' + i).classList.add('active');
      }
    }

    document.getElementById('form-step-' + stepNumber).classList.add('active');
  }


function gobackTostep(stepNumber){
    const totalSteps = 3;
    // Proceed to selected step
    for (let i = 1; i <= totalSteps; i++) {
      document.getElementById('form-step-' + i).classList.remove('active');
      document.getElementById('step-' + i).classList.remove('active', 'completed');

      if (i < stepNumber) {
        document.getElementById('step-' + i).classList.add('completed');
      } else if (i === stepNumber) {
        document.getElementById('step-' + i).classList.add('active');
      }
    }

    document.getElementById('form-step-' + stepNumber).classList.add('active');
}



document.getElementById('multiStepForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {};
    
    formData.forEach((v, k) => data[k] = v);
    data['status']= 'pending';
    console.log(data)
    await fetch('https://sheetdb.io/api/v1/sr7cz6s27wc0y', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    });

    Swal.fire({
            icon: 'success',
            title: 'Form Submited!',
            text: 'We will notify you once we do background check.'
          });
    e.target.reset();
    setTimeout(()=>{
      window.location.href = '../index.html'
    },3*1000)
  });