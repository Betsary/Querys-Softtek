import { useState } from 'react'
import '../App.css'

type Producto = {
  id: number
  nombre: string
  precio: number
  stock: number
  imagen: string
}

const productosIniciales: Producto[] = [
  {
    id: 1,
    nombre: 'Laptop',
    precio: 15000,
    stock: 8,
    imagen:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
  },
  {
    id: 2,
    nombre: 'Audífonos',
    precio: 1200,
    stock: 15,
    imagen:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  },
  {
    id: 3,
    nombre: 'Teclado',
    precio: 850,
    stock: 4,
    imagen:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
  },
  {
    id: 4,
    nombre: 'Mouse',
    precio: 500,
    stock: 0,
    imagen:
      'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
  },
]

function Tienda() {
  const [productos, setProductos] =
    useState<Producto[]>(productosIniciales)

  const [cantidades, setCantidades] =
    useState<Record<number, number>>({})

  const [editando, setEditando] = useState<number | null>(null)

  const [productoEditado, setProductoEditado] =
    useState<Producto | null>(null)

  // Productos con 10 o menos unidades
  const productosPocoStock = productos.filter(
    (producto) => producto.stock <= 10
  )

  // Cambiar cantidad
  const cambiarCantidad = (id: number, cantidad: string) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: Number(cantidad),
    }))
  }

  // Reabastecer
  const reabastecer = (id: number) => {
    const cantidad = cantidades[id] || 0

    if (cantidad <= 0) {
      alert('Ingresa una cantidad válida')
      return
    }

    setProductos((prev) =>
      prev.map((producto) =>
        producto.id === id
          ? {
              ...producto,
              stock: producto.stock + cantidad,
            }
          : producto
      )
    )

    setCantidades((prev) => ({
      ...prev,
      [id]: 0,
    }))
  }

  // Eliminar
  const eliminarProducto = (id: number) => {
    const confirmar = window.confirm(
      '¿Estás seguro de que quieres eliminar este producto?'
    )

    if (!confirmar) return

    setProductos((prev) =>
      prev.filter((producto) => producto.id !== id)
    )
  }

  // Editar
  const abrirEdicion = (producto: Producto) => {
    setEditando(producto.id)
    setProductoEditado({ ...producto })
  }

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditando(null)
    setProductoEditado(null)
  }

  // Guardar edición
  const guardarEdicion = () => {
    if (!productoEditado) return

    if (!productoEditado.nombre.trim()) {
      alert('El nombre es obligatorio')
      return
    }

    if (productoEditado.precio < 0) {
      alert('El precio no puede ser negativo')
      return
    }

    if (productoEditado.stock < 0) {
      alert('El stock no puede ser negativo')
      return
    }

    setProductos((prev) =>
      prev.map((producto) =>
        producto.id === productoEditado.id
          ? productoEditado
          : producto
      )
    )

    cancelarEdicion()
  }

 // Tarjeta de producto
