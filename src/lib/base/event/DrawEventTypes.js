/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Methods used to handle the draw events.
 *
 * @type {{cut: string, edit: string, create: string, remove: string}}
 */
const DrawEventMethods = {
  create: 'onCreate',
  cut: 'onCut',
  edit: 'onEdit',
  remove: 'onRemove',
};

/**
 * Map level events.
 *
 * @type {{onCreate: string, onCut: string}}
 */
const MapDrawEvents = {
  onCreate: 'pm:create',
  onCut: 'pm:cut',
};

/**
 * Layer level events.
 *
 * @type {{onEdit: string, onRemove: string}}
 */
const LayerDrawEvents = {
  onEdit: 'pm:edit',
  onRemove: 'pm:remove',
};

export { MapDrawEvents, LayerDrawEvents, DrawEventMethods };
