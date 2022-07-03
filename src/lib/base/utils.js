/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _get from 'lodash/get';
import _isNil from 'lodash/isNil';

/**
 * Check if a property is defined in the given object.
 *
 * @param obj Object used in the verification.
 * @param propertyName Property checked in the object.
 */
export const isPropertyDefined = (obj, propertyName) =>
  !_isNil(_get(obj, propertyName));