const ProductoCard = ({
  producto,
  modo,
}: {
  producto: Producto
  modo: 'todos' | 'poco-stock'
}) => (
  <article className="producto">
    <img
      src={producto.imagen}
      alt={producto.nombre}
      className="producto-imagen"
    />

    <div className="producto-info">
      {editando === producto.id && productoEditado ? (
        <div className="formulario-edicion">
          <h2>Editar producto</h2>

          <label>
            Nombre
            <input
              type="text"
              value={productoEditado.nombre}
              onChange={(e) =>
                setProductoEditado({
                  ...productoEditado,
                  nombre: e.target.value,
                })
              }
            />
          </label>

          <label>
            Precio
            <input
              type="number"
              min="0"
              value={productoEditado.precio}
              onChange={(e) =>
                setProductoEditado({
                  ...productoEditado,
                  precio: Number(e.target.value),
                })
              }
            />
          </label>

          <label>
            Stock
            <input
              type="number"
              min="0"
              value={productoEditado.stock}
              onChange={(e) =>
                setProductoEditado({
                  ...productoEditado,
                  stock: Number(e.target.value),
                })
              }
            />
          </label>

          <label>
            URL de imagen
            <input
              type="text"
              value={productoEditado.imagen}
              onChange={(e) =>
                setProductoEditado({
                  ...productoEditado,
                  imagen: e.target.value,
                })
              }
            />
          </label>

          <div className="acciones-edicion">
            <button
              className="btn-guardar"
              onClick={guardarEdicion}
            >
               Guardar
            </button>

            <button
              className="btn-cancelar"
              onClick={cancelarEdicion}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="producto-titulo">
            <h2>{producto.nombre}</h2>

            {/* SOLO EN TODOS LOS PRODUCTOS */}
            {modo === 'todos' && (
              <div className="acciones-producto">
                <button
                  className="btn-editar"
                  onClick={() => abrirEdicion(producto)}
                  title="Editar producto"
                >
                  ✏️
                </button>

                <button
                  className="btn-eliminar"
                  onClick={() =>
                    eliminarProducto(producto.id)
                  }
                  title="Eliminar producto"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>

          <p className="precio">
            ${producto.precio.toLocaleString('es-MX')}
          </p>

          <div className="stock">
            <span>Stock:</span>

            <strong
              className={
                producto.stock === 0
                  ? 'agotado'
                  : producto.stock <= 10
                    ? 'poco-stock'
                    : 'disponible'
              }
            >
              {producto.stock === 0
                ? 'Agotado'
                : `${producto.stock} unidades`}
            </strong>
          </div>

          {/* SOLO EN POCO STOCK */}
          {modo === 'poco-stock' && (
            <div className="reabastecimiento">
              <input
                type="number"
                min="1"
                placeholder="Cantidad"
                value={cantidades[producto.id] || ''}
                onChange={(e) =>
                  cambiarCantidad(
                    producto.id,
                    e.target.value
                  )
                }
              />

              <button
                onClick={() =>
                  reabastecer(producto.id)
                }
              >
                Reabastecer
              </button>
            </div>
          )}
        </>
      )}
    </div>
  </article>
)


  return (
    <main className="tienda">

      {/* HEADER */}
      <header className="header">
        <div>
          <h1>Mi Tienda</h1>
          <p>Control de inventario</p>
        </div>

        <div className="resumen">
          <strong>{productos.length}</strong>
          <span>productos</span>
        </div>
      </header>

      {/* TODOS LOS PRODUCTOS */}
      <section className="seccion-productos">
        <div className="titulo-seccion">
          <div>
            <h2>Todos los productos</h2>
            <p>Inventario completo de la tienda</p>
          </div>

          <span className="contador azul">
            {productos.length}
          </span>
        </div>

        {productos.length > 0 ? (
         <div className="productos">
          {productos.map((producto) => (
            <ProductoCard
              key={producto.id}
              producto={producto}
              modo="todos"
            />
          ))}
        </div>
        ) : (
          <div className="sin-productos">
            <span></span>
            <h2>No hay productos</h2>
            <p>
              Actualmente no tienes productos registrados.
            </p>
          </div>
        )}
      </section>

      {/* POCO STOCK */}
      {productosPocoStock.length > 0 && (
        <section className="seccion-productos poco-stock-seccion">

          <div className="titulo-seccion">
            <div>
              <h2>⚠️ Productos con poco stock</h2>
              <p>
                Productos que tienen 10 o menos unidades
              </p>
            </div>

            <span className="contador rojo">
              {productosPocoStock.length}
            </span>
          </div>

          <div className="productos">
        {productosPocoStock.map((producto) => (
          <ProductoCard
            key={producto.id}
            producto={producto}
            modo="poco-stock"
          />
        ))}
</div>
        </section>
      )}

    </main>
  )
}

export default Tienda