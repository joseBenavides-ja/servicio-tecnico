// Importamos hooks de React:
// - useState: para guardar "estado" (datos que cambian en la pantalla)
// - useEffect: para ejecutar algo cuando cambie un estado (ej: guardar en localStorage)
// - useMemo: para calcular cosas "derivadas" sin recalcular de más
import { useEffect, useMemo, useState } from "react";

// Importamos estilos CSS
import "./App.css";

// Importamos componentes que creamos nosotros
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";
import LoginRegister from "./components/LoginRegister";
import UserProfile from "./components/UserProfile";

// Clave con la que guardaremos las órdenes en localStorage (memoria del navegador)
const STORAGE_KEY = "work_orders_v1";

// Función para obtener la clave de órdenes específica del usuario
function getUserStorageKey(userId) {
  return `${STORAGE_KEY}_user_${userId}`;
}

// Normaliza texto para buscar mejor (minúsculas, sin espacios raros)
function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim();
}

// Normaliza RUT quitando puntos y guión para que "12.345.678-9" == "123456789"
function normalizeRut(value) {
  return normalizeText(value).replace(/[.-]/g, "");
}


export default function App() {
  // Usuario autenticado (desde localStorage)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  // orders = lista de órdenes (inicia vacía, se carga cuando user cambia)
  const [orders, setOrders] = useState([]);

  // editing guardará la orden que estamos editando (si no estamos editando, será null)
  const [editing, setEditing] = useState(null);

  // Filtro por estado para la tabla (todas / nueva / en_proceso / completada)
  const [filterStatus, setFilterStatus] = useState("todas");

  // Texto del buscador
  const [search, setSearch] = useState("");

  // useEffect: cuando cambia el usuario, cargar sus órdenes específicas
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setEditing(null);
      return;
    }
    
    const userKey = getUserStorageKey(user.id);
    const saved = localStorage.getItem(userKey);
    setOrders(saved ? JSON.parse(saved) : []);
    setEditing(null);
  }, [user]);

  // useEffect: cada vez que cambie "orders", guardamos la lista en localStorage del usuario
  useEffect(() => {
    if (!user) return;
    const userKey = getUserStorageKey(user.id);
    localStorage.setItem(userKey, JSON.stringify(orders));
  }, [orders, user]);

  // Genera un id único para cada orden
  function createId() {
    // crypto.randomUUID() es lo mejor, pero si no existe, usamos Date.now()
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return String(Date.now());
  }

  // Crear nueva orden
  function addOrder(data) {
    const now = new Date().toISOString(); // fecha actual en formato ISO
    
    const newOrder = {
      id: createId(),                      // id único
      serialNumber: data.serialNumber,     // ya generado en OrderForm
      createdAt: now,                      // fecha de creación
      ...data,                             // el resto de campos que vienen del formulario
    };

    // Agregamos la nueva orden al inicio de la lista
    setOrders((prev) => [newOrder, ...prev]);
  }

  // Actualizar una orden ya existente (cuando estamos editando)
  function updateOrder(data) {
    if (!editing?.id) return; // si no hay orden en edición, no hacemos nada

    setOrders((prev) =>
      prev.map((o) =>
        o.id === editing.id
          ? { ...o, ...data } // si es la misma orden, mezclamos campos nuevos
          : o                 // si no, la dejamos igual
      )
    );

    // Salimos del modo edición
    setEditing(null);
  }

  // Eliminar una orden por id
  function deleteOrder(id) {
    const ok = window.confirm("¿Seguro que quieres eliminar esta orden?");
    if (!ok) return;

    // Quitamos la orden filtrándola
    setOrders((prev) => prev.filter((o) => o.id !== id));

    // Si estábamos editando esa orden, cancelamos edición
    if (editing?.id === id) setEditing(null);
  }

  // Estadísticas para mostrar en badges (total, nuevas, etc.)
  const stats = useMemo(() => {
    const total = orders.length;
    const nueva = orders.filter((o) => o.status === "nueva").length;
    const enProceso = orders.filter((o) => o.status === "en_proceso").length;
    const completada = orders.filter((o) => o.status === "completada").length;
    return { total, nueva, enProceso, completada };
  }, [orders]);

  // Lista visible: aplica filtro + buscador
const visibleOrders = useMemo(() => {
  const q = normalizeText(search);
  const qRut = normalizeRut(search);

  return orders
    .filter((o) => (filterStatus === "todas" ? true : o.status === filterStatus))
    .filter((o) => {
      if (!q) return true;

      const client = normalizeText(o.clientName);
      const phone = normalizeText(o.phone);
      const equipment = normalizeText(o.equipment);
      const brand = normalizeText(o.brand);
      const model = normalizeText(o.model);
      const budget = normalizeText(o.budget);
      const serialNumber = normalizeText(o.serialNumber); // NUEVO

      const rut = normalizeRut(o.rut);

      return (
        client.includes(q) ||
        phone.includes(q) ||
        equipment.includes(q) ||
        brand.includes(q) ||
        model.includes(q) ||
        budget.includes(q) ||
        serialNumber.includes(q) || // NUEVO: búsqueda por número de serie
        rut.includes(qRut) // búsqueda especial para rut
      );
    });
}, [orders, filterStatus, search]);


  // Funciones de autenticación
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  // Si no hay usuario autenticado, mostrar login
  if (!user) {
    return <LoginRegister onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="container">
      {/* Perfil de Usuario */}
      <UserProfile user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />

      {/* Header */}
      <div className="header">
        <div>
          <h1 className="h1">Órdenes de Trabajo</h1>
          <p className="muted">
            Crea y gestiona órdenes (guardadas en este navegador con localStorage).
          </p>
        </div>

        {/* Estadísticas */}
        <div className="row">
          <span className="badge">Total: {stats.total}</span>
          <span className="badge">Nuevas: {stats.nueva}</span>
          <span className="badge">En proceso: {stats.enProceso}</span>
          <span className="badge">Completadas: {stats.completada}</span>
        </div>
      </div>

      {/* Formulario:
          - si editing tiene algo => estamos editando => onSubmit = updateOrder
          - si editing es null => creando => onSubmit = addOrder
      */}
      <OrderForm
        initialOrder={editing}
        onSubmit={editing ? updateOrder : addOrder}
        onCancel={() => setEditing(null)}
        user={user}
      />

      {/* Lista / tabla */}
      <OrderList
        orders={visibleOrders}
        onEdit={(o) => setEditing(o)}  // activar modo edición
        onDelete={deleteOrder}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        search={search}
        setSearch={setSearch}
        user={user}
      />
    </div>
  );
}
