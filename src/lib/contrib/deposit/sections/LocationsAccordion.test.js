/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { renderWithFormikProvider } from '@tests/setup';
import { LocationsAccordion } from './LocationsAccordion';

const section = () => document.querySelector('.invenio-accordion-field');

describe('LocationsAccordion tests', () => {
  describe('Render tests', () => {
    it('should render the section title', () => {
      // Render
      renderWithFormikProvider(<LocationsAccordion />);

      // Validate the title. The field keeps its own label under it, the way
      // `Alternate identifiers` does in the deposit form, so the name is asked
      // for where the section states it rather than anywhere on the page.
      expect(section().querySelector('.title').textContent).toContain(
        'Geographic Locations'
      );
    });

    it('should hold the locations field', () => {
      // Render the section
      const { getByText } = renderWithFormikProvider(<LocationsAccordion />);

      // Validate the field is inside the section
      expect(section().contains(getByText('Add location'))).toBe(true);
    });

    it('should start open', () => {
      // Render the section
      renderWithFormikProvider(<LocationsAccordion />);

      // Validate the content
      expect(section().querySelector('.content.active')).toBeTruthy();
    });

    it('should start closed when the instance asks for it', () => {
      // Render the section
      renderWithFormikProvider(<LocationsAccordion active={false} />);

      // Validate the content
      expect(section().querySelector('.content.active')).toBe(null);
    });
  });

  describe('Error tests', () => {
    it('should report an error on the locations it holds', () => {
      // Render the section over a record whose locations did not validate
      renderWithFormikProvider(<LocationsAccordion />, {
        initialErrors: {
          metadata: { 
            locations: { 
              features: 'Not a valid location.'
             }
           },
        },
      });

      // Validate the section state
      expect(section().className).toContain('error');
    });

    it('should ignore an error on a field it does not hold', () => {
      // Render the section over a record whose title did not validate
      renderWithFormikProvider(<LocationsAccordion />, {
        initialErrors: { 
          metadata: { 
            title: 'Missing title.'
           }
         },
      });

      // Validate the section state
      expect(section().className).not.toContain('error');
    });
  });
});
