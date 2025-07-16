import type { GraphNode } from '$lib/types/graph';
import { writable } from 'svelte/store';

export const selectedNode = writable<GraphNode | null>(null);
