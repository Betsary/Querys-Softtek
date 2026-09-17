import { useMemo, useState } from "react";
import "./Dashboard.css";

type Filtros = {
  genero: string;
  rangoEdad: string;
  departamento: string;
  idUsuario: string;
};

const usuarios = [
  {
    id: 1001,
    nombre: "Ana López",
    genero: "Femenino",
    edad: 28,
    departamento: "Recursos Humanos",
    masajes: true,
    rehabilitacion: false,
  },
  {
    id: 1002,
    nombre: "Carlos Pérez",
    genero: "Masculino",
    edad: 35,
    departamento: "Finanzas",
    masajes: false,
    rehabilitacion: true,
  },
  {
    id: 1003,
    nombre: "María García",
    genero: "Femenino",
    edad: 42,
    departamento: "Recursos Humanos",
    masajes: true,
    rehabilitacion: true,
  },
  {
    id: 1004,
    nombre: "Juan Rodríguez",
    genero: "Masculino",
    edad: 24,
    departamento: "Tecnología",
    masajes: false,
    rehabilitacion: false,
  },
  {
    id: 1005,
    nombre: "Laura Martínez",
    genero: "Femenino",
    edad: 31,
    departamento: "Finanzas",
    masajes: true,
    rehabilitacion: true,
  },
  {
    id: 1006,
    nombre: "Pedro Sánchez",
    genero: "Masculino",
    edad: 48,
    departamento: "Operaciones",
    masajes: true,
    rehabilitacion: false,
  },
  {
    id: 1007,
    nombre: "Sofía Torres",
    genero: "Femenino",
    edad: 26,
    departamento: "Tecnología",
    masajes: false,
    rehabilitacion: true,
  },
  {
    id: 1008,
    nombre: "Miguel Hernández",
    genero: "Masculino",
    edad: 55,
    departamento: "Operaciones",
    masajes: false,
    rehabilitacion: false,
  },
];




