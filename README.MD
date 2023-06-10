# BOOKING - CONNECT - UET

### MVC

User --- (click, action,...) ---> Controller --- (manipulates) ---> (Model)
--- (updates) ---> View --- (sees) ---> User

The Model contains only the pure application data, it contains no logic describing how to present the data to a user. (Its just a data that is shipped across the application like for example from back-end server view and from front-end view to the database. In java programming, Model can be represented by the use of POJO (Plain-old-java-object) which is a simple java class.

The View presents the model’s data to the user. The view knows how to access the model’s data, but it does not know what this data means or what the user can do to manipulate it. View just represent, displays the application’s data on screen. View page are generally in the format of .html or .jsp in java programming (which is flexible).

The View presents the model’s data to the user. The view knows how to access the model’s data, but it does not know what this data means or what the user can do to manipulate it. View just represent, displays the application’s data on screen. View page are generally in the format of .html or .jsp in java programming (which is flexible).

The Controller exists between the view and the model. It is where the actual business logic is written. It listens to events triggered by the view (or another external source) and executes the appropriate reaction to these events. In most cases, the reaction is to call a method on the model. Since the view and the model are connected through a notification mechanism, the result of this action is then automatically reflected in the view

NodeJS ====> (Model + Migration + Seeder) + Router + Controller(owner) + Service(staff) + View(Html files)

### ejs: quản lý view trong nodejs - giúp viết logic trong HTML

### DB - MySQL - XAMPP

### Sequelize - connect database: một ORM cho MySQL, MariaDB, SQLite,... giúp thao tác với CSDL một cách dễ dàng

#### Datatype Date trong Sequelize lưu theo định dạng new Date (example: 2022-05-25 10:00:00)

### ORM: là một kĩ thuật lập trình giúp ánh xạ các record dữ liệu sang dạng object

#### Luồng: models/index.js (connect database) ---> check migrations tạo table trên xampp dựa theo models.

#### TÊN DATABASE TRONG MIGRATIONS PHẢI CÓ "S"
