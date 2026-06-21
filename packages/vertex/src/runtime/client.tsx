import React from 'react';
import { hydrateRoot } from 'react-dom/client';

/**
 * In an Islands architecture, we don't hydrate the entire root.
 * Instead, the server injects `<div data-island="IslandID" data-props="{}"></div>`
 * around client components.
 * 
 * The client script scans the DOM for these islands and hydrates them individually.
 */
export function hydrateIslands(clientComponents: Record<string, React.ComponentType<any>>) {
  if (typeof document === 'undefined') return;

  const islands = document.querySelectorAll('[data-island]');

  islands.forEach((island: Element) => {
    const componentId = island.getAttribute('data-island');
    const propsRaw = island.getAttribute('data-props');
    
    if (componentId && clientComponents[componentId]) {
      const Component = clientComponents[componentId];
      const props = propsRaw ? JSON.parse(propsRaw) : {};
      
      // Hydrate just this specific island
      hydrateRoot(island, <Component {...props} />);
    }
  });
}
