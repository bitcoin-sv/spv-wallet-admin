type ExpandableItem = {
  id?: string;
  url?: string;
};

export const createToggleExpandAll = <T extends ExpandableItem>(
  items: T[],
  isAllExpanded: boolean,
  setExpandedItems: (items: string[]) => void,
  setIsAllExpanded: (expanded: boolean) => void,
  getItemId: (item: T) => string = (item) => item.id || `webhook-${item.url}`,
) => {
  if (isAllExpanded) {
    setExpandedItems([]);
  } else {
    const ids = items.map(getItemId);
    setExpandedItems(ids);
  }
  setIsAllExpanded(!isAllExpanded);
};
