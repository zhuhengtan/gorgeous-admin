interface JsonObject {
  [key: string]: null | number | string | Array<JsonObject> | JsonObject;
}

type CustomRouteObject = Omit<RouteObject, 'children'> & {
  hidden?: boolean;
  name?: string;
  icon?: React.ReactNode;
  checkAuth?: boolean;
  pageType?: PageType;
  children?: CustomRouteObject[];
  entityName?: string;
  key?: string
};

interface AdminInfo {
  id: number;
  name: string;
  email: string;
  adminType: number;
  avatar: string;
  status: number;
  games?: Game[]
}