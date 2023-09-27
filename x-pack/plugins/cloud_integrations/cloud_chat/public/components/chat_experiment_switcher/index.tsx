/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { Observable } from 'rxjs';
import useObservable from 'react-use/lib/useObservable';

import { ChatHeaderMenuItem } from '../chat_header_menu_item';
import { Chat as ChatFloatingBubble } from '../chat_floating_bubble';

export type ChatVariantExperiment = 'header-menu-item' | 'floating-bubble';

const FLOATING_BUBBLE_ALLOWED_LOCATIONS = [
  'app/home#/getting_started',
  'app/enterprise_search/overview',
  'app/observability/overview',
  'app/security/get_started',
  'app/integrations',
];

export function ChatExperimentSwitcher(props: {
  location$: Observable<string>;
  variant: ChatVariantExperiment;
}) {
  const location = useObservable(props.location$);
  if (!location) return null;

  if (
    props.variant === 'floating-bubble' &&
    FLOATING_BUBBLE_ALLOWED_LOCATIONS.some((loc) => location.includes(loc))
  ) {
    return <ChatFloatingBubble />;
  } else {
    return <ChatHeaderMenuItem />;
  }
}
