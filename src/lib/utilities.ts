import { Entity } from "prismarine-entity";
import { Recipe } from 'prismarine-recipe';

export function asItemEntity(entity: Entity): Entity & { metadata: { 8: { itemId: number } } } | undefined {
    if (entity.type != 'other') {
        return undefined;
    }
    if (entity.entityType != 55) {
        return undefined;
    }
    if ('metadata' in entity && entity.metadata[8] && 'itemId' in entity.metadata[8]) {
        return (entity as Entity & { metadata: { 8: { itemId: number } } });
    }
    return undefined;
}

export function recipeName(recipe: Recipe): string {
    return recipe.delta.map(item => item.count.toString() + "x" + item.id.toString()).join(",")
}