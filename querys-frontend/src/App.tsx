import { useEffect, useState } from 'react'
import './App.css'

type Producto = {
  id: number
  nombre: string
  precio: number
  stock: number
  imagen: string
}

const imagenesPorCategoria: Record<string, string> = {
  Periféricos:
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
  Audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  Accesorios:
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
  Video: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500',
  Almacenamiento:
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
}

type ProductoApi = Omit<Producto, 'imagen'> & { categoria: string }

const adaptarProducto = (producto: ProductoApi): Producto => ({
  ...producto,
  imagen:
    imagenesPorCategoria[producto.categoria] ??
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
})

function App() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [productosPocoStock, setProductosPocoStock] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [cantidades, setCantidades] =
    useState<Record<number, number>>({})

  const [editando, setEditando] = useState<number | null>(null)

  const [productoEditado, setProductoEditado] =
    useState<Producto | null>(null)

  const cargarProductos = async () => {
    try {
      const [respuestaProductos, respuestaPocoStock] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/products/productsWarning'),
      ])

      if (!respuestaProductos.ok) {
        throw new Error('No se pudieron cargar los productos')
      }

      if (!respuestaPocoStock.ok) {
        throw new Error('No se pudieron cargar los productos con poco stock')
      }

      const datosProductos: ProductoApi[] = await respuestaProductos.json()
      const datosPocoStock: ProductoApi[] = await respuestaPocoStock.json()

      setProductos(datosProductos.map(adaptarProducto))
      setProductosPocoStock(datosPocoStock.map(adaptarProducto))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Error de conexión')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    void cargarProductos()
  }, [])

  // Cambiar cantidad
  const cambiarCantidad = (id: number, cantidad: string) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: Number(cantidad),
    }))
  }

  // Reabastecer
  const reabastecer = async (id: number) => {
    const cantidad = cantidades[id] || 0

    if (cantidad <= 0) {
      alert('Ingresa una cantidad válida')
      return
    }

    try {
      const respuesta = await fetch(`/api/products/updateStock/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: cantidad }),
      })
      if (!respuesta.ok) throw new Error('No se pudo actualizar el stock')
      setCantidades((prev) => ({ ...prev, [id]: 0 }))
      await cargarProductos()
    } catch (requestError) {
      alert(requestError instanceof Error ? requestError.message : 'Error de conexión')
    }
  }

  // Eliminar
  const eliminarProducto = (id: number) => {
    const confirmar = window.confirm(
      '¿Estás seguro de que quieres eliminar este producto?'
    )

    if (!confirmar) return

    void (async () => {
      try {
        const respuesta = await fetch(`/api/products/delete/${id}`, { method: 'DELETE' })
        if (!respuesta.ok) throw new Error('No se pudo eliminar el producto')
        await cargarProductos()
      } catch (requestError) {
        alert(requestError instanceof Error ? requestError.message : 'Error de conexión')
      }
    })()
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
  const guardarEdicion = async () => {
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

    try {
      const respuesta = await fetch(`/api/products/update/${productoEditado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: productoEditado.nombre,
          precio: productoEditado.precio,
          stock: productoEditado.stock,
        }),
      })
      if (!respuesta.ok) throw new Error('No se pudo actualizar el producto')
      cancelarEdicion()
      await cargarProductos()
    } catch (requestError) {
      alert(requestError instanceof Error ? requestError.message : 'Error de conexión')
    }
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

        {cargando ? (
          <div className="sin-productos">
            <h2>Cargando productos...</h2>
          </div>
        ) : error ? (
          <div className="sin-productos">
            <h2>No se pudo conectar con la base de datos</h2>
            <p>{error}</p>
          </div>
        ) : productos.length > 0 ? (
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

export default App
