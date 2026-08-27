/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import {
  parse,
  readMapConfig,
  withWatermarkPosition,
  MAP_CONFIG_ELEMENT_ID,
} from './index';

describe('Configuration tests', () => {
  describe('parse tests', () => {
    it('should read a JSON string', () => {
      expect(parse('{"zoom": 2}', {})).toEqual({ zoom: 2 });
    });

    it('should fall back on a string it cannot read', () => {
      expect(parse('{not json', {})).toEqual({});
      expect(parse(undefined, [])).toEqual([]);
    });
  });

  describe('readMapConfig tests', () => {
    afterEach(() => {
      document.body.innerHTML = '';
    });

    const plant = (content) => {
      const element = document.createElement('script');

      element.type = 'application/json';
      element.id = MAP_CONFIG_ELEMENT_ID;
      element.textContent = content;

      document.body.appendChild(element);
    };

    it('should read the configuration the instance rendered', () => {
      plant('{"watermarkPosition": "topleft"}');

      expect(readMapConfig()).toEqual({ watermarkPosition: 'topleft' });
    });

    it('should give an empty configuration when the template is not installed', () => {
      expect(readMapConfig()).toEqual({});
    });

    it('should give an empty configuration when the page is half rendered', () => {
      plant('{"watermarkPosition":');

      expect(readMapConfig()).toEqual({});
    });
  });

  describe('withWatermarkPosition tests', () => {
    it('should put the position into the configuration', () => {
      expect(withWatermarkPosition({ zoom: 2 }, 'topleft')).toEqual({
        zoom: 2,
        watermarkPosition: 'topleft',
      });
    });

    it('should keep a null position, which takes the watermark away', () => {
      expect(withWatermarkPosition({}, null)).toEqual({
        watermarkPosition: null,
      });
    });

    it('should leave the configuration alone when no position is given', () => {
      const mapConfig = { watermarkPosition: 'topright' };

      expect(withWatermarkPosition(mapConfig, undefined)).toBe(mapConfig);
    });

    it('should let the property win over the configuration key', () => {
      expect(
        withWatermarkPosition({ watermarkPosition: 'topright' }, null)
      ).toEqual({ watermarkPosition: null });
    });
  });
});
