
export enum HeaderMenuItem {
  RESUME = 'resume',
  RETROSPECTIVES = 'retrospectives',
  POSTS = 'posts'
}


export const HEADER_NAVIGATION_MENU_ITEMS: Array<{ id: HeaderMenuItem, href: string }> = [
  {
    id: HeaderMenuItem.RESUME,
    href: "/resume",
  },
  /*{
    id: HeaderMenuItem.RETROSPECTIVES,
    href: "/retrospectives",
  },
  {
    id: HeaderMenuItem.POSTS,
    href: "/posts",
  },*/
];
