import React from "react";
import { pdf } from "@react-pdf/renderer";
import OrdenTrabajoPDF from "../components/OrdenTrabajoPDF";

export async function exportOrderToPDF(order, user) {
  if (!order) return;

  const doc = React.createElement(OrdenTrabajoPDF, { data: order, user: user });
  const blob = await pdf(doc).toBlob();

  // Crear un link y descargar
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Orden-${String(order.serialNumber).padStart(5, "0")}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}






