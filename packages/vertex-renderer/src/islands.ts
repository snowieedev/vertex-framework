import * as fs from 'node:fs/promises';

export interface ClientManifest {
  [filePath: string]: {
    id: string;
    isClientComponent: boolean;
  };
}

/**
 * Scans a file to determine if it is a client component.
 * In a real framework, this is done via a bundler plugin or AST parsing.
 * Here we do a simple string match for the `"use client"` directive.
 */
export async function isClientComponent(filePath: string): Promise<boolean> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    // Simple check: does it start with the directive?
    // A proper AST parser should be used for production to handle comments, etc.
    return content.includes('"use client"') || content.includes("'use client'");
  } catch (err) {
    return false;
  }
}

/**
 * Traverses the RouteSegment tree to find all potential client components.
 */
import { RouteSegment } from '@snowieedev/vertex-core';

export async function generateClientManifest(root: RouteSegment): Promise<ClientManifest> {
  const manifest: ClientManifest = {};

  async function traverse(node: RouteSegment) {
    const filesToCheck = [node.page, node.layout, node.loading, node.error, node.notFound].filter(Boolean) as string[];

    for (const file of filesToCheck) {
      if (!manifest[file]) {
        const isClient = await isClientComponent(file);
        if (isClient) {
          manifest[file] = {
            id: generateId(file),
            isClientComponent: true,
          };
        }
      }
    }

    for (const child of node.children) {
      await traverse(child);
    }
  }

  await traverse(root);
  return manifest;
}

function generateId(filePath: string) {
  // Generate a safe identifier for the file path
  // In production, this would be a hash of the file path relative to the root
  return Buffer.from(filePath).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
}
