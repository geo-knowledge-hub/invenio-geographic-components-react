/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Two points, far enough apart to tell one from the other on a map.
 *
 * They are the points the São Paulo and Zürich records carry: `Add to map`
 * copies exactly these into a record, which is why the deposit form and the
 * landing page keep comparing what is stored against them.
 *
 * Written out rather than read from the vocabulary fixture, so that the tests
 * of `base/geometry`, which knows nothing about places, do not have to.
 */

export const SAO_PAULO_POINT = {
  type: 'Point',
  coordinates: [-46.63611, -23.5475],
};

export const ZURICH_POINT = {
  type: 'Point',
  coordinates: [8.55, 47.36667],
};
