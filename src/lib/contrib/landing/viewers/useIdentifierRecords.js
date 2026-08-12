/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import { useEffect, useState } from 'react';

import axios from 'axios';

import _keyBy from 'lodash/keyBy';

/**
 * Read the vocabulary records behind a record's location identifiers.
 *
 * @param {Array.<Object>} identifiers Location identifiers, as the record stores them.
 * @param {String} apiUrl API the vocabulary is served from.
 * @returns {Object} The records that could be read, by identifier.
 */
export const useIdentifierRecords = (identifiers, apiUrl) => {
  // State - The records
  const [records, setRecords] = useState({});

  // The identifiers come from a `data-` attribute parsed once, so the list is
  // settled by the time this runs. It is joined to give the effect something
  // stable to compare
  const ids = identifiers.map(({ identifier }) => identifier);
  const key = ids.join('|');

  useEffect(() => {
    if (!ids.length) {
      return undefined;
    }

    // Flag to track if the request has been abandoned
    let abandoned = false;

    // Get the query
    const query = ids.map((id) => `"${id}"`).join(' OR ');

    // Get the records
    axios
      .get(apiUrl, { params: { q: `id:(${query})`, size: ids.length } })
      .then(({ data }) => {
        // If the request has not been abandoned, set the records
        if (!abandoned) {
          setRecords(_keyBy(data.hits.hits, 'id'));
        }
      })
      // The places are an addition to the map, not the map itself. If the
      // vocabulary cannot be reached the list shows the identifiers as they are
      // stored, and everything else on the page is unaffected.
      .catch(() => {});

    return () => {
      abandoned = true;
    };
  }, [key, apiUrl]);

  return records;
};
