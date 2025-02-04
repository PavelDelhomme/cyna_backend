CREATE DATABASE IF NOT EXISTS cyna_database;
USE cyna_database;

CREATE TABLE ADDRESSES (
   id INT AUTO_INCREMENT,
   Address1 VARCHAR(200),
   City VARCHAR(100),
   PostalCode VARCHAR(50),
   Region VARCHAR(100),
   Country VARCHAR(50),
   Type VARCHAR(50),
   PRIMARY KEY(id)
);

CREATE TABLE PRODUCT_CATEGORIES (
   id INT AUTO_INCREMENT,
   Name VARCHAR(50),
   Description VARCHAR(50),
   PRIMARY KEY(id)
);

CREATE TABLE SERVICE_TYPES (
   id INT AUTO_INCREMENT,
   Name VARCHAR(50),
   Description VARCHAR(255),
   PRIMARY KEY(id)
);

CREATE TABLE ROLES (
   id INT AUTO_INCREMENT,
   Name VARCHAR(10),
   PRIMARY KEY(id)
);

CREATE TABLE PROMO_CODES (
   id INT AUTO_INCREMENT,
   Name VARCHAR(50),
   Benefit VARCHAR(50),
   Status BOOLEAN,
   PRIMARY KEY(id)
);

CREATE TABLE USERS (
   id INT AUTO_INCREMENT,
   Name VARCHAR(50),
   Email VARCHAR(50),
   Password VARCHAR(50),
   Phone VARCHAR(20),
   role_id INT,
   PRIMARY KEY(id),
   FOREIGN KEY(role_id) REFERENCES ROLES(id)
);

CREATE TABLE CARTS (
   id INT AUTO_INCREMENT,
   CreationDate DATETIME,
   LastUpdate DATETIME,
   user_id INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(user_id) REFERENCES USERS(id)
);

CREATE TABLE SERVICES (
   id INT AUTO_INCREMENT,
   Name VARCHAR(50),
   Description VARCHAR(255),
   Status BOOLEAN,
   Price DOUBLE,
   Subscription BOOLEAN,
   SubscriptionType VARCHAR(50),
   UserCount INT,
   Promotion VARCHAR(255),
   service_type_id INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(service_type_id) REFERENCES SERVICE_TYPES(id)
);

CREATE TABLE PRODUCTS (
   id INT AUTO_INCREMENT,
   Name VARCHAR(50),
   Description VARCHAR(50),
   Price DOUBLE,
   Stock BIGINT,
   Promotion VARCHAR(255),
   category_id INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(category_id) REFERENCES PRODUCT_CATEGORIES(id)
);

CREATE TABLE TICKETS (
   id INT AUTO_INCREMENT,
   Subject VARCHAR(50),
   Description VARCHAR(50),
   Status VARCHAR(50),
   CreationDate DATETIME,
   UpdateDate DATETIME,
   user_id INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(user_id) REFERENCES USERS(id)
);

CREATE TABLE CHATBOTS (
   id INT AUTO_INCREMENT,
   Escalated BOOLEAN,
   Prompts TEXT,
   user_id INT NOT NULL,
   PRIMARY KEY(id),
   UNIQUE(user_id),
   FOREIGN KEY(user_id) REFERENCES USERS(id)
);

CREATE TABLE CHATBOT_HISTORY (
   id INT AUTO_INCREMENT,
   Chat TEXT,
   chatbot_id INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(chatbot_id) REFERENCES CHATBOTS(id)
);

CREATE TABLE USER_PROFILES (
   id INT AUTO_INCREMENT,
   user_id INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(user_id) REFERENCES USERS(id)
);

CREATE TABLE ORDERS (
   id INT AUTO_INCREMENT,
   CreationDate DATETIME,
   TotalPrice DOUBLE,
   Status VARCHAR(50),
   user_id INT NOT NULL,
   cart_id INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(user_id) REFERENCES USERS(id),
   FOREIGN KEY(cart_id) REFERENCES CARTS(id)
);

