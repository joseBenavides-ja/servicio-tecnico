import { useEffect, useMemo, useState } from "react";

// Función para obtener la clave de contador específica del usuario
function getUserCounterKey(userId) {
  return `work_orders_counter_user_${userId}`;
}

// Generar número de serie específico del usuario
function generateSerialNumber(user) {
  if (!user) return "00000";
  
  const userCounterKey = getUserCounterKey(user.id);
  const currentCounter = parseInt(localStorage.getItem(userCounterKey) || "0", 10);
  const nextCounter = currentCounter + 1;
  localStorage.setItem(userCounterKey, String(nextCounter));
  
  // Solo 5 dígitos correlactivos
  const serialNum = String(nextCounter).padStart(5, "0");
  return serialNum;
}

// Objeto base de una orden "vacía"
const emptyOrder = {
  // Número de serie único
  serialNumber: "",

  // Datos del cliente
  clientName: "",
  rut: "",          // RUT del cliente
  phone: "",
  address: "",

  // Datos del equipo
  equipment: "",    // tipo de equipo/servicio (ej: "Lavadora", "Notebook")
  brand: "",        // Marca del equipo
  model: "",        // Modelo del equipo
  accessories: "",  // NUEVO - Accesorios asociados

  // Orden
  problem: "",
  observations: "", // NUEVO - Observaciones del técnico
  budget: "",       // Presupuesto estimado en CLP
  priority: "media",
  status: "nueva",
  technician: "",
  scheduledDate: "",
  notes: "",
};

