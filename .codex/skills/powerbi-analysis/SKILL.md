---
name: powerbi-analysis
description: Analiza archivos PBIX o evidencia visual de dashboards Power BI para relevar pestañas, visuales, métricas, interacciones y riesgos de interpretación sin inventar nada.
---

# Skill: powerbi-analysis

## Cuándo usar esta skill

Usa esta skill cuando la tarea sea:
- analizar un archivo `.pbix`
- analizar capturas de un dashboard Power BI
- relevar pestañas, visuales o layouts
- comparar dashboards
- decidir cuál dashboard sirve como modelo maestro
- identificar métricas, filtros, tablas, mapas, KPIs o interacciones
- producir insumo funcional para un manual de usuario

## Objetivo

Generar un análisis funcional exhaustivo, útil y confiable del dashboard, separando claramente:
- lo confirmado por evidencia
- lo inferido razonablemente
- lo que requiere validación

## Reglas obligatorias

- No inventar métricas, fórmulas DAX, lógica de negocio ni pestañas no confirmadas.
- Si se trabaja sobre PBIX:
  - confirmar al inicio el archivo exacto analizado
  - indicar método usado
  - indicar limitaciones
- Si se trabaja sobre capturas:
  - aclarar que el análisis es visual
  - no asumir valores no visibles
- Diferenciar siempre:
  - **Confirmado por evidencia**
  - **Inferencia razonable**
  - **Requiere validación**
- No responder con marketing ni resumen superficial.
- Priorizar exactitud funcional sobre elegancia.

## Qué relevar

### 1. Visión general
- nombre del reporte
- propósito aparente
- tipo de usuario objetivo
- lógica general de navegación
- flujo recomendado de lectura

### 2. Pestañas
Para cada pestaña:
- nombre exacto
- objetivo funcional
- rol dentro del dashboard
- tipo de pestaña:
  - general
  - técnica
  - analítica
  - validación
  - soporte
  - interna
- visibilidad inferida si es posible

### 3. Bloques visuales
Para cada bloque:
- título visible
- tipo de visual
- ubicación aproximada
- función aparente
- datos visibles
- qué permite leer
- cómo interpretarlo
- qué mirar primero
- relación con otros bloques

### 4. Métricas
Para cada métrica visible:
- nombre
- unidad si aparece
- tipo aparente
- interpretación funcional
- dudas o ambigüedades

### 5. Interacciones
Detectar o inferir:
- filtros
- rango de fechas
- slicers
- tooltips
- filtrado cruzado
- selección de puntos o series
- interacción con mapas
- navegación entre páginas
- otras interacciones relevantes

Para cada una:
- qué hace
- para qué sirve
- si está confirmada o requiere validación

### 6. Riesgos
- títulos ambiguos
- métricas sin definición clara
- cards fuera de vista
- filtros ocultos
- módulos internos
- inconsistencias visibles
- cualquier punto que no deba darse por cierto

## Formato sugerido de salida

# Análisis funcional completo del dashboard

## 0. Confirmación del archivo analizado
## 1. Visión general del reporte
## 2. Inventario de pestañas
## 3. Análisis detallado por pestaña
### [Nombre de pestaña]
#### Objetivo de la pestaña
#### Bloques visuales identificados
#### Métricas visibles
#### Interacciones detectadas o probables
#### Cómo leer esta pestaña
#### Requiere validación

## 4. Inventario consolidado de métricas
## 5. Interacciones generales del dashboard
## 6. Propuesta de estructura para tutorial web
## 7. Riesgos de interpretación y puntos a validar

## Si el usuario pide comparación entre dashboards

Agregar:
- cobertura funcional
- cantidad y variedad de pestañas
- riqueza de visuales
- riqueza de métricas
- riqueza de interacciones
- valor como dashboard modelo
- veredicto final justificado

## Lo que nunca debe aparecer en esta skill

- fórmulas inventadas
- afirmaciones no respaldadas
- recomendaciones editoriales para cliente final mezcladas con evidencia sin marcar
- tono marketinero