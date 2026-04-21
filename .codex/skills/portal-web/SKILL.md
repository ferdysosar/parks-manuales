---
name: portal-web
description: Diseña y mejora el portal web de Manuales de Usuario de PARKS Ingeniería con HTML, CSS y JS vanilla, manteniendo una UX institucional, clara, profesional y orientada al cliente final.
---

# Skill: portal-web

## Cuándo usar esta skill

Usa esta skill cuando la tarea sea:
- crear o editar `index.html`
- crear o editar `power-bi.html`
- ajustar `styles.css`
- ajustar `app.js`
- mejorar UX/UI del portal
- refinar copy visible
- fortalecer branding PARKS Ingeniería
- volver la web más institucional y deployable

## Objetivo

Mantener y mejorar una web que debe sentirse como:
- portal oficial de ayuda de PARKS Ingeniería
- centro de manuales y guías de uso
- experiencia clara, profesional y final
- producto listo para desplegar, no prototipo interno

## Principios de diseño

- Visual institucional
- Jerarquía clara
- Mucho aire visual
- Buen contraste
- Tipografía legible
- Responsive real
- Sin rigidez excesiva
- Sin adornos exagerados
- Sin apariencia escolar
- Sin lenguaje de sitio incompleto

## Reglas de arquitectura

- No introducir frameworks.
- Mantener:
  - `index.html`
  - `power-bi.html`
  - `styles.css`
  - `app.js`
- Reutilizar componentes visuales.
- No romper la arquitectura existente sin pedido explícito.
- Si el cambio es de copy o jerarquía, tocar primero HTML antes de cambiar CSS o JS.

## Reglas de branding

La web debe presentar:
- **PARKS Ingeniería**
- **Manuales de Usuario**

Debe sentirse como:
- portal de ayuda para clientes y usuarios
- guía de servicios, plataformas y reportes de PARKS

No debe sentirse como:
- experimento
- biblioteca interna
- demo
- sitio en construcción

## Reglas de copy

### Siempre preferir
- lenguaje institucional
- lenguaje claro
- beneficio para el usuario
- foco en lo que el usuario puede entender o hacer

### Evitar
- módulo destacado
- guía publicada
- activo
- roadmap
- fase actual
- disponible hoy
- base documental
- complementos técnicos
- referencias a dashboards fuente
- cualquier frase que exponga cocina interna

## Reglas específicas para landing

La landing:
- representa el portal completo
- no debe girar en torno a una sola área
- debe mostrar al mismo nivel:
  - Área de Clientes
  - Power BI (Dashboard)
  - Sistema de Gestión Naval (SGN)
  - Gestión Documental
- la diferencia entre áreas puede marcarse por estado, pero sin jerarquía dominante
- debe verse terminada y estable

## Reglas específicas para `power-bi.html`

La página de Power BI:
- es una guía general, no por empresa ni por barco
- debe estar completamente orientada al cliente final
- debe enseñar uso e interpretación del dashboard
- no debe exponer lógica interna de documentación
- debe sentirse más tutorial que inventario técnico

### Títulos preferidos
- “Cómo interpretar las pestañas del dashboard”
- “Interacciones disponibles”
- “Secuencia recomendada de lectura”
- “Buenas prácticas de uso”

### Evitar
- “Área funcional activa del portal”
- “Módulos o pestañas que pueden aparecer”
- “Elementos que pueden requerir validación”
- “Espacio preparado para futuras ampliaciones”
- “Manejo de errores” como contenido visible para cliente

## Reglas de UX

Si una página larga se siente muy textual:
- mejorar jerarquía visual
- agregar bloques más guiados
- resaltar “qué mirar primero”
- usar callouts útiles
- facilitar rutas de lectura
- no saturar con texto corrido

## JS

Usar JS solo para:
- menú móvil
- botón volver arriba
- resaltado de índice interno
- interacción simple de navegación

No agregar complejidad innecesaria.

## Auditorías

Cuando el usuario pida cambios de web, cerrar con auditoría breve:
1. qué cambió
2. qué se mantuvo
3. impacto visual o de tono
4. si quedó listo para deploy

## Regla final

Si hay duda entre:
- diseño vistoso
- y claridad institucional

priorizar claridad institucional.