export default function OrderForm({ initialOrder, onSubmit, onCancel, user }) {
  // Si initialOrder tiene id => estamos editando
  const isEdit = Boolean(initialOrder?.id);

  // Construimos el estado inicial del formulario:
  // - Si editamos, llenamos con datos existentes
  // - Si no, usamos emptyOrder SIN número de serie (se genera al submit)
  const initial = useMemo(() => {
    if (initialOrder) {
      // Modo edición
      return {
        serialNumber: initialOrder.serialNumber ?? "",
        clientName: initialOrder.clientName ?? "",
        rut: initialOrder.rut ?? "",
        phone: initialOrder.phone ?? "",
        address: initialOrder.address ?? "",
        equipment: initialOrder.equipment ?? "",
        brand: initialOrder.brand ?? "",
        model: initialOrder.model ?? "",
        accessories: initialOrder.accessories ?? "",
        problem: initialOrder.problem ?? "",
        observations: initialOrder.observations ?? "",
        budget: initialOrder.budget ?? "",
        priority: initialOrder.priority ?? "media",
        status: initialOrder.status ?? "nueva",
        technician: initialOrder.technician ?? "",
        scheduledDate: initialOrder.scheduledDate ?? "",
        notes: initialOrder.notes ?? "",
      };
    } else {
      // Modo creación: NO generar SN aquí (se genera al hacer submit)
      return {
        ...emptyOrder,
        serialNumber: "", // Vacío, se genera al submit
      };
    }
  }, [initialOrder]);

  // Estado que guarda los valores actuales del formulario
  const [form, setForm] = useState(initial);

  // Para mostrar errores de validación
  const [error, setError] = useState("");

  // Cuando cambia initial (por ejemplo, entras a editar),
  // sincronizamos el formulario
  useEffect(() => {
    setForm(initial);
    setError("");
  }, [initial]);

  // Helper para cambiar cualquier campo del formulario
  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validaciones mínimas (puedes ajustar qué es obligatorio)
    if (!form.clientName.trim()) return setError("Falta el nombre del cliente.");
    if (!form.rut.trim()) return setError("Falta el RUT del cliente."); // NUEVO
    if (!form.phone.trim()) return setError("Falta el teléfono.");
    if (!form.equipment.trim()) return setError("Falta el equipo / servicio.");
    if (!form.problem.trim()) return setError("Falta la descripción del problema.");

    // Si es una orden nueva (sin SN), generar uno ahora
    let serialNumber = form.serialNumber;
    if (!serialNumber.trim()) {
      serialNumber = generateSerialNumber(user);
    }

    // Enviamos al padre (App.js) una versión "limpia"
    onSubmit({
      ...form,
      serialNumber: serialNumber.trim(),
      clientName: form.clientName.trim(),
      rut: form.rut.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),

      equipment: form.equipment.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      accessories: form.accessories.trim(),

      problem: form.problem.trim(),
      observations: form.observations.trim(),
      // Convertimos presupuesto a número si viene, si no, lo dejamos vacío
      budget: form.budget === "" ? "" : Number(form.budget),
      technician: form.technician.trim(),
      notes: form.notes.trim(),
    });
  }

  return (
    <div className="card">
      <div className="row spaceBetween">
        <h2 className="h2">{isEdit ? "Editar orden" : "Nueva orden de trabajo"}</h2>
        {isEdit && <span className="badge">Editando</span>}
      </div>

      <form onSubmit={handleSubmit} className="mt10">
        <div className="grid">
          {/* Fila 1: Número de serie, Cliente, RUT, Teléfono */}
          <div className="col-2">
            <label>
              Nº Serie
              <input
                value={form.serialNumber}
                onChange={(e) => setField("serialNumber", e.target.value)}
                placeholder="Auto"
                readOnly
                style={{ 
                  backgroundColor: "#f0f0f0", 
                  cursor: "not-allowed",
                  fontWeight: "bold",
                  color: "#193D6D",
                  fontSize: "12px"
                }}
              />
            </label>
          </div>

          <div className="col-3">
            <label>
              Cliente *
              <input
                value={form.clientName}
                onChange={(e) => setField("clientName", e.target.value)}
                placeholder="Juan Pérez"
              />
            </label>
          </div>

          <div className="col-3">
            <label>
              RUT *
              <input
                value={form.rut}
                onChange={(e) => setField("rut", e.target.value)}
                placeholder="12.345.678-9"
              />
            </label>
          </div>

          <div className="col-4">
            <label>
              Teléfono *
              <input
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="+56 9 1234 5678"
              />
            </label>
          </div>

          {/* Fila 2: Dirección */}
          <div className="col-12">
            <label>
              Dirección
              <input
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                placeholder="Av. Siempre Viva 123"
              />
            </label>
          </div>

          {/* Fila 3: Equipo, Marca, Modelo */}
          <div className="col-5">
            <label>
              Equipo / Servicio *
              <input
                value={form.equipment}
                onChange={(e) => setField("equipment", e.target.value)}
                placeholder="Notebook / Lavadora"
              />
            </label>
          </div>

          <div className="col-4">
            <label>
              Marca
              <input
                value={form.brand}
                onChange={(e) => setField("brand", e.target.value)}
                placeholder="Samsung"
              />
            </label>
          </div>

          <div className="col-3">
            <label>
              Modelo
              <input
                value={form.model}
                onChange={(e) => setField("model", e.target.value)}
                placeholder="RT38K5932SL"
              />
            </label>
          </div>

          {/* Fila 3.5: Accesorios */}
          <div className="col-12">
            <label>
              Accesorios
              <input
                value={form.accessories}
                onChange={(e) => setField("accessories", e.target.value)}
                placeholder="Ej: Control remoto, cables, etc."
              />
            </label>
          </div>

          {/* Fila 4: Presupuesto, Prioridad, Estado */}
          <div className="col-3">
            <label>
              Presupuesto (CLP)
              <input
                type="number"
                min="0"
                step="1"
                value={form.budget}
                onChange={(e) => setField("budget", e.target.value)}
                placeholder="Ej: 45000"
              />
            </label>
          </div>

          <div className="col-3">
            <label>
              Prioridad
              <select
                value={form.priority}
                onChange={(e) => setField("priority", e.target.value)}
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </label>
          </div>

          <div className="col-3">
            <label>
              Estado
              <select
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
              >
                <option value="nueva">Nueva</option>
                <option value="en_proceso">En proceso</option>
                <option value="completada">Completada</option>
              </select>
            </label>
          </div>

          <div className="col-3">
            <label>
              Fecha programada
              <input
                type="date"
                value={form.scheduledDate}
                onChange={(e) => setField("scheduledDate", e.target.value)}
              />
            </label>
          </div>

          <div className="col-6">
            <label>
              Técnico asignado
              <input
                value={form.technician}
                onChange={(e) => setField("technician", e.target.value)}
                placeholder="Ej: Pedro"
              />
            </label>
          </div>

          <div className="col-12">
            <label>
              Problema / Descripción *
              <textarea
                value={form.problem}
                onChange={(e) => setField("problem", e.target.value)}
                placeholder="Describe el problema, síntomas, contexto, etc."
              />
            </label>
          </div>

          <div className="col-12">
            <label>
              Observaciones
              <textarea
                value={form.observations}
                onChange={(e) => setField("observations", e.target.value)}
                placeholder="Notas adicionales del técnico..."
              />
            </label>
          </div>

          <div className="col-12">
            <label>
              Notas internas
              <textarea
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                placeholder="Ej: repuestos, observaciones, etc."
              />
            </label>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="row mt12">
          <button className="primary" type="submit">
            {isEdit ? "Guardar cambios" : "Crear orden"}
          </button>

          {isEdit ? (
            <button type="button" onClick={onCancel}>
              Cancelar
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setForm(emptyOrder);
                setError("");
              }}
            >
              Limpiar
            </button>
          )}
        </div>

        <p className="muted mt10">* Campos obligatorios</p>
      </form>
    </div>
  );
}

