CREATE DATABASE IF NOT EXISTS cyna_database;
USE cyna_database;

CREATE TABLE addresses (
   id INT AUTO_INCREMENT,
   address1 VARCHAR(200),
   city VARCHAR(100),
   postalcode VARCHAR(50),
   region VARCHAR(100),
   country VARCHAR(50),
   type VARCHAR(50),
   PRIMARY KEY(id)
);

CREATE TABLE product_categories (
   id INT AUTO_INCREMENT,
   name VARCHAR(50),
   description VARCHAR(50),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY(id)
);

CREATE TABLE service_types (
   id INT AUTO_INCREMENT,
   name VARCHAR(50),
   description VARCHAR(255),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY(id)
);

CREATE TABLE roles (
   id INT AUTO_INCREMENT,
   name VARCHAR(10),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY(id)
);

CREATE TABLE users (
   id INT AUTO_INCREMENT,
   name VARCHAR(50),
   email VARCHAR(50),
   password VARCHAR(255),
   phone VARCHAR(20),
   role_id INT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY(id),
   CONSTRAINT fk_users_role FOREIGN KEY(role_id) REFERENCES roles(id)
);

CREATE TABLE promo_codes (
   id INT AUTO_INCREMENT,
   code VARCHAR(50) NOT NULL UNIQUE,
   description TEXT,
   discount_type ENUM('percentage', 'fixed') NOT NULL,
   discount_value DECIMAL(10,2) NOT NULL,
   min_order_amount DECIMAL(10,2),
   max_discount_amount DECIMAL(10,2),
   start_date DATETIME,
   end_date DATETIME,
   max_uses INT,
   current_uses INT DEFAULT 0,
   is_active BOOLEAN DEFAULT true,
   is_public BOOLEAN DEFAULT false,
   created_by INT,
   is_first_purchase_only BOOLEAN DEFAULT false,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY(id),
   CONSTRAINT fk_promocodes_creator FOREIGN KEY(created_by) REFERENCES users(id)
);

