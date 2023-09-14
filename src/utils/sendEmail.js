const nodemailer = require("nodemailer");
require("dotenv/config");

module.exports = async (email, studentData, subject, link, type) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: `${process.env.USER}${process.env.USER_SUB}`,
        pass: process.env.PASS,
      },
    });

    if (type === "verifyEmail") {
      await transporter.sendMail({
        from: `Quản trị viên của Hệ thống hỗ trợ đặt lịch hẹn UET: <${process.env.USER}${process.env.USER_SUB}>`,
        to: email,
        subject,
        html: `
      <h3>Xin chào ${studentData?.fullName}</h3>
      <h3>Email: ${studentData?.email}</h3>
      <p>Bạn nhận được email này để xác nhận thông tin đăng ký tài khoản của hệ thống.</p>
      <p>Vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đăng ký tài khoản.</p>
      <div>
      <a href=${link} target="_blank">Click here to finish.</a>
      </div>
      <p>Xin chân thành cảm ơn bạn.</p>
      `,
      });
      console.log("email sent successfully");
    } else if ((type = "forgotPass")) {
      await transporter.sendMail({
        from: `Quản trị viên của Hệ thống hỗ trợ đặt lịch hẹn UET: <${process.env.USER}${process.env.USER_SUB}>`,
        to: email,
        subject,
        html: `
      <h3>Xin chào ${studentData?.fullName}</h3>
      <h3>Email: ${studentData?.email}</h3>
      <p>Bạn nhận được email này để cập nhật mật khẩu tài khoản của bạn.</p>
      <p>Nếu thông tin này là đúng sự thật, vui lòng click vào đường link bên dưới để hoàn thiện tiến trình cập nhật này.</p>
      <div>
      <a href=${link} target="_blank">Click here to update password.</a>
      </div>
      <p>Xin chân thành cảm ơn bạn.</p>
      `,
      });
      console.log("email sent successfully");
    }
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return error;
  }
};
