import { MegaMenuAPI } from "@/utils/type";

export const MegaMenuTransformer = (data: any) => {
  // Handle both real API data and mock data
  let menuItemsData;
  
  if (data?.psdata?.menuItems) {
    // Real API data structure
    menuItemsData = data.psdata.menuItems;
  } else if (data?.menuItems) {
    // Mock data structure
    menuItemsData = data.menuItems;
  } else {
    // Fallback empty array
    menuItemsData = [];
  }

  const menuItems = menuItemsData.map((item: any) => {
    return {
      id: item.id,
      slug: item.slug || `category-${item.id}`,
      label: item.label,
      link: item.link || "/category/" + item.id,
      children: item.children?.map((child: any) => {
        return {
          id: child.id,
          slug: child.slug || `category-${child.id}`,
          title: child.label,
          link: child.link || "/category/" + child.id,
        };
      }) || [],
    };
  });
  
  return {
    menuItems,
  };
};
