CREATE TABLE producto (
	id_producto INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(500) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    status BOOLEAN NOT NULL,
    precio DECIMAL(7,2) NOT NULL CHECK (precio >= 0),
    stock INT NOT NULL CHECK (stock >= 0)
);

INSERT INTO producto
    (id_producto, nombre, descripcion, categoria, status, precio, stock)
VALUES
    (1, 'Teclado mecánico', 'Teclado mecánico RGB con conexión USB', 'Periféricos', TRUE, 899.99, 15),
    (2, 'Mouse inalámbrico', 'Mouse ergonómico con receptor USB', 'Periféricos', TRUE, 349.90, 30),
    (3, 'Audífonos gamer', 'Audífonos con micrófono y sonido envolvente', 'Audio', TRUE, 749.50, 12),
    (4, 'Memoria USB 64 GB', 'Unidad USB 3.0 con capacidad de 64 GB', 'Almacenamiento', TRUE, 189.99, 50),
    (5, 'Base para laptop', 'Base ajustable de aluminio para computadora portátil', 'Accesorios', TRUE, 599.00, 20),
    (6, 'Webcam Full HD', 'Cámara web con resolución 1080p y micrófono integrado', 'Video', TRUE, 949.99, 8),
    (7, 'Cable HDMI', 'Cable HDMI de alta velocidad con longitud de 2 metros', 'Accesorios', TRUE, 159.50, 40),
    (8, 'Bocina Bluetooth', 'Bocina portátil inalámbrica con batería recargable', 'Audio', FALSE, 699.00, 0),
    (9, 'Mousepad XL', 'Alfombrilla extendida con superficie antideslizante', 'Periféricos', TRUE, 299.99, 25),
    (10, 'Adaptador USB-C', 'Adaptador USB-C a USB 3.0 compatible con laptops y teléfonos', 'Accesorios', TRUE, 249.90, 35);

DELIMITER //
 
CREATE PROCEDURE ReabastecerProducto(
	IN stock_nuevo INT,
    IN producto_id INT
)
BEGIN
    UPDATE producto
    SET stock = stock + stock_nuevo
    WHERE id_producto = producto_id;
END //
 
DELIMITER ;

DELIMITER //
CREATE TRIGGER validar_stock
BEFORE UPDATE ON producto
FOR EACH ROW
BEGIN
    IF NEW.stock < 0 THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El stock no puede ser negativo';
    ELSEIF NEW.stock = 0 THEN
        SET NEW.status = false;
    END IF;
END//
 
DELIMITER ;

DROP PROCEDURE IF EXISTS CRUD;

DELIMITER //
CREATE PROCEDURE CRUD(
    IN p_option INT,
    IN p_data JSON
)
BEGIN
    DECLARE v_product_id INT;
    DECLARE v_stock_update INT;
    DECLARE v_nombre VARCHAR(100);
    DECLARE v_precio DECIMAL(7,2);
    DECLARE v_stock INT;

    SET v_product_id = CAST(JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.productId')) AS UNSIGNED);
    SET v_stock_update = CAST(JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.stockUpdate')) AS UNSIGNED);
    SET v_nombre = JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.nombre'));
    SET v_precio = CAST(JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.precio')) AS DECIMAL(7,2));
    SET v_stock = CAST(JSON_UNQUOTE(JSON_EXTRACT(p_data, '$.stock')) AS UNSIGNED);

    CASE p_option
        WHEN 1 THEN
            SELECT id_producto AS id, nombre, descripcion, categoria, status, precio, stock
            FROM producto
            ORDER BY id_producto;
        WHEN 2 THEN
            SELECT id_producto AS id, nombre, descripcion, categoria, status, precio, stock
            FROM producto
            WHERE (stock <= 10 AND precio > 100) OR (stock <= 3 AND precio <= 100)
            ORDER BY stock, id_producto;
        WHEN 3 THEN
            CALL ReabastecerProducto(v_stock_update, v_product_id);
            SELECT id_producto AS id, nombre, descripcion, categoria, status, precio, stock
            FROM producto WHERE id_producto = v_product_id;
        WHEN 4 THEN
            DELETE FROM producto WHERE id_producto = v_product_id;
            SELECT ROW_COUNT() AS affectedRows;
        WHEN 5 THEN
            UPDATE producto
            SET nombre = v_nombre, precio = v_precio, stock = v_stock
            WHERE id_producto = v_product_id;
            SELECT id_producto AS id, nombre, descripcion, categoria, status, precio, stock
            FROM producto WHERE id_producto = v_product_id;
        ELSE
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Opción CRUD no válida';
    END CASE;
END //
DELIMITER ;