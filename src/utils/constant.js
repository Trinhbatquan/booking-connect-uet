export const path = {
  LOGIN_SYSTEM: "login",
  LOG_OUT: "logout?",
  SYSTEM: "/system",
  MANAGER: "/manager",

  scheduleManager: "scheduleManager",
  studentManager: "studentManager",

  adminManager: "adminManager",

  departmentManager: "departmentManager",
  departmentDescription: "departmentDescription",

  facultyManager: "facultyManager",
  facultyDescription: "facultyDescription",

  teacherManager: "teacherManager",
  teacherDescription: "teacherDescription",

  healthStudentManager: "healthStudentManager",
  healthStudentDescription: "healthStudentDescription",
  dashboardManager: "dashboardManager",
  notificationManager: "notificationManager",
  newsManager: "newsManager",

  // student: "student",

  //manager
  dashboard: "dashboard",
  notification: "notification",
  schedule: "schedule",
  student: "student?",

  //homepage
  UET: "https://uet.vnu.edu.vn",
  HOMEPAGE: "/trang-sinh-vien",
  detail_id: "khoa-vien",
  login_homepage: "dang-nhap?",
  update_profile: "cap-nhat-tai-khoan",
  change_password: "thay-doi-mat-khau",
  inform: "gioi-thieu",
  contact: "lien-he",
  survey: "khao-sat",
  teacher: "danh-sach-giang-vien",
  news: "danh-sach-tin-tuc",
  detail_news: "tin-tuc",
  notify: "danh-sach-thong-bao",
  detail_notify: "thong-bao",
  health: "danh-sach-suc-khoe-sinh-vien",
  processBooking: "booking-process",
};

export const languages = {
  VI: "vi",
  EN: "en",
};

export const manageActions = {
  ADD: "ADD",
  EDIT: "EDIT",
  DELETE: "DELETE",
};

export const dateFormat = {
  SEND_TO_SERVER: "DD-MM-YYYY",
  LABEL_SCHEDULE: "dddd - DD/MM/YYYY",
  TOMORROW_SCHEDULE: "[Ngày mai] - DD/MM/YYYY",
  TOMORROW_SCHEDULE_EN: "[Tomorrow] - DD/MM/YYYY",
  FORMAT_HOURS: "H-mm",
  FORMAT_HOURS_12H: "LT",
};

export const YesNoObj = {
  YES: "Y",
  NO: "N",
};

export const contact = {
  university: "144 Xuân Thuỷ - Cầu Giấy - Hà Nội",
};

export const ascertain_user = {
  teacher: "teacher",
  other: "otherUser",
};

export const select_faculty = [
  {
    label: "Khoa Điện Tử Viễn Thông",
    value: "Khoa Điện Tử Viễn Thông",
  },
  {
    label: "Khoa Vật lý Kĩ thuật và Công Nghệ Nano",
    value: "Khoa Vật lý Kĩ thuật và Công Nghệ Nano",
  },
  {
    label: "Khoa Công Nghệ Thông Tin",
    value: "Khoa Công Nghệ Thông Tin",
  },
  {
    label: "Khoa Công nghệ Nông Nghiệp",
    value: "Khoa Công nghệ Nông Nghiệp",
  },
  {
    label: "Khoa Công nghệ Xây dựng - Giao thông",
    value: "Khoa Công nghệ Xây dựng - Giao thông",
  },
  {
    label: "Viện Công nghệ Hàng không Vũ trụ",
    value: "Viện Công nghệ Hàng không Vũ trụ",
  },
  {
    label: "Khoa Cơ học Kĩ thuật và Tự động hoá",
    value: "Khoa Cơ học Kĩ thuật và Tự động hoá",
  },
  {
    label: "Viện Trí tuệ Nhân tạo",
    value: "Viện Trí tuệ Nhân tạo",
  },
];

export const markdown = {
  teacher: "teacher",
  other: "other",
};

export const positionCustom = (positionId, lang) => {
  if (positionId === "P1") {
    return lang === "en" ? "Professor" : "Giáo sư";
  } else if (positionId === "P2") {
    return lang === "en" ? "Associate Professor" : "Phó giáo sư";
  } else {
    return lang === "en" ? "Doctor of Philosophy" : "Tiến sĩ";
  }
};

export const statusCustom = (statusId, lang, actionId) => {
  if (statusId === "S1") {
    return lang === "en" ? "New" : "Mới";
  } else if (statusId === "S2") {
    return lang === "en" ? "In Process" : "Đang tiến hành";
  } else if (statusId === "S3") {
    return lang === "en"
      ? actionId === "A1"
        ? "Finished"
        : "Answer Directly"
      : actionId === "A1"
      ? "Đã hoàn thành"
      : "Trả lời trực tiếp";
  } else if (statusId === "S4") {
    return lang === "en" ? "Canceled" : "Bị huỷ bỏ";
  } else {
    return lang === "en" ? "Answer Automatically" : "Trả lời tự động";
  }
};
