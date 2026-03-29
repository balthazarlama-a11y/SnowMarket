import { describe, it, expect } from "vitest";
import {
  isValidChileanPhone,
  sanitizePhone,
  generateWhatsAppLink,
} from "../whatsapp";

describe("isValidChileanPhone", () => {
  it("acepta formato completo con +56", () => {
    expect(isValidChileanPhone("+56912345678")).toBe(true);
  });

  it("acepta formato con 56 sin +", () => {
    expect(isValidChileanPhone("56912345678")).toBe(true);
  });

  it("acepta formato local con 9", () => {
    expect(isValidChileanPhone("912345678")).toBe(true);
  });

  it("acepta formato con espacios", () => {
    expect(isValidChileanPhone("+56 9 12345678")).toBe(true);
  });

  it("acepta formato con 0 inicial", () => {
    expect(isValidChileanPhone("0912345678")).toBe(true);
  });

  it("rechaza numero corto", () => {
    expect(isValidChileanPhone("91234567")).toBe(false);
  });

  it("rechaza numero con letras", () => {
    expect(isValidChileanPhone("abcdefghi")).toBe(false);
  });

  it("rechaza string vacio", () => {
    expect(isValidChileanPhone("")).toBe(false);
  });

  it("rechaza numero de otro pais", () => {
    expect(isValidChileanPhone("+5411234567890")).toBe(false);
  });
});

describe("sanitizePhone", () => {
  it("limpia formato +56 9 1234 5678", () => {
    expect(sanitizePhone("+56 9 12345678")).toBe("56912345678");
  });

  it("limpia formato con guiones", () => {
    expect(sanitizePhone("56-9-1234-5678")).toBe("56912345678");
  });

  it("antepone 56 a numero local", () => {
    expect(sanitizePhone("912345678")).toBe("56912345678");
  });

  it("maneja formato con 09", () => {
    expect(sanitizePhone("0912345678")).toBe("56912345678");
  });
});

describe("generateWhatsAppLink", () => {
  const baseParams = {
    phone: "+56912345678",
    itemName: "Esquís Rossignol",
    price: 150000,
    entityType: "product_user" as const,
  };

  it("genera enlace valido para producto de usuario", () => {
    const link = generateWhatsAppLink(baseParams);
    expect(link).toContain("https://wa.me/56912345678?text=");
    expect(link).toContain("Esqu%C3%ADs%20Rossignol");
    expect(link).toContain("AndesMarket");
  });

  it("usa numero admin para producto verificado", () => {
    const link = generateWhatsAppLink({
      ...baseParams,
      entityType: "product_verified",
      adminPhone: "+56987654321",
    });
    expect(link).toContain("https://wa.me/56987654321?text=");
    expect(link).toContain("verificado");
  });

  it("usa numero admin para propiedad", () => {
    const link = generateWhatsAppLink({
      phone: "+56912345678",
      itemName: "Depto Valle Nevado",
      price: 80000,
      entityType: "property",
      adminPhone: "+56987654321",
    });
    expect(link).toContain("https://wa.me/56987654321?text=");
    expect(link).toContain("departamento");
  });

  it("lanza error con telefono invalido", () => {
    expect(() =>
      generateWhatsAppLink({ ...baseParams, phone: "123" })
    ).toThrow("Numero de telefono invalido");
  });

  it("formatea precio en CLP", () => {
    const link = generateWhatsAppLink(baseParams);
    const decoded = decodeURIComponent(link);
    expect(decoded).toContain("150.000");
  });
});