function Dashboard() {
    const [filtros, setFiltros] = useState<Filtros>({
      genero: "",
      rangoEdad: "",
      departamento: "",
      idUsuario: "",
    });
  const [menuAbierto, setMenuAbierto] = useState(false);

    const actualizarFiltro = (
      campo: keyof Filtros,
      valor: string
    ) => {
      setFiltros((prev) => ({
        ...prev,
        [campo]: valor,
      }));
    };

  const limpiarFiltros = () => {
    setFiltros({
      genero: "",
      rangoEdad: "",
      departamento: "",
      idUsuario: "",
    });
  };

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((usuario) => {
      // Género
      if (
        filtros.genero &&
        usuario.genero !== filtros.genero
      ) {
        return false;
      }

      // Departamento
      if (
        filtros.departamento &&
        usuario.departamento !== filtros.departamento
      ) {
        return false;
      }

      // ID
      if (
        filtros.idUsuario &&
        !String(usuario.id)
          .toLowerCase()
          .includes(filtros.idUsuario.toLowerCase())
      ) {
        return false;
      }

      // Rango de edad
      if (filtros.rangoEdad) {
        const edad = usuario.edad;

        if (
          filtros.rangoEdad === "18-25" &&
          !(edad >= 18 && edad <= 25)
        ) {
          return false;
        }

        if (
          filtros.rangoEdad === "26-35" &&
          !(edad >= 26 && edad <= 35)
        ) {
          return false;
        }

        if (
          filtros.rangoEdad === "36-45" &&
          !(edad >= 36 && edad <= 45)
        ) {
          return false;
        }

        if (
          filtros.rangoEdad === "46-55" &&
          !(edad >= 46 && edad <= 55)
        ) {
          return false;
        }

        if (
          filtros.rangoEdad === "56+" &&
          edad < 56
        ) {
          return false;
        }
      }

      return true;
    });
  }, [filtros]);

  const estadisticas = useMemo(() => {
    return usuariosFiltrados.reduce(
      (acc, usuario) => {
        if (
          usuario.masajes &&
          usuario.rehabilitacion
        ) {
          acc.ambos++;
        } else if (usuario.masajes) {
          acc.masajes++;
        } else if (usuario.rehabilitacion) {
          acc.rehabilitacion++;
        } else {
          acc.ninguno++;
        }

        return acc;
      },
      {
        masajes: 0,
        rehabilitacion: 0,
        ambos: 0,
        ninguno: 0,
      }
    );
  }, [usuariosFiltrados]);

  const total = usuariosFiltrados.length;

  const porcentaje = (cantidad: number): number => {
    if (!total) return 0;
    return Math.round((cantidad / total) * 100);
  };


  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className={`sidebar ${menuAbierto ? "open" : ""}`}>
        <div className="logo">
          <div className="logo-icon">+</div>
          <div>
            <strong>HealthCare</strong>
            <span>Dashboard</span>
          </div>
        </div>

        <nav>
          <a className="nav-item active">
            <span>▦</span>
            Dashboard
          </a>

          <a className="nav-item">
            <span>👥</span>
            Usuarios
          </a>

          <a className="nav-item">
            <span>💆</span>
            Masajes
          </a>

          <a className="nav-item">
            <span>🏥</span>
            Rehabilitación
          </a>

          <a className="nav-item">
            <span>📊</span>
            Reportes
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-profile">
            <div className="avatar">AD</div>
            <div>
              <strong>Administrador</strong>
              <span>admin@empresa.com</span>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="main">

        {/* HEADER */}
        <header className="header">
          <button
            className="mobile-menu"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            ☰
          </button>

          <div>
            <h1>Dashboard de servicios</h1>
            <p>
              Consulta y analiza el uso de los servicios de bienestar.
            </p>
          </div>

          <div className="header-date">
            <span>Última actualización</span>
            <strong>17 Sep 2026</strong>
          </div>
        </header>

        {/* FILTROS */}
        <section className="filters-card">

          <div className="filter-header">
            <div>
              <h2>Filtros</h2>
              <span>
                Filtra los resultados para obtener información específica.
              </span>
            </div>

            <button
              className="clear-button"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>
          </div>

          <div className="filters">

            <div className="filter">
              <label>Género</label>

              <select
                value={filtros.genero}
                onChange={(e) =>
                  actualizarFiltro(
                    "genero",
                    e.target.value
                  )
                }
              >
                <option value="">Todos</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
              </select>
            </div>

            <div className="filter">
              <label>Rango de edad</label>

              <select
                value={filtros.rangoEdad}
                onChange={(e) =>
                  actualizarFiltro(
                    "rangoEdad",
                    e.target.value
                  )
                }
              >
                <option value="">Todas las edades</option>
                <option value="18-25">18 - 25</option>
                <option value="26-35">26 - 35</option>
                <option value="36-45">36 - 45</option>
                <option value="46-55">46 - 55</option>
                <option value="56+">56+</option>
              </select>
            </div>

            <div className="filter">
              <label>Departamento</label>

              <select
                value={filtros.departamento}
                onChange={(e) =>
                  actualizarFiltro(
                    "departamento",
                    e.target.value
                  )
                }
              >
                <option value="">Todos</option>
                <option value="Recursos Humanos">
                  Recursos Humanos
                </option>
                <option value="Finanzas">
                  Finanzas
                </option>
                <option value="Tecnología">
                  Tecnología
                </option>
                <option value="Operaciones">
                  Operaciones
                </option>
              </select>
            </div>

            <div className="filter">
              <label>ID de usuario</label>

              <input
                type="text"
                placeholder="Ej. 1001"
                value={filtros.idUsuario}
                onChange={(e) =>
                  actualizarFiltro(
                    "idUsuario",
                    e.target.value
                  )
                }
              />
            </div>

          </div>
        </section>

        {/* RESULTADO DE FILTROS */}
        <div className="results-info">
          <span>
            Mostrando <strong>{total}</strong> usuarios
          </span>

          {(filtros.genero ||
            filtros.rangoEdad ||
            filtros.departamento ||
            filtros.idUsuario) && (
            <span className="filtered">
              ● Filtros activos
            </span>
          )}
        </div>

        {/* TARJETAS */}
        <section className="stats">

          <StatCard
            title="Masajes"
            value={estadisticas.masajes}
            percentage={porcentaje(
              estadisticas.masajes
            )}
            icon="💆"
            color="blue"
          />

          <StatCard
            title="Rehabilitación"
            value={estadisticas.rehabilitacion}
            percentage={porcentaje(
              estadisticas.rehabilitacion
            )}
            icon="🏥"
            color="purple"
          />

          <StatCard
            title="Ambos servicios"
            value={estadisticas.ambos}
            percentage={porcentaje(
              estadisticas.ambos
            )}
            icon="🔄"
            color="green"
          />

          <StatCard
            title="Ningún servicio"
            value={estadisticas.ninguno}
            percentage={porcentaje(
              estadisticas.ninguno
            )}
            icon="○"
            color="orange"
          />

        </section>

        {/* CONTENIDO INFERIOR */}
        <section className="dashboard-grid">

          {/* GRÁFICA */}
          <div className="card chart-card">

            <div className="card-title">
              <div>
                <h2>Usuarios por servicio</h2>
                <p>
                  Distribución de usuarios según los servicios utilizados.
                </p>
              </div>
            </div>

            <div className="chart">

              <Bar
                label="Masajes"
                value={estadisticas.masajes}
                total={total}
                color="#2563eb"
              />

              <Bar
                label="Rehabilitación"
                value={estadisticas.rehabilitacion}
                total={total}
                color="#7c3aed"
              />

              <Bar
                label="Ambos"
                value={estadisticas.ambos}
                total={total}
                color="#059669"
              />

              <Bar
                label="Ninguno"
                value={estadisticas.ninguno}
                total={total}
                color="#f59e0b"
              />

            </div>

          </div>

          {/* RESUMEN */}
          <div className="card summary-card">

            <div className="card-title">
              <div>
                <h2>Resumen</h2>
                <p>Usuarios filtrados</p>
              </div>
            </div>

            <div className="donut-container">

              <div
                className="donut"
                style={{
                  background: `conic-gradient(
                    #2563eb 0% ${porcentaje(
                      estadisticas.masajes
                    )}%,
                    #7c3aed ${porcentaje(
                      estadisticas.masajes
                    )}% ${
                      porcentaje(
                        estadisticas.masajes
                      ) +
                      porcentaje(
                        estadisticas.rehabilitacion
                      )
                    }%,
                    #059669 ${
                      porcentaje(
                        estadisticas.masajes
                      ) +
                      porcentaje(
                        estadisticas.rehabilitacion
                      )
                    }% ${
                      porcentaje(
                        estadisticas.masajes
                      ) +
                      porcentaje(
                        estadisticas.rehabilitacion
                      ) +
                      porcentaje(
                        estadisticas.ambos
                      )
                    }%,
                    #f59e0b ${
                      porcentaje(
                        estadisticas.masajes
                      ) +
                      porcentaje(
                        estadisticas.rehabilitacion
                      ) +
                      porcentaje(
                        estadisticas.ambos
                      )
                    }% 100%
                  )`,
                }}
              >
                <div>
                  <strong>{total}</strong>
                  <span>Usuarios</span>
                </div>
              </div>

            </div>

            <div className="legend">

              <Legend
                color="#2563eb"
                label="Masajes"
                value={estadisticas.masajes}
              />

              <Legend
                color="#7c3aed"
                label="Rehabilitación"
                value={estadisticas.rehabilitacion}
              />

              <Legend
                color="#059669"
                label="Ambos"
                value={estadisticas.ambos}
              />

              <Legend
                color="#f59e0b"
                label="Ninguno"
                value={estadisticas.ninguno}
              />

            </div>

          </div>

        </section>

        {/* TABLA */}
        <section className="card table-card">

          <div className="card-title table-header">
            <div>
              <h2>Usuarios</h2>
              <p>
                Detalle de usuarios que coinciden con los filtros.
              </p>
            </div>

            <span className="counter">
              {usuariosFiltrados.length} registros
            </span>
          </div>

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Género</th>
                  <th>Edad</th>
                  <th>Departamento</th>
                  <th>Masajes</th>
                  <th>Rehabilitación</th>
                  <th>Categoría</th>
                </tr>
              </thead>

              <tbody>

                {usuariosFiltrados.map((usuario) => {

                  let categoria = "Ninguno";

                  if (
                    usuario.masajes &&
                    usuario.rehabilitacion
                  ) {
                    categoria = "Ambos";
                  } else if (usuario.masajes) {
                    categoria = "Masajes";
                  } else if (usuario.rehabilitacion) {
                    categoria = "Rehabilitación";
                  }

                  return (
                    <tr key={usuario.id}>

                      <td>
                        <strong>
                          #{usuario.id}
                        </strong>
                      </td>

                      <td>
                        <div className="user-cell">
                          <div className="small-avatar">
                            {usuario.nombre
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>

                          {usuario.nombre}
                        </div>
                      </td>

                      <td>{usuario.genero}</td>

                      <td>{usuario.edad}</td>

                      <td>{usuario.departamento}</td>

                      <td>
                        <Status
                          activo={usuario.masajes}
                        />
                      </td>

                      <td>
                        <Status
                          activo={
                            usuario.rehabilitacion
                          }
                        />
                      </td>

                      <td>
                        <span
                          className={`category ${categoria
                            .toLowerCase()
                            .replace("ó", "o")}`}
                        >
                          {categoria}
                        </span>
                      </td>

                    </tr>
                  );
                })}

                {usuariosFiltrados.length === 0 && (
                  <tr>
                    <td
                     
                      className="empty"
                    >
                      No se encontraron usuarios
                      con los filtros seleccionados.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: number;
  percentage: number;
  icon: string;
  color: string;
};


function StatCard({
  title,
  value,
  percentage,
  icon,
  color,
}: StatCardProps) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        {icon}
      </div>

      <div className="stat-content">
        <span>{title}</span>

        <div className="stat-number">
          {value}
        </div>

        <small>
          {percentage}% del total
        </small>
      </div>
    </div>
  );
}

type BarProps = {
  label: string;
  value: number;
  total: number;
  color: string;
};

function Bar({
  label,
  value,
  total,
  color,
}: BarProps) {
  const width =
    total > 0
      ? Math.max(
          (value / total) * 100,
          value > 0 ? 4 : 0
        )
      : 0;

  return (
    <div className="bar-row">
      <div className="bar-label">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div className="bar-background">
        <div
          className="bar-fill"
          style={{
            width: `${width}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}


type LegendProps = {
  color: string;
  label: string;
  value: number;
};

function Legend({
  color,
  label,
  value,
}: LegendProps) {
  return (
    <div className="legend-item">
      <div className="legend-label">
        <span
          className="legend-dot"
          style={{ background: color }}
        />

        {label}
      </div>

      <strong>{value}</strong>
    </div>
  );
}

type StatusProps = {
  activo: boolean;
};

function Status({ activo }: StatusProps) {
  return activo ? (
    <span className="status active">
      ✓ Sí
    </span>
  ) : (
    <span className="status inactive">
      — No
    </span>
  );
}


export default Dashboard;
