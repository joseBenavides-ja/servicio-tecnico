import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 22,
    paddingHorizontal: 28,
    fontSize: 10,
    color: "#1f2937",
    fontFamily: "Helvetica",
  },

  // Colores base
  blue: "#0f3a63",
  blueSoft: "#e9f1fb",
  line: "#cbd5e1",
  graySoft: "#f3f4f6",

  // Header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitleCol: { flex: 1 },
  title: { fontSize: 18, fontWeight: 800, color: "#0f3a63" },
  subtitle: { marginTop: 3, fontSize: 10, color: "#334155" },
  divider: { height: 1, backgroundColor: "#e5e7eb", marginVertical: 10 },

  // Banda / mensaje
  banner: {
    backgroundColor: "#eef2ff",
    borderColor: "#c7d2fe",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  bannerText: { textAlign: "center", fontSize: 12, fontWeight: 700, color: "#0f3a63" },

  // Secciones
  sectionTitle: {
    fontSize: 12,
    fontWeight: 800,
    color: "#0f3a63",
    marginTop: 6,
    marginBottom: 6,
  },

  // Caja tipo tabla
  box: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    overflow: "hidden",
  },
  row: { flexDirection: "row" },
  cellLabel: {
    width: "25%",
    backgroundColor: "#e9f1fb",
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: "#cbd5e1",
    fontWeight: 700,
    color: "#0f3a63",
  },
  cellValue: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  cellRightLabel: {
    width: "18%",
    backgroundColor: "#e9f1fb",
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderLeftWidth: 1,
    borderLeftColor: "#cbd5e1",
    borderRightWidth: 1,
    borderRightColor: "#cbd5e1",
    fontWeight: 700,
    color: "#0f3a63",
  },
  cellRightValue: {
    width: "22%",
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  hr: { height: 1, backgroundColor: "#e5e7eb" },

  // Condiciones
  conditionsBox: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    padding: 10,
  },
  li: { flexDirection: "row", marginBottom: 6 },
  liNum: { width: 14, fontWeight: 800, color: "#0f3a63" },
  liText: { flex: 1, color: "#334155", lineHeight: 1.35 },

  // Recibí conforme
  confirmBox: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    padding: 10,
    marginTop: 6,
  },
  confirmRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  confirmLabel: { width: 55, fontWeight: 700, color: "#0f3a63" },
  lineField: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    height: 14,
  },

  // Footer
  footer: {
    position: "absolute",
    left: 28,
    right: 28,
    bottom: 18,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 10,
  },
  socialsContainer: { flex: 1, flexDirection: "column", gap: 2.5 },
  socialRow: { flexDirection: "row", alignItems: "center" },
  socialLabel: { fontSize: 9, fontWeight: 700, color: "#0f3a63", width: 65 },
  socialText: { fontSize: 9, color: "#334155", flex: 1 },
  orderMini: { fontSize: 12, fontWeight: 800, color: "#0f3a63", textAlign: "right" },
  small: { fontSize: 8, color: "#64748b" },
});

