export const generateOTP = () => {

    // Declare a digits variable  
    // which stores all digits 
    var digits:string = '0123456789';
    let OTP:string = '';
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }
  