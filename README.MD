# Booking Care UET

This is the project I am working on for my graduation thesis defense next December.

Its basic function is to support students in making schedules and questions for teachers, departments, and faculty members, and to support student health monitoring.

## Demo

Now, this project has not deployed yet.

## Features

- Login, register, secured by token and cookies
- Support student to make schedule and question
- Supports management page, statistics on appointment schedules, questions as well as list of teachers, departments, faculties,...
- Some other features.

## Tech Stack

**Client:** React, ReduxToolkit, TailwindCSS.

**Server:** Node, Express.

**Database:** SQL with sequelize ORM.

## Structure project

**a. For backend project structure:**

```
 src
│   ├── config
│   │   ├── config.json
│   │   ├── connectDB.js
│   │   └── viewEngine.js
│   ├── controllers
│   │   ├── allCodeController.js
│   │   ├── bookingController.js
│   │   ├── dashboardController.js
│   │   ├── homeController.js
│   │   ├── markdownController.js
│   │   ├── notification.js
│   │   ├── scheduleController.js
│   │   ├── studentController.js
│   │   ├── teacherController.js
│   │   └── userController.js
│   ├── middleware
│   │   ├── createTokenRandom.js
│   │   └── protectToken.js
│   ├── migrations
│   │   ├── migration-addColumn-user.js
│   │   ├── migration-changeColumn-user.js
│   │   ├── migration-create-addcode.js
│   │   ├── migration-create-answer.js
│   │   ├── migration-create-booking.js
│   │   ├── migration-create-history.js
│   │   ├── migration-create-markdown.js
│   │   ├── migration-create-notification.js
│   │   ├── migration-create-otherUser.js
│   │   ├── migration-create-schedule.js
│   │   ├── migration-create-student.js
│   │   ├── migration-create-teacher.js
│   │   ├── migration-create-tokenEmail.js
│   │   └── migration-create-user.js
│   ├── models
│   │   ├── admin.js
│   │   ├── allcode.js
│   │   ├── answer.js
│   │   ├── booking.js
│   │   ├── history.js
│   │   ├── index.js
│   │   ├── markdown.js
│   │   ├── notification.js
│   │   ├── other_user.js
│   │   ├── schedule.js
│   │   ├── student.js
│   │   ├── teacher.js
│   │   └── tokenEmail.js
│   ├── public
│   ├── routes
│   │   ├── dashboard.js
│   │   └── web.js
│   ├── services
│   │   ├── allCodeService.js
│   │   ├── bookingService.js
│   │   ├── dashboardService.js
│   │   ├── markdownService.js
│   │   ├── notificationService.js
│   │   ├── scheduleService.js
│   │   ├── studentService.js
│   │   ├── teacherService.js
│   │   └── userSevice.js
│   ├── utils
│   │   ├── addHoursDate.js
│   │   ├── checkDifferentArray.js
│   │   ├── contants.js
│   │   ├── convertTimeStamp.js
│   │   └── sendEmail.js
│   └── index.js
├── README.MD
├── package-lock.json
└── package.json
```

**b. For frontend project structure:**

```
public
│   ├── locales
│   │   ├── en
│   │   │   └── translations.json
│   │   └── vi
│   │       └── translations.json
├── src
│   ├── containers
│   │   ├── Auth
│   │   ├── HomePage
│   │   │   ├── Detail
│   │   │   ├── EmailVerify
│   │   │   ├── Login
│   │   │   ├── QuestionForm
│   │   │   ├── Schedule
│   │   │   ├── Section
│   │   │   ├── HomeBanner.js
│   │   │   ├── HomeBanner.scss
│   │   │   ├── HomeFooter.js
│   │   │   ├── HomeFooter.scss
│   │   │   ├── HomeHeader.js
│   │   │   ├── HomeHeader.scss
│   │   │   ├── HomePage.js
│   │   │   └── NavigateCustom.js
│   │   ├── Manager
│   │   │   ├── Dashboard
│   │   │   ├── Notification
│   │   │   ├── Schedule
│   │   │   ├── Student
│   │   │   └── RootManager.js
│   │   ├── System
│   │   │   ├── DashboardSystem
│   │   │   ├── DepartmentManager
│   │   │   ├── FacultyManager
│   │   │   ├── Header
│   │   │   ├── HealthStudentManager
│   │   │   ├── Modal
│   │   │   ├── ScheduleAndQuestionManager
│   │   │   ├── ScheduleManager
│   │   │   ├── TeacherManager
│   │   │   ├── RootSystem.js
│   │   │   ├── RootSystem.scss
│   │   │   └── index.js
│   │   └── App.js
│   ├── redux
│   ├── services
│   ├── styles
│   ├── utils
│   ├── axios.js
│   ├── i18n.js
│   ├── index.js
│   └── store.js
├── package-lock.json
├── package.json
└── tailwind.config.js
```

## Feedback

If you have any feedback, please reach out to us at

- Email: trinhbv09022001@gmail.com
- Linkedin: https://www.linkedin.com/in/trinhbatquan/

## Thanks

Thanks a lot for your attention.