export default function OrdenTrabajoPDF({ data, user }) {
  // Convertir políticas de servicio del usuario en array
  const policiesText = user?.policies ?? "";
  
  // Si no hay políticas, usar por defecto
  const defaultPolicies = [
    "1. Si el cliente no acepta el diagnóstico el servicio técnico cobra $50.000 por diagnóstico.",
    "2. Si el cliente acepta la reparación con presupuesto 20% extra sobre el presupuesto mostrado o reajuste si la falla es adicional al diagnóstico.",
    "3. El acceso es CON 600 soles para desplazamiento y combustible si el cliente paga reparación/ajuste.",
    "4. En emergencias rige ley a ratio de retiro antes de pres preferenta un costo cobrable a la hora de cobrar la reparación.",
    "5. Ais accesorios son del comerciante repaus a todo el al 20, no se harenge reparación a disfar tabel cables o tal usado el soporte.",
    "6. Los Accesorios no se incluyen costos netos, del taller +dias de los parámetros un en cada estado accesorios durante los en vidas cables, Configuración accesorios o instalacion.",
  ];
  
  const condiciones = policiesText.trim().length > 0
    ? policiesText
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => line.trim())
    : defaultPolicies;

  const presupuesto = data?.budget ? `$${Number(data.budget).toLocaleString("es-CL")}` : "$ Estimado";
  const fecha = data?.createdAt ? new Date(data.createdAt).toLocaleDateString("es-CL") : "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <View style={styles.headerTitleCol}>
            <Text style={styles.title}>ORDEN DE TRABAJO #{data?.serialNumber ? String(data.serialNumber).padStart(5, "0") : "00000"}</Text>
            <Text style={styles.subtitle}>{user?.address || "Calle 16 Bis 85 E - B310 Barrio Arquitectos, Santiago, Chile"}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* BANNER */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>DIAGNÓSTICO INMEDIATO DE 24 A 48 HORAS HÁBILES</Text>
        </View>

        {/* 1. DATOS DEL CLIENTE Y DEL EQUIPO */}
        <Text style={styles.sectionTitle}>1. DATOS DEL CLIENTE Y DEL EQUIPO</Text>

        <View style={styles.box}>
          {/* fila: fecha + presupuesto */}
          <View style={styles.row}>
            <Text style={styles.cellLabel}>FECHA:</Text>
            <Text style={styles.cellValue}>{fecha}</Text>

            <Text style={styles.cellRightLabel}>PRESUPUESTO:</Text>
            <Text style={styles.cellRightValue}>{presupuesto}</Text>
          </View>
          <View style={styles.hr} />

          {/* cliente */}
          <View style={styles.row}>
            <Text style={styles.cellLabel}>CLIENTE:</Text>
            <Text style={styles.cellValue}>{data?.clientName ?? ""}</Text>
          </View>
          <View style={styles.hr} />

          {/* direccion + telefono */}
          <View style={styles.row}>
            <Text style={styles.cellLabel}>DIRECCIÓN:</Text>
            <Text style={styles.cellValue}>{data?.address ?? ""}</Text>

            <Text style={styles.cellRightLabel}>TELÉFONO:</Text>
            <Text style={styles.cellRightValue}>{data?.phone ?? ""}</Text>
          </View>
          <View style={styles.hr} />

          {/* rut + marca */}
          <View style={styles.row}>
            <Text style={styles.cellLabel}>RUT:</Text>
            <Text style={styles.cellValue}>{data?.rut ?? ""}</Text>

            <Text style={styles.cellRightLabel}>MARCA:</Text>
            <Text style={styles.cellRightValue}>{data?.brand ?? ""}</Text>
          </View>
          <View style={styles.hr} />

          {/* modelo (solo una vez) */}
          <View style={styles.row}>
            <Text style={styles.cellLabel}>MODELO:</Text>
            <Text style={styles.cellValue}>{data?.model ?? ""}</Text>
          </View>
          <View style={styles.hr} />

          {/* accesorios */}
          <View style={styles.row}>
            <Text style={styles.cellLabel}>ACCESORIOS:</Text>
            <Text style={styles.cellValue}>{data?.accessories ?? ""}</Text>
          </View>
          <View style={styles.hr} />

          {/* observaciones */}
          <View style={styles.row}>
            <Text style={styles.cellLabel}>OBSERVACIONES:</Text>
            <Text style={styles.cellValue}>{data?.observations ?? ""}</Text>
          </View>
        </View>

        {/* 2. CONDICIONES */}
        <Text style={styles.sectionTitle}>2. CONDICIONES DEL SERVICIO</Text>
        <View style={styles.conditionsBox}>
          {condiciones.map((c, idx) => (
            <View key={idx} style={styles.li}>
              <Text style={styles.liNum}>{idx + 1}.</Text>
              <Text style={styles.liText}>{c}</Text>
            </View>
          ))}
        </View>

        {/* 3. RECIBÍ CONFORME */}
        <Text style={styles.sectionTitle}>3. RECIBÍ CONFORME</Text>
        <View style={styles.confirmBox}>
          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Nombre:</Text>
            <View style={styles.lineField} />
            <Text style={[styles.confirmLabel, { width: 40, marginLeft: 10 }]}>RUT:</Text>
            <View style={styles.lineField} />
          </View>

          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Firma:</Text>
            <View style={styles.lineField} />
          </View>

          {/* SOLO UNA FECHA */}
          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Fecha:</Text>
            <View style={styles.lineField} />
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.socialsContainer}>
            {user?.instagram && (
              <View style={styles.socialRow}>
                <Text style={styles.socialLabel}>Instagram:</Text>
                <Text style={styles.socialText}>{user.instagram}</Text>
              </View>
            )}
            {user?.facebook && (
              <View style={styles.socialRow}>
                <Text style={styles.socialLabel}>Facebook:</Text>
                <Text style={styles.socialText}>{user.facebook}</Text>
              </View>
            )}
            {user?.whatsapp && (
              <View style={styles.socialRow}>
                <Text style={styles.socialLabel}>WhatsApp:</Text>
                <Text style={styles.socialText}>{user.whatsapp}</Text>
              </View>
            )}
            {user?.website && (
              <View style={styles.socialRow}>
                <Text style={styles.socialLabel}>Sitio Web:</Text>
                <Text style={styles.socialText}>{user.website}</Text>
              </View>
            )}
            {user?.businessHours && (
              <View style={[styles.socialRow, { marginTop: 1 }]}>
                <Text style={styles.socialLabel}>Horario:</Text>
                <Text style={styles.socialText}>{user.businessHours}</Text>
              </View>
            )}
          </View>

          <View style={{ alignItems: "flex-end", flexShrink: 1 }}>
            <Text style={styles.orderMini}>{data?.serialNumber ? String(data.serialNumber).padStart(5, "0") : "00000"}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
