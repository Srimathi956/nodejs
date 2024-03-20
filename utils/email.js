const nodemailer=require('nodemailer');
//const { login } = require('../Controller/authcontroller');

const sendEmail= async (option) =>{
  
    //CREATE A TRANSPORT 
    const transporter=nodemailer.createTransport({
     host: process.env.EMAIL_HOST,
     port: process.env.EMAIL_PORT,
     auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PSWD
     }
    })

    // Define EMAIL OPTIONS
     
    const emailOptions={
        from: 'Employee support<support@employee.com>',
        to: option.email,
        subject: option.subject,
        text: option.message
    }

   await transporter.sendMail(emailOptions);   


}
module.exports=sendEmail;