CREATE TABLE carts (
   id INT AUTO_INCREMENT,
   creationdate DATETIME,
   lastupdate DATETIME,
   user_id INT NOT NULL,
   PRIMARY KEY(id),
   CONSTRAINT fk_carts_user FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE services (
   id INT AUTO_INCREMENT,
   name VARCHAR(50),
   description VARCHAR(255),
   status BOOLEAN,
   price DOUBLE,
   subscription BOOLEAN,
   subscriptiontype VARCHAR(50),
   usercount INT,
   promotion VARCHAR(255),
   service_type_id INT NOT NULL,
   promo_code_id INT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY(id),
   CONSTRAINT fk_services_type FOREIGN KEY(service_type_id) REFERENCES service_types(id),
   CONSTRAINT fk_services_promocode FOREIGN KEY(promo_code_id) REFERENCES promo_codes(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE products (
   id INT AUTO_INCREMENT,
   name VARCHAR(50),
   description VARCHAR(50),
   price DOUBLE,
   stock BIGINT,
   promotion VARCHAR(255),
   category_id INT NOT NULL,
   promo_code_id INT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY(id),
   CONSTRAINT fk_products_category FOREIGN KEY(category_id) REFERENCES product_categories(id),
   CONSTRAINT fk_products_promocode FOREIGN KEY(promo_code_id) REFERENCES promo_codes(id)
);

CREATE TABLE tickets (
   id INT AUTO_INCREMENT,
   subject VARCHAR(50),
   description VARCHAR(50),
   status VARCHAR(50),
   creationdate DATETIME,
   updatedate DATETIME,
   user_id INT NOT NULL,
   PRIMARY KEY(id),
   CONSTRAINT fk_tickets_user FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE chatbots (
   id INT AUTO_INCREMENT,
   escalated BOOLEAN,
   prompts TEXT,
   user_id INT NOT NULL,
   PRIMARY KEY(id),
   UNIQUE(user_id),
   CONSTRAINT fk_chatbots_user FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE chatbot_history (
   id INT AUTO_INCREMENT,
   chat TEXT,
   chatbot_id INT NOT NULL,
   PRIMARY KEY(id),
   CONSTRAINT fk_chathistory_chatbot FOREIGN KEY(chatbot_id) REFERENCES chatbots(id)
);

CREATE TABLE user_profiles (
   id INT AUTO_INCREMENT,
   user_id INT NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY(id),
   CONSTRAINT fk_userprofiles_user FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE orders (
   id INT AUTO_INCREMENT,
   creationdate DATETIME,
   totalprice DOUBLE,
   status VARCHAR(50),
   user_id INT NOT NULL,
   cart_id INT NOT NULL,
   PRIMARY KEY(id),
   CONSTRAINT fk_orders_user FOREIGN KEY(user_id) REFERENCES users(id),
   CONSTRAINT fk_orders_cart FOREIGN KEY(cart_id) REFERENCES carts(id)
);

CREATE TABLE order_items (
   id INT AUTO_INCREMENT,
   quantity INT,
   price DOUBLE,
   order_id INT NOT NULL,
   PRIMARY KEY(id),
   CONSTRAINT fk_orderitems_order FOREIGN KEY(order_id) REFERENCES orders(id)
);

CREATE TABLE payments (
   id INT AUTO_INCREMENT, 
   amount DOUBLE,
   status VARCHAR(50),
   creationdate DATETIME,
   method VARCHAR(50),
   order_id INT NOT NULL,
   PRIMARY KEY(id),
   CONSTRAINT fk_payments_order FOREIGN KEY(order_id) REFERENCES orders(id)
);

CREATE TABLE invoices (
   id INT AUTO_INCREMENT,
   name VARCHAR(50),
   email VARCHAR(50),
   amount DOUBLE,
   phone VARCHAR(20),
   creationdate DATETIME,
   method VARCHAR(50),
   quantity VARCHAR(50),
   user_id INT NOT NULL,
   payment_id INT NOT NULL,
   PRIMARY KEY(id),
   CONSTRAINT fk_invoices_user FOREIGN KEY(user_id) REFERENCES users(id),
   CONSTRAINT fk_invoices_payment FOREIGN KEY(payment_id) REFERENCES payments(id)
);

CREATE TABLE reviews (
   id INT AUTO_INCREMENT,
   rating INT,
   description VARCHAR(50),
   reviewdate DATE,
   service_id INT NOT NULL,
   product_id INT NOT NULL,
   user_profile_id INT NOT NULL,
   PRIMARY KEY(id),
   CONSTRAINT fk_reviews_service FOREIGN KEY(service_id) REFERENCES services(id),
   CONSTRAINT fk_reviews_product FOREIGN KEY(product_id) REFERENCES products(id),
   CONSTRAINT fk_reviews_userprofile FOREIGN KEY(user_profile_id) REFERENCES user_profiles(id)
);

CREATE TABLE stats (
   id INT AUTO_INCREMENT,
   user_profile_id INT NOT NULL,
   PRIMARY KEY(id),
   CONSTRAINT fk_stats_userprofile FOREIGN KEY(user_profile_id) REFERENCES user_profiles(id)
);

CREATE TABLE asso_orderitems_products (
   order_item_id INT,
   product_id INT,
   PRIMARY KEY(order_item_id, product_id),
   CONSTRAINT fk_aoip_orderitem FOREIGN KEY(order_item_id) REFERENCES order_items(id),
   CONSTRAINT fk_aoip_product FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE asso_orderitems_services (
   order_item_id INT,
   service_id INT,
   PRIMARY KEY(order_item_id, service_id),
   CONSTRAINT fk_aois_orderitem FOREIGN KEY(order_item_id) REFERENCES order_items(id),
   CONSTRAINT fk_aois_service FOREIGN KEY(service_id) REFERENCES services(id)
);

CREATE TABLE asso_addresses_user_profiles (
   address_id INT,
   user_profile_id INT,
   PRIMARY KEY(address_id, user_profile_id),
   CONSTRAINT fk_aaup_address FOREIGN KEY(address_id) REFERENCES addresses(id),
   CONSTRAINT fk_aaup_userprofile FOREIGN KEY(user_profile_id) REFERENCES user_profiles(id)
);

CREATE TABLE asso_categoryproducts_roles (
   category_id INT,
   role_id INT,
   PRIMARY KEY(category_id, role_id),
   CONSTRAINT fk_acpr_category FOREIGN KEY(category_id) REFERENCES product_categories(id),
   CONSTRAINT fk_acpr_role FOREIGN KEY(role_id) REFERENCES roles(id)
);

CREATE TABLE asso_servicetypes_roles (
   service_type_id INT,
   role_id INT,
   PRIMARY KEY(service_type_id, role_id),
   CONSTRAINT fk_astr_servicetype FOREIGN KEY(service_type_id) REFERENCES service_types(id),
   CONSTRAINT fk_astr_role FOREIGN KEY(role_id) REFERENCES roles(id)
);

CREATE TABLE asso_roles_promocodes (
   role_id INT,
   promo_code_id INT,
   PRIMARY KEY(role_id, promo_code_id),
   CONSTRAINT fk_arp_role FOREIGN KEY(role_id) REFERENCES roles(id),
   CONSTRAINT fk_arp_promocode FOREIGN KEY(promo_code_id) REFERENCES promo_codes(id)
);

CREATE TABLE asso_services_roles (
   service_id INT NOT NULL,
   role_id INT NOT NULL,
   PRIMARY KEY (service_id, role_id),
   CONSTRAINT fk_asr_service FOREIGN KEY (service_id) REFERENCES services(id),
   CONSTRAINT fk_asr_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE role_promo_codes (
   id INT AUTO_INCREMENT,
   role_id INT NOT NULL,
   promo_code_id INT NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY(id),
   CONSTRAINT fk_rpc_role FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE,
   CONSTRAINT fk_rpc_promocode FOREIGN KEY(promo_code_id) REFERENCES promo_codes(id) ON DELETE CASCADE,
   UNIQUE KEY unique_role_promo (role_id, promo_code_id)
);

CREATE TABLE promo_code_usage (
    id INT AUTO_INCREMENT,
    promo_code_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    CONSTRAINT fk_pcusage_promocode FOREIGN KEY(promo_code_id) REFERENCES promo_codes(id),
    CONSTRAINT fk_pcusage_user FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_pcusage_order FOREIGN KEY(order_id) REFERENCES orders(id)
);

CREATE TABLE team_members(
   id INT AUTO_INCREMENT,
   name VARCHAR(100) NOT NULL,
   role VARCHAR(100) NOT NULL,
   avatar VARCHAR(255),
   description TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY(id)
);

CREATE TABLE carousel_items (
   id INT AUTO_INCREMENT,
   product_id INT,
   service_id INT,
   `order` INT NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY(id),
   CONSTRAINT fk_ci_product FOREIGN KEY(product_id) REFERENCES products(id),
   CONSTRAINT fk_ci_service FOREIGN KEY(service_id) REFERENCES services(id)
);