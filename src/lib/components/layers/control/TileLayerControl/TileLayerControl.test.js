/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { fireEvent } from '@testing-library/react';

import { TileLayerControl, DefaultTileLayers } from './TileLayerControl';
import { renderWithMapContainer } from '@tests/setup';

describe('TileLayerControl tests', () => {
  describe('Render tests', () => {
    it('should render without crashing', () => {
      renderWithMapContainer(
        <>
          <TileLayerControl />
        </>
      );
    });
  });

  describe('Credits', () => {
    const creditsButtons = (container) =>
      container.querySelectorAll('.leaflet-control-layers-button');

    it('should not put the handler in the markup', () => {
      // An `onclick` attribute is refused by the InvenioRDM Content-Security-
      // Policy, `script-src` carries no `'unsafe-inline'`. The button
      // silently does nothing
      const { container } = renderWithMapContainer(<TileLayerControl />);

      creditsButtons(container).forEach((button) => {
        expect(button.getAttribute('onclick')).toBeNull();
      });
    });

    it('should show the attribution of the layer it belongs to', () => {
      const { container } = renderWithMapContainer(<TileLayerControl />);

      // The attribution is rendered as HTML, so it is read back as text
      const credits = (index) => {
        fireEvent.click(creditsButtons(container)[index]);

        return container.querySelector('.leaflet-control-popup')?.textContent;
      };

      expect(credits(0)).toContain('Esri');
      expect(credits(1)).toContain('OpenStreetMap');
      expect(credits(1)).not.toContain('Esri');
    });

    it('should offer one button per layer', () => {
      const { container } = renderWithMapContainer(<TileLayerControl />);

      expect(creditsButtons(container)).toHaveLength(DefaultTileLayers.length);
    });
  });
});
