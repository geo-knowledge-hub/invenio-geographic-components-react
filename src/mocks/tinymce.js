/*
 * This file is part of Invenio-Geographic-Components.
 * Copyright (C) 2022-2026 GEO Secretariat.
 *
 * Invenio-Geographic-Components is free software; you can redistribute it and/or
 * modify it under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Stub for TinyMCE
 *
 * `react-invenio-forms` imports TinyMCE from its entry point, and TinyMCE runs
 * browser detection on import, which fails under `jsdom`. None of the components
 * here use the rich text editor.
 */
const Editor = () => null;

export default {};
export { Editor };
