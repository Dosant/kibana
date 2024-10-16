/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

export enum OperatingSystem {
  LINUX = 'linux',
  MAC = 'macos',
  WINDOWS = 'windows',
}

// PolicyConfig uses mac instead of macos
export enum PolicyOperatingSystem {
  windows = 'windows',
  mac = 'mac',
  linux = 'linux',
}
