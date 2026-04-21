# AGENTS.md

## Propósito del proyecto

Este repositorio contiene el portal **Manuales de Usuario** de **PARKS Ingeniería**.
El objetivo es construir una experiencia web clara, profesional y orientada al cliente final para explicar el uso de servicios, plataformas y reportes.

## Áreas del portal

- Área de Clientes
- Power BI (Dashboard)
- Sistema de Gestión Naval (SGN)
- Gestión Documental

## Estado actual del trabajo

- La arquitectura del portal debe mantenerse simple y escalable.
- La landing principal representa el portal completo, no una sola área.
- La sección más desarrollada actualmente es **Power BI (Dashboard)**.
- El contenido debe sentirse final, institucional y listo para deploy.
- No usar lenguaje de proyecto interno ni de sitio en construcción.

## Reglas editoriales generales

- Escribir siempre en español claro y profesional.
- Priorizar lenguaje orientado a cliente final.
- No exponer cocina interna de construcción del manual.
- No mencionar archivos fuente, dashboards base, comparativas internas ni decisiones editoriales internas.
- No usar frases como:
  - “módulo destacado”
  - “guía publicada”
  - “base documental”
  - “complementos técnicos”
  - “roadmap”
  - “fase actual”
  - “próximamente” como mensaje principal
- No presentar el portal como en construcción.
- El sitio debe sentirse institucional, estable y listo para usarse.

## Reglas para contenido de Power BI

- El manual de Power BI es una guía general de uso del dashboard.
- No debe dividirse por empresa, barco o dashboard individual en la experiencia visible al cliente.
- Debe enseñar:
  - navegación
  - filtros y fechas
  - KPIs
  - gráficos
  - tablas
  - mapas
  - interacciones
  - lectura de pestañas
  - buenas prácticas de uso
- No incluir secciones orientadas al trabajo interno de PARKS.
- No decir al cliente que algunos dashboards tienen módulos diferentes salvo que sea estrictamente necesario y redactado de forma general.
- No incluir módulos internos como parte del uso normal del cliente.

## Reglas de análisis funcional

Cuando se analice un PBIX o estructura de dashboard:
- no inventar métricas, fórmulas, pestañas ni lógica de negocio.
- diferenciar siempre entre:
  - Confirmado por evidencia
  - Inferencia razonable
  - Requiere validación
- si algo no puede confirmarse, decirlo explícitamente.
- no asumir que el usuario quiere lenguaje técnico interno.
- convertir siempre el análisis en lenguaje útil para manual de usuario.

## Reglas para HTML/CSS/JS

- Mantener HTML semántico.
- Mantener CSS centralizado y limpio.
- Mantener JS mínimo, claro y reusable.
- No rehacer arquitectura sin pedido explícito.
- No introducir dependencias ni frameworks.
- Preservar accesibilidad básica:
  - foco visible
  - jerarquía de títulos
  - navegación clara
  - responsive
- Priorizar una UX:
  - profesional
  - corporativa
  - clara
  - visualmente rica pero sobria
  - útil para documentos largos

## Flujo de trabajo esperado

### Si la tarea es de análisis de dashboard
1. Relevar estructura real.
2. Confirmar evidencia.
3. Identificar dudas.
4. Redactar salida funcional útil.

### Si la tarea es de redacción de manual
1. Escribir para cliente final.
2. Evitar lenguaje interno.
3. Mantener tono final e institucional.
4. Organizar por secciones claras y navegables.

### Si la tarea es de web/portal
1. No romper arquitectura existente.
2. Mejorar primero copy y jerarquía.
3. Luego mejorar UX visual.
4. Mantener consistencia de marca PARKS Ingeniería.

## Auditorías

Cuando se hagan cambios de código o contenido, preferir una auditoría breve al final con:
1. qué se cambió
2. qué se mantuvo
3. impacto funcional o visual
4. si quedó listo para el objetivo pedido

## Regla final

Si hay conflicto entre:
- contenido interno de análisis
- y experiencia final del cliente

priorizar siempre la experiencia final del cliente visible en el portal.