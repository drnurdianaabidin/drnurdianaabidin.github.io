import { getItems, sections, sectionKeys } from './items';

/** Section panels for the home page: title, description, count and image. */
export async function getSectionPanels() {
  return Promise.all(
    sectionKeys.map(async (key, index) => {
      const items = await getItems(key);
      const lead = items.find((item) => item.data.featured) ?? items[0];
      return {
        ...sections[key],
        index,
        count: items.length,
        image: lead?.data.cover,
      };
    })
  );
}

export const countLabel = (n: number) => (n === 1 ? '1 entry' : `${n} entries`);
