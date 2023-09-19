const nodemailer = require("nodemailer");
require("dotenv/config");

module.exports = async ({
  email,
  studentData,
  subject,
  link,
  type,
  managerData,
  bookingData,
}) => {
  console.log(
    email,
    studentData,
    subject,
    link,
    type,
    managerData,
    bookingData
  );
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
    } else if (type === "forgotPass") {
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
    } else if (type === "booking-schedule-success") {
      const { date, time, role } = bookingData;
      await transporter.sendMail({
        from: `Quản trị viên của Hệ thống hỗ trợ đặt lịch hẹn UET: <${process.env.USER}${process.env.USER_SUB}>`,
        to: email,
        subject,
        html: `
      <h3>Xin chào ${studentData?.fullName}</h3>
      <h3>Email: ${studentData?.email}</h3>
      <p>Bạn đã đặt lịch hẹn gặp mặt trao đổi với ${
        role === "R5" ? "Giảng viên" : "Đơn vị"
      } ${managerData.fullName} vào ${date} với thời gian ${time}. </p>
      <p>Lịch hẹn của bạn đã được chấp nhận bởi ${
        role === "R5" ? "Giảng viên" : "Đơn vị"
      } ${managerData.fullName}.</p>
      <p>Vui lòng ghi nhớ thời gian cũng như địa điểm gặp mặt. Chúc buổi trao đổi của bạn thành công.</p>
      <p>Xin chân thành cảm ơn bạn.</p>
      `,
      });
      console.log("email sent successfully");
    } else if (type === "booking-schedule-cancel") {
      const { date, time, role, reasonCancel } = bookingData;
      await transporter.sendMail({
        from: `Quản trị viên của Hệ thống hỗ trợ đặt lịch hẹn UET: <${process.env.USER}${process.env.USER_SUB}>`,
        to: email,
        subject,
        html: `
      <h3>Xin chào ${studentData?.fullName}</h3>
      <h3>Email: ${studentData?.email}</h3>
      <p>Bạn đã đặt lịch hẹn gặp mặt trao đổi với ${
        role === "R3" ? "Giảng viên" : "Đơn vị"
      } ${managerData.fullName} vào ${date} với thời gian ${time}. </p>
      <p>Tuy nhiên, lịch hẹn của bạn đã bị huỷ bởi ${
        role === "R3" ? "Giảng viên" : "Đơn vị"
      } ${managerData.fullName}.</p>
      <p>Lý do huỷ lịch hẹn: ${reasonCancel}</p>
      <p>Rất xin lỗi bạn vì sự cố này. Mong bạn thông cảm và có sự điều chỉnh một lịch hẹn khác</p>
      <p>Xin chân thành cảm ơn bạn.</p>
      `,
      });
      console.log("email sent successfully");
    } else if (type === "booking-schedule-done") {
      const { date, time, role } = bookingData;
      await transporter.sendMail({
        from: `Quản trị viên của Hệ thống hỗ trợ đặt lịch hẹn UET: <${process.env.USER}${process.env.USER_SUB}>`,
        to: email,
        subject,
        html: `
      <h3>Xin chào ${studentData?.fullName}</h3>
      <h3>Email: ${studentData?.email}</h3>
      <p>Bạn đã đặt lịch hẹn gặp mặt trao đổi với ${
        role === "R5" ? "Giảng viên" : "Đơn vị"
      } ${managerData.fullName} vào ${date} với thời gian ${time}. </p>
      <p>Buổi hẹn của bạn đã được xác nhận hoàn thành bởi ${
        role === "R5" ? "Giảng viên" : "Đơn vị"
      } ${managerData.fullName}.</p>
      <p>Mong buổi hẹn vừa rồi đã giải quyết được những thắc mắc của bạn. Để hệ thống trở nên tốt hơn, vui lòng đưa ra những đánh giá về hệ thống trong phần "Đánh giá"</p>
      <p>Xin chân thành cảm ơn bạn.</p>
      `,
      });
      console.log("email sent successfully");
    } else if (type === "question-done") {
      const { role, subjectQuestion, answer } = bookingData;
      await transporter.sendMail({
        from: `Quản trị viên của Hệ thống hỗ trợ đặt lịch hẹn UET: <${process.env.USER}${process.env.USER_SUB}>`,
        to: email,
        subject,
        html: `
      <h3>Xin chào ${studentData?.fullName}</h3>
      <h3>Email: ${studentData?.email}</h3>
      <p>Bạn đã đặt câu hỏi cho ${role === "R5" ? "Giảng viên" : "Đơn vị"} ${
          managerData.fullName
        } với nội dung về ${subjectQuestion}. </p>
      <p>Câu hỏi của bạn đã được trả lời bỏi ${
        role === "R5" ? "Giảng viên" : "Đơn vị"
      } ${
          managerData.fullName
        } như sau: (Bạn có thể kéo dãn để nhìn thấy toàn bộ câu trả lời)</p>
      <textarea id="w3review" name="w3review">
        ${answer}
      </textarea>
      <p>Hi vọng câu trả lời này đã giải đáp được thắc mắc của bạn.</p>
      <p>Xin chân thành cảm ơn bạn.</p>
      `,
      });
      console.log("email sent successfully");
    } else if (type === "notify-checking-manager") {
      const { role, reason, date, timeType, address } = bookingData;
      await transporter.sendMail({
        from: `Quản trị viên của Hệ thống hỗ trợ đặt lịch hẹn UET: <${process.env.USER}${process.env.USER_SUB}>`,
        to: email,
        subject,
        html: `
      <h3>Xin chào ${role === "R5" ? "Giảng viên" : "Đơn vị"} ${
          managerData?.fullName
        }</h3>
      <h3>Email: ${managerData?.email}</h3>
      <p>Bạn có lịch hẹn trao đổi với sinh viên ${
        studentData.fullName
      } với nội dung về ${reason}. </p>
     <p>Lưu ý rằng cuộc họp sẽ diễn ra vào [ngày mai] ${date} trong khoảng thời gian ${timeType} tại ${address}.</p>
     <p>Chúc bạn có một buổi thảo luận thành công.</p>
      <p>Xin chân thành cảm ơn bạn.</p>
      `,
      });
      console.log("email sent successfully");
    } else if (type === "notify-checking-student") {
      const { role, reason, date, timeType, address } = bookingData;
      await transporter.sendMail({
        from: `Quản trị viên của Hệ thống hỗ trợ đặt lịch hẹn UET: <${process.env.USER}${process.env.USER_SUB}>`,
        to: email,
        subject,
        html: `
        <h3>Xin chào sinh viên ${studentData.fullName}</h3>
      <h3>Email: ${studentData?.email}</h3>
      <p>Bạn có lịch hẹn trao đổi với ${
        role === "R5" ? "Giảng viên" : "Đơn vị"
      } ${managerData?.fullName} với nội dung về ${reason}. </p>
     <p>Lưu ý rằng cuộc họp sẽ diễn ra vào [ngày mai] ${date} trong khoảng thời gian ${timeType} tại ${address}</p>
     <p>Chúc bạn có một buổi thảo luận thành công.</p>
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
