import { useState } from "react";

export default function UserProfile({ user, onLogout, onUpdateUser }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    instagram: user?.instagram || "",
    facebook: user?.facebook || "",
    whatsapp: user?.whatsapp || "",
    website: user?.website || "",
    address: user?.address || "",
    businessHours: user?.businessHours || "",
    policies: user?.policies || "",
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    const updatedUser = { ...user, ...editData };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    onUpdateUser(updatedUser);
    setIsEditing(false);
    setShowDropdown(false);
  };

  return (
    <div className="user-profile">
      <div className="user-header">
        {user.logo ? (
          <img src={user.logo} alt="Logo empresa" className="user-logo" />
        ) : (
          <div className="user-logo-placeholder">
            {user.companyName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="user-info">
          <h3 className="h3">{user.companyName}</h3>
          <p className="muted">{user.name}</p>
        </div>

        <button
          className="user-menu-btn"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          ⋮
        </button>
      </div>

      {showDropdown && (
        <div className="user-dropdown">
          {!isEditing ? (
            <>
              <div className="user-details">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>RUT:</strong> {user.rut}</p>
                <p><strong>Teléfono:</strong> {user.phone}</p>
                <p><strong>Empresa:</strong> {user.companyName}</p>
                {user.instagram && <p><strong>Instagram:</strong> {user.instagram}</p>}
                {user.facebook && <p><strong>Facebook:</strong> {user.facebook}</p>}
                {user.whatsapp && <p><strong>WhatsApp:</strong> {user.whatsapp}</p>}
                {user.website && <p><strong>Sitio Web:</strong> {user.website}</p>}
                {user.address && <p><strong>Dirección:</strong> {user.address}</p>}
                {user.businessHours && <p><strong>Horario de Atención:</strong> {user.businessHours}</p>}
                {user.policies && (
                  <p>
                    <strong>Políticas:</strong>
                    <div style={{ fontSize: "12px", marginTop: "4px", color: "#666", whiteSpace: "pre-wrap" }}>
                      {user.policies}
                    </div>
                  </p>
                )}
              </div>
              <div className="user-actions">
                <button
                  className="btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Editar Perfil
                </button>
                <button
                  onClick={onLogout}
                  className="btn-danger"
                >
                  Cerrar Sesión
                </button>
              </div>
            </>
          ) : (
            <div className="user-edit-form">
              <h4 className="h4">Editar Información Adicional</h4>
              
              <label>
                Instagram
                <input
                  type="text"
                  name="instagram"
                  value={editData.instagram}
                  onChange={handleEditChange}
                  placeholder="@tuinstagram o URL"
                />
              </label>

              <label>
                Facebook
                <input
                  type="text"
                  name="facebook"
                  value={editData.facebook}
                  onChange={handleEditChange}
                  placeholder="facebook.com/tuempresa"
                />
              </label>

              <label>
                WhatsApp
                <input
                  type="tel"
                  name="whatsapp"
                  value={editData.whatsapp}
                  onChange={handleEditChange}
                  placeholder="+56 9 1234 5678"
                />
              </label>

              <label>
                Sitio Web
                <input
                  type="url"
                  name="website"
                  value={editData.website}
                  onChange={handleEditChange}
                  placeholder="https://www.ejemplo.com"
                />
              </label>

              <label>
                Dirección
                <input
                  type="text"
                  name="address"
                  value={editData.address}
                  onChange={handleEditChange}
                  placeholder="Calle 16 Bis 85 E - B310 Barrio Arquitectos, Santiago, Chile"
                />
              </label>

              <label>
                Horario de Atención
                <input
                  type="text"
                  name="businessHours"
                  value={editData.businessHours}
                  onChange={handleEditChange}
                  placeholder="Ej: Lunes a Viernes 9:00 AM - 6:00 PM"
                />
              </label>

              <label>
                Políticas del Servicio Técnico
                <textarea
                  name="policies"
                  value={editData.policies}
                  onChange={handleEditChange}
                  placeholder="Ej: Garantía de 30 días, horario de atención, políticas de cancelación, etc."
                  style={{ minHeight: "100px" }}
                />
              </label>

              <div className="user-edit-actions">
                <button className="btn-primary" onClick={handleSaveProfile}>
                  Guardar
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