CREATE TABLE ORDER_ITEMS (
   id INT AUTO_INCREMENT,
   Quantity INT,
   Price DOUBLE,
   order_id INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(order_id) REFERENCES ORDERS(id)
);

CREATE TABLE PAYMENTS (
   id INT AUTO_INCREMENT, 
   Amount DOUBLE,
   Status VARCHAR(50),
   CreationDate DATETIME,
   Method VARCHAR(50),
   order_id INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(order_id) REFERENCES ORDERS(id)
);

CREATE TABLE INVOICES (
   id INT AUTO_INCREMENT,
   Name VARCHAR(50),
   Email VARCHAR(50),
   Amount DOUBLE,
   Phone VARCHAR(20),
   CreationDate DATETIME,
   Method VARCHAR(50),
   Quantity VARCHAR(50),
   user_id INT NOT NULL,
   payment_id INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(user_id) REFERENCES USERS(id),
   FOREIGN KEY(payment_id) REFERENCES PAYMENTS(id)
);

CREATE TABLE REVIEWS (
   id INT AUTO_INCREMENT,
   Rating INT,
   Description VARCHAR(50),
   ReviewDate DATE,
   service_id INT NOT NULL,
   product_id INT NOT NULL,
   user_profile_id INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(service_id) REFERENCES SERVICES(id),
   FOREIGN KEY(product_id) REFERENCES PRODUCTS(id),
   FOREIGN KEY(user_profile_id) REFERENCES USER_PROFILES(id)
);

CREATE TABLE STATS (
   id INT AUTO_INCREMENT,
   user_profile_id INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(user_profile_id) REFERENCES USER_PROFILES(id)
);

CREATE TABLE ASSO_ORDERITEMS_PRODUCTS (
   order_item_id INT,
   product_id INT,
   PRIMARY KEY(order_item_id, product_id),
   FOREIGN KEY(order_item_id) REFERENCES ORDER_ITEMS(id),
   FOREIGN KEY(product_id) REFERENCES PRODUCTS(id)
);

CREATE TABLE ASSO_ORDERITEMS_SERVICES (
   order_item_id INT,
   service_id INT,
   PRIMARY KEY(order_item_id, service_id),
   FOREIGN KEY(order_item_id) REFERENCES ORDER_ITEMS(id),
   FOREIGN KEY(service_id) REFERENCES SERVICES(id)
);

CREATE TABLE ASSO_ADDRESSES_USER_PROFILES (
   address_id INT,
   user_profile_id INT,
   PRIMARY KEY(address_id, user_profile_id),
   FOREIGN KEY(address_id) REFERENCES ADDRESSES(id),
   FOREIGN KEY(user_profile_id) REFERENCES USER_PROFILES(id)
);

CREATE TABLE ASSO_CATEGORYPRODUCTS_ROLES (
   category_id INT,
   role_id INT,
   PRIMARY KEY(category_id, role_id),
   FOREIGN KEY(category_id) REFERENCES PRODUCT_CATEGORIES(id),
   FOREIGN KEY(role_id) REFERENCES ROLES(id)
);

CREATE TABLE ASSO_SERVICETYPES_ROLES (
   service_type_id INT,
   role_id INT,
   PRIMARY KEY(service_type_id, role_id),
   FOREIGN KEY(service_type_id) REFERENCES SERVICE_TYPES(id),
   FOREIGN KEY(role_id) REFERENCES ROLES(id)
);

CREATE TABLE ASSO_ROLES_PROMOCODES (
   role_id INT,
   promo_code_id INT,
   PRIMARY KEY(role_id, promo_code_id),
   FOREIGN KEY(role_id) REFERENCES ROLES(id),
   FOREIGN KEY(promo_code_id) REFERENCES PROMO_CODES(id)
);

CREATE TABLE ASSO_SERVICES_ROLES (
   service_id INT NOT NULL,
   role_id INT NOT NULL,
   PRIMARY KEY (service_id, role_id),
   FOREIGN KEY (service_id) REFERENCES SERVICES(id),
   FOREIGN KEY (role_id) REFERENCES ROLES(id)
);
